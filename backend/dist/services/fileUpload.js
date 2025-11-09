"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./logger");
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
const fileFilter = (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter,
});
class FileUploadService {
    static getFileUrl(filename) {
        return `${process.env.SERVER_URL || 'http://localhost:3006'}/uploads/${filename}`;
    }
    static deleteFile(filename) {
        try {
            const filePath = path_1.default.join(uploadsDir, filename);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                logger_1.logger.info(`File deleted: ${filename}`);
                return true;
            }
            return false;
        }
        catch (error) {
            logger_1.logger.error(`Error deleting file ${filename}:`, { error: String(error) });
            return false;
        }
    }
    static validateImageFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            return { valid: false, error: 'File size must be less than 5MB' };
        }
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return { valid: false, error: 'Only image files are allowed' };
        }
        return { valid: true };
    }
}
exports.FileUploadService = FileUploadService;
