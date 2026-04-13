/**
 * server/services/quote.service.js
 * Full quote lifecycle: create, revise, approve, decline, expire.
 * Integrates with BullMQ for 2-hour auto-expiry.
 */

import { supabase } from '../config/supabase.js';
import { BookingService } from './booking.service.js';
import { scheduleQuoteExpiry, enqueueNotification } from '../queues/queues.js';
import { AppError, NotFoundError } from '../middleware/errorHandler.js';

export class QuoteService {
  /**
   * Creates a new quote for an assessment booking.
   * Scheduling a 2-hour BullMQ expiry job automatically.
   */
  static async createQuote(bookingId, taskerId, payload) {
    const { labor_cost, materials_cost = 0, notes } = payload;

    // 1. Verify booking is in the correct state for a quote
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('id, status, customer_id, b_type')
      .eq('id', bookingId)
      .single();

    if (bookingErr || !booking) throw new NotFoundError('Booking');
    if (booking.status !== 'assessment') {
      throw new AppError(`Cannot create quote: booking is in "${booking.status}" state, expected "assessment"`, 409);
    }
    if (booking.b_type !== 'assessment') {
      throw new AppError('Quotes are only for assessment-type bookings', 400);
    }

    // 2. Expire any existing pending quotes for this booking
    await supabase
      .from('quotes')
      .update({ status: 'superseded' })
      .eq('booking_id', bookingId)
      .eq('status', 'pending');

    // 3. Create the new quote
    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .insert({
        booking_id: bookingId,
        tasker_id: taskerId,
        labor_cost,
        materials_cost,
        status: 'pending',
      })
      .select()
      .single();

    if (quoteErr) throw new AppError(`Quote creation failed: ${quoteErr.message}`, 500);

    // 4. Update booking to 'quoted' state
    await supabase
      .from('bookings')
      .update({ status: 'quoted', updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    // 5. Schedule 2-hour auto-expiry via BullMQ
    await scheduleQuoteExpiry(quote.id, bookingId);

    // 6. Notify customer of new quote
    await enqueueNotification(booking.customer_id, {
      title: 'Quote Ready for Review',
      body: `Your Tasker sent a quote of GHS ${(labor_cost + materials_cost).toFixed(2)}. You have 2 hours to approve. Tap to review.`,
      type: 'quote',
      data: { bookingId, quoteId: quote.id },
    });

    return quote;
  }

  /**
   * Revises an existing quote.
   * Creates a new quote record, marks old one as superseded, resets 2hr timer.
   */
  static async reviseQuote(quoteId, taskerId, payload) {
    const { labor_cost, materials_cost = 0, revision_reason } = payload;

    const { data: oldQuote } = await supabase
      .from('quotes')
      .select('id, booking_id, tasker_id, status')
      .eq('id', quoteId)
      .single();

    if (!oldQuote) throw new NotFoundError('Quote');
    if (oldQuote.tasker_id !== taskerId) throw new AppError('You can only revise your own quotes', 403);
    if (oldQuote.status !== 'pending') throw new AppError('Can only revise a pending quote', 409);

    // Mark old quote as superseded
    await supabase.from('quotes').update({ status: 'superseded' }).eq('id', quoteId);

    // Cancel old BullMQ expiry job and create new quote
    return this.createQuote(oldQuote.booking_id, taskerId, { labor_cost, materials_cost });
  }

  /**
   * Customer approves a quote.
   * Moves booking to 'deposit_paid' pending state (customer will be directed to pay).
   */
  static async approveQuote(quoteId, customerId) {
    const { data: quote } = await supabase
      .from('quotes')
      .select('id, booking_id, status, total_cost, tasker_id')
      .eq('id', quoteId)
      .single();

    if (!quote) throw new NotFoundError('Quote');
    if (quote.status !== 'pending') throw new AppError(`Quote is already "${quote.status}"`, 409);

    // Verify customer owns the booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('customer_id, status')
      .eq('id', quote.booking_id)
      .single();

    if (!booking) throw new NotFoundError('Booking');
    if (booking.customer_id !== customerId) throw new AppError('Not authorized to approve this quote', 403);
    if (booking.status !== 'quoted') throw new AppError('Booking is not in quoted state', 409);

    // Mark quote as approved
    await supabase.from('quotes').update({ status: 'approved' }).eq('id', quoteId);

    // Update booking with total price and move to awaiting deposit
    await supabase.from('bookings').update({
      quoted_price: quote.total_cost,
      status: 'quoted', // Stays in 'quoted' — moves to 'deposit_paid' after Paystack webhook
      updated_at: new Date().toISOString(),
    }).eq('id', quote.booking_id);

    // Notify tasker
    await enqueueNotification(quote.tasker_id, {
      title: 'Quote Approved!',
      body: `Your quote has been approved! The customer will now make the deposit payment of GHS ${quote.total_cost}.`,
      type: 'quote',
      data: { bookingId: quote.booking_id },
    });

    return { quote, nextStep: 'Proceed to deposit payment' };
  }

  /**
   * Customer declines a quote. Assessment fee is non-refundable.
   */
  static async declineQuote(quoteId, customerId) {
    const { data: quote } = await supabase
      .from('quotes')
      .select('id, booking_id, status')
      .eq('id', quoteId)
      .single();

    if (!quote) throw new NotFoundError('Quote');
    if (quote.status !== 'pending') throw new AppError(`Quote is already "${quote.status}"`, 409);

    await supabase.from('quotes').update({ status: 'declined' }).eq('id', quoteId);

    // Cancel booking — assessment fee kept
    return BookingService.cancelBooking(quote.booking_id, 'Customer declined service quote');
  }

  /**
   * Called by BullMQ quoteExpiryWorker — cancels expired quotes.
   */
  static async expireQuote(quoteId) {
    await supabase.from('quotes').update({ status: 'expired' }).eq('id', quoteId).eq('status', 'pending');
  }

  /**
   * Fetch all quotes for a booking.
   */
  static async getQuotesForBooking(bookingId) {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return data;
  }
}
