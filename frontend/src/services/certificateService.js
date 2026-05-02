import axios from 'axios';

export const downloadCertificate = async (internshipId) => {
  const res = await axios.get(`/api/internships/${internshipId}/certificate`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificat-stage-${internshipId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

export const getCertificateBlobUrl = async (internshipId) => {
  const res = await axios.get(`/api/internships/${internshipId}/certificate`, {
    responseType: 'blob',
  });
  return URL.createObjectURL(res.data);
};

export const uploadCertificateTemplate = async (file) => {
  const form = new FormData();
  form.append('template', file);
  await axios.post('/api/certificate/template', form);
};

export const downloadCertificateTemplate = () => {
  window.open('/api/certificate/template', '_blank');
};
