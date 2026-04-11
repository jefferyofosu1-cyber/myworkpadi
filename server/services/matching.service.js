import { supabase } from '../config/supabase.js';
import { redis } from '../config/redisClient.js';
import { NotificationService } from './notification.service.js';

export class MatchingService {
  /**
   * Calculates the great-circle distance between two points on the Earth's surface.
   * Returns distance in kilometers.
   */
  static _haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = degrees => degrees * (Math.PI / 180);
    const R = 6371; // Earth ratio in KM
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }

  /**
   * High-Performance Geo-Matching via PostGIS RPC.
   * Replaces manual Haversine math for professional-grade performance.
   */
  static async findNearbyTaskers(lat, lng, categoryId, scheduledAt, maxRadius = 10000) {
    const { data: nearby, error } = await supabase
      .rpc('find_nearby_taskers', {
        cust_lat: lat,
        cust_lng: lng,
        req_category_id: categoryId,
        req_scheduled_at: scheduledAt,
        max_radius_meters: maxRadius
      });

    if (error) throw new Error(`Geo-Matching RPC Error: ${error.message}`);
    
    // Convert meters to KM to maintain compatibility with the scoring algorithm
    return (nearby || []).map(t => ({
      ...t,
      distance_km: t.distance_meters / 1000
    }));
  }

  /**
   * Scores and sorts taskers. Higher is better.
   * Rating (40%), Distance proximity (30%), Total Jobs Experience (30%)
   */
  static scoreTaskers(taskers) {
    // Normalize data to avoid massive gaps messing up scores
    const maxJobs = Math.max(...taskers.map(t => t.total_jobs), 1);
    const maxDist = Math.max(...taskers.map(t => t.distance_km), 1);
    
    const scored = taskers.map(t => {
       const scoreRating = (t.rating / 5) * 40; // Max 40
       
       // Invert distance: closer gets higher score. Max 30
       const scoreDistance = ((maxDist - t.distance_km) / maxDist) * 30; 
       
       const scoreJobs = (t.total_jobs / maxJobs) * 30; // Max 30
       
       return {
         ...t,
         score: scoreRating + scoreDistance + scoreJobs
       };
    });
    
    // Sort descending by score
    return scored.sort((a, b) => b.score - a.score);
  }

  /**
   * Initiates the Broadcast logic to the top 3 matches.
   */
  static async broadcastJob(bookingId, customerLat, customerLng, categoryId, maxRadius = 10000) {
    try {
      console.log(`[Matching] Booting sequence for Booking: ${bookingId}...`);
      
      // 1. Fetch Booking for context (availability & rounds)
      const { data: booking, error: fetchErr } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();
        
      if (fetchErr || !booking) throw new Error('Booking not found');

      const nearby = await this.findNearbyTaskers(
          customerLat, 
          customerLng, 
          categoryId, 
          booking.scheduled_at, 
          maxRadius
      );
      if (nearby.length === 0) {
         console.warn(`[Matching] No taskers found within reach for booking ${bookingId}`);
         // Optionally, alert admin or refund customer via fallback mechanism.
         return false;
      }
      
      const ranked = this.scoreTaskers(nearby);
      const top3 = ranked.slice(0, 3);
      
      // Increment Matching Rounds (Process 4 / Step 2 of Refund Policy)
      const { data: updatedBk, error: roundErr } = await supabase
        .from('bookings')
        .update({ matching_rounds: (booking.matching_rounds || 0) + 1 })
        .eq('id', bookingId)
        .select('matching_rounds')
        .single();

      if (updatedBk && updatedBk.matching_rounds >= 3) {
          console.log(`[Matching] Booking ${bookingId} failed after 3 rounds. Updating status.`);
          const { BookingService } = await import('./booking.service.js');
          await BookingService.transitionStatus(bookingId, 'matching_failed');
          return false;
      }

      const targetUserIds = top3.map(t => t.tasker_id);
      
      console.log(`[Matching] Targeting Top ${top3.length} Taskers with Unified Alerts:`, targetUserIds);
      
      // Store targeted IDs for validation - 5 Minute Window (300s)
      await redis.set(`job_offers:${bookingId}`, JSON.stringify(targetUserIds), 'EX', 300);
 
      // Trigger Unified alerts (Push -> SMS)
      for (const userId of targetUserIds) {
          await NotificationService.sendUnified(userId, {
              title: 'New Job Alert!',
              body: `[TaskGH] New Job Alert! Location: ${booking.location_address}. You have 5 minutes to accept.`,
              data: { bookingId: bookingId }
          });
      }
      
      return top3;
    } catch (err) {
       console.error('[Matching Error]:', err);
       return false;
    }
  }
  
  /**
   * Sends a targeted offer to a manually selected Tasker.
   * Exclusive 10-Minute Response Window.
   */
  static async sendDirectOffer(bookingId, taskerId) {
    console.log(`[Matching] Sending Direct Offer for Booking ${bookingId} to Tasker ${taskerId}`);
    
    // 1. Fetch Tasker phone & booking details
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, profiles!bookings_tasker_id_fkey(phone_number)')
      .eq('id', bookingId)
      .single();

    if (!booking) throw new Error('Booking not found');

    const taskerPhone = booking.profiles?.phone_number;

    // 2. Set exclusive target in Redis (10 Mins / 600s)
    await redis.set(`job_offers:${bookingId}`, JSON.stringify([taskerId]), 'EX', 600);
    
    // 3. Notify Tasker
    const message = `[TaskGH] EXCLUSIVE Direct Job Request! Location: ${booking.location_address}. You have 10 minutes to accept. View: https://myworkpadi.vercel.app/jobs/${bookingId}`;
    await NotificationService.sendSMS(taskerPhone, message);
    await NotificationService.sendPush(taskerId, 'Direct Job Request', message);

    return true;
  }

  /**
   * Allows a Tasker to explicitly decline a manual request,
   * triggering immediate fallback to the automated algorithm.
   */
  static async declineDirectOffer(bookingId, taskerId) {
    console.log(`[Matching] Tasker ${taskerId} declined Direct Offer for ${bookingId}. Falling back.`);
    
    // 1. Clear exclusive offer
    await redis.del(`job_offers:${bookingId}`);
    
    // 2. Reset Booking to ensure it's eligible for automated matching
    const { data: updatedBk } = await supabase
      .from('bookings')
      .update({ 
          tasker_id: null, 
          is_manual_selection: false 
      })
      .eq('id', bookingId)
      .select()
      .single();

    // 3. Trigger General Algorithm
    return await this.broadcastJob(
        updatedBk.id, 
        updatedBk.location_lat, 
        updatedBk.location_lng, 
        updatedBk.category_id
    );
  }

  /**
   * Atomic Acceptance Logic
   */
  static async acceptJob(bookingId, taskerId) {
    // 1. Verify if the job is still available and if this tasker was targeted
    const targetIdsJson = await redis.get(`job_offers:${bookingId}`);
    if (!targetIdsJson) {
      throw new Error('This job offer has expired or is no longer available.');
    }

    const targetIds = JSON.parse(targetIdsJson);
    if (!targetIds.includes(taskerId)) {
      throw new Error('You are not eligible to accept this specific job offer.');
    }

    // 2. Perform atomic update in Supabase
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ 
        tasker_id: taskerId, 
        status: 'assigned',
        assigned_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      // Check for null tasker_id OR if it's the specific tasker for a direct offer
      .or(`tasker_id.is.null,tasker_id.eq.${taskerId}`)
      .select()
      .single();

    if (error || !booking) {
      throw new Error('Could not accept job. It may have been taken by another tasker.');
    }

    // 3. Clear the offer from Redis
    await redis.del(`job_offers:${bookingId}`);

    // 4. Notify Customer (Stub)
    console.log(`[Matching] Job ${bookingId} successfully assigned to Tasker ${taskerId}`);
    
    return booking;
  }
}
