import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import carbone from 'carbone';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Activity from '../models/Activity.js';
import Internship from '../models/Internship.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(
  __dirname,
  '../uploads/certificate/template.docx',
);
const carboneRender = promisify(carbone.render);

const formatDate = (d) => format(new Date(d), 'dd MMMM yyyy', { locale: fr });

const isLibreOfficeAvailable = () => {
  try {
    execSync('which soffice || which libreoffice', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

export const generateCertificate = async (internshipId) => {
  const internship = await Internship.getById(internshipId);
  if (!internship) throw new Error('NOT_FOUND');

  if (!fs.existsSync(TEMPLATE_PATH)) throw new Error('NO_TEMPLATE');
  if (!isLibreOfficeAvailable()) throw new Error('NO_LIBREOFFICE');

  const activityRefs = await Internship.getActivities(internshipId);
  const activities = await Promise.all(
    activityRefs.map((a) => Activity.getById(a.id)),
  );

  const data = {
    prenom: internship.firstName,
    nom: internship.lastName,
    email: internship.email,
    date_debut: formatDate(internship.startDate),
    date_fin: formatDate(internship.endDate),
    date_emission: formatDate(new Date()),
    ateliers: activities.filter(Boolean).map((a) => ({
      titre: a.title,
      categories: a.categories?.map((c) => c.name).join(', ') ?? '',
    })),
  };

  return carboneRender(TEMPLATE_PATH, data, { convertTo: 'pdf' });
};

export const saveTemplate = (fileBuffer) => {
  const dir = path.join(__dirname, '../uploads/certificate');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TEMPLATE_PATH, fileBuffer);
};

export const getTemplatePath = () =>
  fs.existsSync(TEMPLATE_PATH) ? TEMPLATE_PATH : null;
