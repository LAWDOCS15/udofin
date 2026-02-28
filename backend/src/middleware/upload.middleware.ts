// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { Request } from 'express';

// const storage = multer.diskStorage({
//   destination: (req: Request, file: Express.Multer.File, cb: Function) => {
//     let folder = 'uploads/';
    
//     // Route files to specific folders based on their field name
//     if (file.fieldname === 'panCard') folder += 'pan/';
//     else if (file.fieldname === 'aadhaarCard') folder += 'aadhaar/';
//     else if (file.fieldname === 'selfie') folder += 'selfies/';
//     else folder += 'docs/';

//     // Automatically create the folder if it does not exist
//     if (!fs.existsSync(folder)) {
//       fs.mkdirSync(folder, { recursive: true });
//     }

//     cb(null, folder);
//   },
//   filename: (req: Request, file: Express.Multer.File, cb: Function) => {
//     // Generate unique filename to prevent overwriting
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
//   const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
//   }
// };

// export const uploadDocuments = multer({ 
//   storage, 
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
// });




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

// =============================
// 📁 Storage Configuration
// =============================
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


// =============================
// 🔎 File Filter (Strict)
// =============================
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


// =============================
// 🚀 Export Upload Middleware
// =============================
export const uploadDocuments = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3 // Maximum number of files
  }
});