import multer from 'multer';
import { MediaService } from '../services/media.service.js';

// Use memory storage so we can stream the buffer directly to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  },
});

export const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const userId = req.body.userId || req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const url = await MediaService.uploadProfilePhoto(req.file.buffer, userId);
    res.status(200).json({ success: true, message: 'Profile photo uploaded', url });
  } catch (err) {
    next(err);
  }
};

export const uploadIDDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const userId = req.body.userId || req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const url = await MediaService.uploadIDDocument(req.file.buffer, userId);
    res.status(200).json({ success: true, message: 'ID document uploaded', url });
  } catch (err) {
    next(err);
  }
};

export const uploadReceipts = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: 'No files uploaded' });

    const { bookingId, merchantName, totalAmount } = req.body;
    const uploadedBy = req.body.userId || req.user?.userId;

    if (!bookingId || !uploadedBy)
      return res.status(400).json({ success: false, message: 'Missing bookingId or userId' });

    const buffers = req.files.map(f => f.buffer);
    const receipt = await MediaService.uploadReceiptPhotos(buffers, bookingId, uploadedBy, {
      merchantName,
      totalAmount: parseFloat(totalAmount) || 0,
    });

    res.status(201).json({ success: true, message: 'Receipts uploaded', data: receipt });
  } catch (err) {
    next(err);
  }
};
