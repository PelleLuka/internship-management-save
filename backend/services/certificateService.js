import carbone from 'carbone';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Internship from '../models/Internship.js';
import Activity from '../models/Activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, '../uploads/certificate/template.docx');

const formatDate = (d) => format(new Date(d), 'dd MMMM yyyy', { locale: fr });

export const generateCertificate = (internshipId) =>
  new Promise(async (resolve, reject) => {
    const internship = await Internship.getById(internshipId);
    if (!internship) return reject(new Error('NOT_FOUND'));

    if (!fs.existsSync(TEMPLATE_PATH)) {
      return reject(new Error('NO_TEMPLATE'));
    }

    const activityRefs = await Internship.getActivities(internshipId);
    const activities = await Promise.all(activityRefs.map(a => Activity.getById(a.id)));

    const data = {
      prenom: internship.firstName,
      nom: internship.lastName,
      email: internship.email,
      date_debut: formatDate(internship.startDate),
      date_fin: formatDate(internship.endDate),
      date_emission: formatDate(new Date()),
      ateliers: activities.filter(Boolean).map(a => ({
        titre: a.title,
        categories: a.categories?.map(c => c.name).join(', ') ?? '',
      })),
    };

    carbone.render(TEMPLATE_PATH, data, { convertTo: 'pdf' }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

export const saveTemplate = (fileBuffer) => {
  const dir = path.join(__dirname, '../uploads/certificate');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TEMPLATE_PATH, fileBuffer);
};

export const getTemplatePath = () =>
  fs.existsSync(TEMPLATE_PATH) ? TEMPLATE_PATH : null;
