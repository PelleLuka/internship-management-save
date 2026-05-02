import * as certificateService from '../services/certificateService.js';
import { uploadCertificateTemplate } from '../middleware/upload.js';
import logger from '../config/logger.js';

export const generateCertificate = async (req, res) => {
  try {
    const pdf = await certificateService.generateCertificate(Number(req.params.id));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificat-stage-${req.params.id}.pdf"`,
    });
    res.send(pdf);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Internship not found' });
    if (err.message === 'NO_TEMPLATE') return res.status(400).json({ error: 'No certificate template uploaded yet' });
    logger.error(err);
    res.status(500).json({ error: 'Certificate generation failed' });
  }
};

export const uploadTemplate = (req, res) => {
  uploadCertificateTemplate(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true });
  });
};

export const downloadTemplate = (req, res) => {
  const templatePath = certificateService.getTemplatePath();
  if (!templatePath) return res.status(404).json({ error: 'No template uploaded' });
  res.download(templatePath, 'certificate-template.docx');
};
