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
   * Uploads a tasker's ID document image and stores the URL in the DB
   * @param {Buffer} fileBuffer
   * @param {string} userId
   */
  static async uploadIDDocument(fileBuffer, userId) {
    const result = await this.uploadBuffer(fileBuffer, 'documents', `id_${userId}`);
    const secureUrl = result.secure_url;

    // Persist URL on the tasker_profiles record
    const { error } = await supabase
      .from('tasker_profiles')
      .update({ id_document_url: secureUrl })
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to save ID doc URL: ${error.message}`);
    return secureUrl;
  }

  /**
   * Uploads receipt photos for a booking and creates a DB record
   * @param {Buffer[]} fileBuffers - array of multer file buffers
   * @param {string} bookingId
   * @param {string} uploadedBy - userId
   * @param {object} meta - { merchantName, totalAmount }
   */
  static async uploadReceiptPhotos(fileBuffers, bookingId, uploadedBy, meta = {}) {
    const uploadPromises = fileBuffers.map((buf, i) =>
      this.uploadBuffer(buf, 'receipts', `receipt_${bookingId}_${i}`)
    );

    const results = await Promise.all(uploadPromises);
    const photoUrls = results.map(r => r.secure_url);

    // Persist the receipts record in Supabase
    const { data: receipt, error } = await supabase
      .from('receipts')
      .insert({
        booking_id: bookingId,
        uploaded_by: uploadedBy,
        photo_urls: photoUrls,
        merchant_name: meta.merchantName || null,
        total_amount_ghs: meta.totalAmount || 0,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save receipt record: ${error.message}`);
    return receipt;
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
