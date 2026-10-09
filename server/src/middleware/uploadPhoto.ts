import multer from 'multer';
import { BadRequestError } from '../errors/BadRequestError';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    if (!ok) {
      cb(new BadRequestError('Only JPEG, PNG, or WebP allowed', 'PHOTO_TYPE_INVALID'));
      return;
    }
    cb(null, true);
  },
});

export const uploadPhotoMiddleware = upload.single('photo');
