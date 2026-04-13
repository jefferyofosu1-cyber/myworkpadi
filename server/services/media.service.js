import { cloudinary } from '../config/cloudinaryClient.js';
import { supabase } from '../config/supabase.js';
import { Readable } from 'stream';

export class MediaService {
  /**
   * Streams a file buffer directly to Cloudinary, returns the secure URL.
   * @param {Buffer} buffer - The file buffer from multer's memory storage
   * @param {string} folder - Cloudinary folder (e.g. 'profiles', 'receipts', 'documents')
   * @param {string} [publicId] - Optional custom public ID (default: auto-generated)
   */
  static uploadBuffer(buffer, folder, publicId) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `taskgh/${folder}`,
          public_id: publicId || undefined,
          // Auto-optimize image quality and format
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(new Error(`Cloudinary upload error: ${error.message}`));
          resolve(result);
        }
      );

      const readStream = Readable.from(buffer);
      readStream.pipe(uploadStream);
    });
  }

  /**
   * Uploads a tasker's profile photo.
   * @param {Buffer} fileBuffer - multer file buffer
   * @param {string} userId - tasker's user ID
   */
  static async uploadProfilePhoto(fileBuffer, userId) {
    const result = await this.uploadBuffer(fileBuffer, 'profiles', `profile_${userId}`);
    return result.secure_url;
  }

  /**
   * Uploads a tasker's ID document images (front and back) and stores the URLs in the DB
   * @param {Buffer} frontBuffer
   * @param {Buffer} backBuffer
   * @param {string} userId
   */
  static async uploadGhanaCardPhotos(frontBuffer, backBuffer, userId) {
    const frontResult = await this.uploadBuffer(frontBuffer, 'documents', `id_front_${userId}`);
    const backResult = await this.uploadBuffer(backBuffer, 'documents', `id_back_${userId}`);

    const { error } = await supabase
      .from('tasker_profiles')
      .update({ 
        ghana_card_front_url: frontResult.secure_url,
        ghana_card_back_url: backResult.secure_url 
      })
      .eq('id', userId);

    if (error) throw new Error(`Failed to save ID docs: ${error.message}`);
    
    return { 
      frontUrl: frontResult.secure_url, 
      backUrl: backResult.secure_url 
    };
  }

  /**
   * Uploads a receipt photo for a booking and updates the booking record
   * @param {Buffer} fileBuffer
   * @param {string} bookingId
   */
  static async uploadReceiptPhoto(fileBuffer, bookingId) {
    const result = await this.uploadBuffer(fileBuffer, 'receipts', `receipt_${bookingId}_${Date.now()}`);
    const secureUrl = result.secure_url;

    const { error } = await supabase
      .from('bookings')
      .update({ materials_receipt_url: secureUrl })
      .eq('id', bookingId);

    if (error) throw new Error(`Failed to update booking receipt: ${error.message}`);
    return secureUrl;
  }

  /**
   * Deletes an image from Cloudinary by its public_id
   * @param {string} publicId - e.g. 'taskgh/profiles/profile_abc123'
   */
  static async deleteImage(publicId) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }
}
