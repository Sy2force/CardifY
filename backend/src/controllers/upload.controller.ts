import { Request, Response } from 'express';
import { FileUploadService } from '../services/fileUpload';
import { logger } from '../services/logger';

// Extended Request interface with user property
interface AuthRequest extends Request {
  user?: {
    _id: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isBusiness: boolean;
    role: string;
  };
}

export const uploadImage = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    // Validate the uploaded file
    const validation = FileUploadService.validateImageFile(req.file);
    if (!validation.valid) {
      // Delete the uploaded file if validation fails
      FileUploadService.deleteFile(req.file.filename);
      return res.status(400).json({
        message: validation.error
      });
    }

    const fileUrl = FileUploadService.getFileUrl(req.file.filename);
    
    logger.info(`Image uploaded successfully: ${req.file.filename} by user ${req.user?.email}`);

    res.json({
      message: 'Image uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    logger.error('Upload image error:', { error: String(error) });
    res.status(500).json({ message: 'Server error during file upload' });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        message: 'Filename is required'
      });
    }

    const deleted = FileUploadService.deleteFile(filename);
    
    if (deleted) {
      logger.info(`Image deleted successfully: ${filename} by user ${req.user?.email}`);
      res.json({
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        message: 'File not found'
      });
    }
  } catch (error) {
    logger.error('Delete image error:', { error: String(error) });
    res.status(500).json({ message: 'Server error during file deletion' });
  }
};
