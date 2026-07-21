import { Router, type Response } from 'express';
import multer from 'multer';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { r2Service } from '../services/r2Service.js';
import { analyticsService } from '../services/analyticsService.js';

const router = Router();

// Set up multer with memory storage (handles file buffers in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Restrict to images/documents for safety
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, and TXT are allowed.'));
    }
  }
});

/**
 * @route POST /api/uploads
 * @desc Upload a file to Cloudflare R2 or mock local storage fallback
 * @access Private
 */
router.post('/', requireAuth, upload.single('file'), async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const file = req.file;
    const userId = req.user?.id || 'anonymous';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`[Upload Router] User ${userId} is uploading file: ${file.originalname} (${file.size} bytes)`);

    // Upload to Cloudflare R2 (or local fallback)
    const fileUrl = await r2Service.uploadFile(file.buffer, file.originalname, file.mimetype);

    // Track the upload in PostHog analytics
    await analyticsService.trackFeatureUsage(userId, 'file_upload', {
      file_size_bytes: file.size,
      mime_type: file.mimetype,
      original_name: file.originalname,
      is_r2: !fileUrl.startsWith('/uploads/') // True if uploaded to R2, false if local fallback
    });

    return res.status(200).json({
      success: true,
      url: fileUrl,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    });

  } catch (error: any) {
    console.error('[Upload Router] Error processing upload:', error);
    return res.status(500).json({
      error: 'Upload failed',
      details: error?.message || 'Unknown error occurred'
    });
  }
});

export default router;
