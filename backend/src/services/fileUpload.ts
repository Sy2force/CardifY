// File upload service - Image upload management with Multer
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { logger } from './logger';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration for uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadsDir); // Destination directory
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filter to accept only images
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // File accepted
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer configuration with limits and filters
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Uploaded files management service
export class FileUploadService {
  // Generate public URL for a file
  static getFileUrl(filename: string): string {
    return `${process.env.SERVER_URL || 'http://localhost:3006'}/uploads/${filename}`;
  }

  // Delete a file from the filesystem
  static deleteFile(filename: string): boolean {
    try {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`File deleted: ${filename}`);
        return true;
      }
      return false; // File doesn't exist
    } catch (error) {
      logger.error(`Error deleting file ${filename}:`, { error: String(error) });
      return false;
    }
  }

  // Validate image file according to defined criteria
  static validateImageFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Only image files are allowed' };
    }

    return { valid: true }; // File is valid
  }
}
