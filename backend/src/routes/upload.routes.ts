import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../services/fileUpload';
import { uploadImage, deleteImage } from '../controllers/upload.controller';

const router = Router();

// Upload image endpoint
router.post('/image', authMiddleware, upload.single('image'), uploadImage);

// Delete image endpoint
router.delete('/image/:filename', authMiddleware, deleteImage);

export default router;
