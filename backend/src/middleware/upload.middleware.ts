import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

// Ensure upload root exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

// Storage Configuration

const storage = multer.diskStorage({

  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {

    let subFolder = 'docs';

    if (file.fieldname === 'panCard') subFolder = 'pan';
    else if (file.fieldname === 'aadhaarCard') subFolder = 'aadhaar';
    else if (file.fieldname === 'selfie') subFolder = 'selfies';

    const finalPath = path.join(UPLOAD_ROOT, subFolder);

    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    cb(null, finalPath);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {

    const safeExtension = path.extname(file.originalname).toLowerCase();

    const randomName = crypto.randomBytes(16).toString('hex');

    const finalName = `${file.fieldname}-${randomName}${safeExtension}`;

    cb(null, finalName);
  }
});


//  File Filter (Strict)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error('Invalid file type.'));
    return;
  }

  if (!allowedExtensions.includes(ext)) {
    cb(new Error('Invalid file extension.'));
    return;
  }

  cb(null, true);
};


//  Export Upload Middleware
export const uploadDocuments = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3 // Maximum number of files
  }
});