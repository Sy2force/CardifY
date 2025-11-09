"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const fileUpload_1 = require("../services/fileUpload");
const logger_1 = require("../services/logger");
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }
        const validation = fileUpload_1.FileUploadService.validateImageFile(req.file);
        if (!validation.valid) {
            fileUpload_1.FileUploadService.deleteFile(req.file.filename);
            return res.status(400).json({
                message: validation.error
            });
        }
        const fileUrl = fileUpload_1.FileUploadService.getFileUrl(req.file.filename);
        logger_1.logger.info(`Image uploaded successfully: ${req.file.filename} by user ${req.user?.email}`);
        res.json({
            message: 'Image uploaded successfully',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                url: fileUrl
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Upload image error:', { error: String(error) });
        res.status(500).json({ message: 'Server error during file upload' });
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename) {
            return res.status(400).json({
                message: 'Filename is required'
            });
        }
        const deleted = fileUpload_1.FileUploadService.deleteFile(filename);
        if (deleted) {
            logger_1.logger.info(`Image deleted successfully: ${filename} by user ${req.user?.email}`);
            res.json({
                message: 'Image deleted successfully'
            });
        }
        else {
            res.status(404).json({
                message: 'File not found'
            });
        }
    }
    catch (error) {
        logger_1.logger.error('Delete image error:', { error: String(error) });
        res.status(500).json({ message: 'Server error during file deletion' });
    }
};
exports.deleteImage = deleteImage;
