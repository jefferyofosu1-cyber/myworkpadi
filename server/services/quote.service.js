import { supabase } from '../config/supabase.js';
import { BookingService } from './booking.service.js';

export class QuoteService {
  /**
   * Tasker submits a labor + materials breakdown (Process 2 - Assessment Step 4)
   */
  static async submitQuote(bookingId, taskerId, { laborCost, materialsCost }) {
    // 1. Verify booking is in 'assessment' status
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) throw new Error('Booking not found');
    if (booking.status !== 'assessment') {
      throw new Error(`Quote can only be submitted in "assessment" status. Current: ${booking.status}`);
    }

    // 2. Insert Quote record
    const { data: quote, error: quoteErr } = await supabase
      .from('quotes')
      .insert({
        booking_id: bookingId,
        tasker_id: taskerId,
        labor_cost: laborCost,
        materials_cost: materialsCost,
        status: 'pending'
      })
      .select()
      .single();

    if (quoteErr) throw new Error(`Quote submission failed: ${quoteErr.message}`);

    // 3. (Optional) Transition booking to 'quoted' to notify customer
    await BookingService.transitionStatus(bookingId, 'quoted');

    return quote;
  }

  /**
   * Customer approves the quote, triggering the 50% deposit (Process 2 - Assessment Step 5-6)
   */
  static async approveQuote(bookingId, quoteId) {
    const { data: quote, error: fetchErr } = await supabase
      .from('quotes')
      .select('*, bookings(status, assessment_fee_ghs)')
      .eq('id', quoteId)
      .single();

    if (fetchErr || !quote) throw new Error('Quote not found');

    // 1. Mark quote as approved
    await supabase.from('quotes').update({ status: 'approved' }).eq('id', quoteId);

    // 2. Transition booking to 'deposit_paid'
    // NOTE: In a live app, this would be preceded by a Paystack Checkout for the 50% deposit.
    // For now, we simulate the approval transitioning the state.
    const updated = await BookingService.transitionStatus(bookingId, 'deposit_paid');

    return { message: 'Quote approved. 50% deposit pending verification.', booking: updated };
  }
}
