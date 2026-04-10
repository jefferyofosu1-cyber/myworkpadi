import { BookingService } from '../services/booking.service.js';
import { MatchingService } from '../services/matching.service.js';
import { supabase } from '../config/supabaseClient.js';

export const createBooking = async (req, res, next) => {
  try {
    const customer_id = req.user ? req.user.userId : req.body.customer_id; // Usually from JWT auth middleware
    if (!customer_id) {
       return res.status(401).json({ success: false, message: 'Unauthorized / Missing customer ID' });
    }

    const booking = await BookingService.createBooking(customer_id, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Booking created and pending evaluation',
      data: booking
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const transitionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) return res.status(400).json({ success: false, message: "Missing target status" });

    const updated = await BookingService.transitionStatus(id, status);
    
    res.status(200).json({
      success: true,
      message: `Status transitioned to ${status}`,
      data: updated
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const acceptJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasker_id = req.user ? req.user.userId : req.body.tasker_id;

    if (!tasker_id) {
       return res.status(401).json({ success: false, message: 'Unauthorized / Missing tasker ID' });
    }

    const booking = await MatchingService.acceptJob(id, tasker_id);

    res.status(200).json({
      success: true,
      message: 'Job successfully accepted and assigned.',
      data: booking
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const getAvailableJobs = async (req, res, next) => {
  try {
    const tasker_id = req.user ? req.user.userId : req.query.tasker_id;
    if (!tasker_id) {
       return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // This is a simple implementation: fetch all bookings in 'pending' or 'broadcasted' status 
    // that don't have a tasker yet.
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, categories(name)')
      .is('tasker_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const tasker_id = req.user ? req.user.userId : req.query.tasker_id;
    if (!tasker_id) {
       return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, categories(name), customer:customer_id(full_name)')
      .eq('tasker_id', tasker_id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};
