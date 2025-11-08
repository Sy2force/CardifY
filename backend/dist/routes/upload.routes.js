"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const fileUpload_1 = require("../services/fileUpload");
const upload_controller_1 = require("../controllers/upload.controller");
const router = (0, express_1.Router)();
// Upload image endpoint
router.post('/image', auth_1.authMiddleware, fileUpload_1.upload.single('image'), upload_controller_1.uploadImage);
// Delete image endpoint
router.delete('/image/:filename', auth_1.authMiddleware, upload_controller_1.deleteImage);
exports.default = router;
