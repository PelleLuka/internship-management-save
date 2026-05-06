import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.presentation',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
];

const activityStorage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads/activities'),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${randomUUID()}-${safeName}`);
  },
});

const certificateStorage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads/certificate'),
  filename: (_req, _file, cb) => cb(null, 'template.docx'),
});

const documentFileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new Error('INVALID_FILE_TYPE'));
};

export const uploadActivityDocument = multer({
  storage: activityStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: documentFileFilter,
}).single('document');

export const uploadCertificateTemplate = multer({
  storage: certificateStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const docxMime =
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (file.mimetype === docxMime) return cb(null, true);
    cb(new Error('INVALID_FILE_TYPE'));
  },
}).single('template');
