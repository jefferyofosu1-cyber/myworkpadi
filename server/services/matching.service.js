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
  static async findNearbyTaskers(lat, lng, categoryId) {
    const { data: nearby, error } = await supabase
      .rpc('find_nearby_taskers', {
        cust_lat: lat,
        cust_lng: lng,
        category_id: categoryId
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
  static async broadcastJob(bookingId, customerLat, customerLng, categoryId) {
    try {
      console.log(`[Matching] Booting sequence for Booking: ${bookingId}...`);
      
      const nearby = await this.findNearbyTaskers(customerLat, customerLng, categoryId);
      if (nearby.length === 0) {
         console.warn(`[Matching] No taskers found within reach for booking ${bookingId}`);
         // Optionally, alert admin or refund customer via fallback mechanism.
         return false;
      }
      
      const ranked = this.scoreTaskers(nearby);
      const top3 = ranked.slice(0, 3);
      
      const targetUserIds = top3.map(t => t.tasker_id);
      
      // Fetch full booking details for the notification context
      const { data: booking } = await supabase
        .from('bookings')
        .select('*, categories(name)')
        .eq('id', bookingId)
        .single();

      const phones = top3.map(t => t.phone).filter(Boolean);
      
      console.log(`[Matching] Targetting Top ${top3.length} Taskers with SMS:`, phones);
      
      // Store targeted IDs for validation - 5 Minute Window (300s)
      await redis.set(`job_offers:${bookingId}`, JSON.stringify(targetUserIds), 'EX', 300);

      // Trigger real SMS alerts
      if (phones.length > 0) {
        await NotificationService.broadcastJobAlert(phones, booking);
      }
      
      return top3;
    } catch (err) {
       console.error('[Matching Error]:', err);
       return false;
    }
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
      // Status must be either 'pending' (if fixed) or 'broadcasted' depends on flow
      // To be safe, we check if tasker_id is null
      .is('tasker_id', null) 
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
