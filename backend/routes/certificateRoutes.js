import express from 'express';
import { uploadTemplate, downloadTemplate } from '../controllers/certificateController.js';

const router = express.Router();
router.post('/template', uploadTemplate);
router.get('/template', downloadTemplate);
export default router;
