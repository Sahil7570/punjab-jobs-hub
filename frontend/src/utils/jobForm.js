export const CATEGORY_OPTIONS = ['Police', 'Clerk', 'Teaching', 'Others'];
export const GENDER_OPTIONS = ['Both', 'Male', 'Female'];
export const QUALIFICATION_OPTIONS = ['10th', '12th', 'Graduate'];

export const createEmptyJobForm = () => ({
  title: '',
  department: '',
  category: 'Police',
  salary: '',
  totalVacancies: '',
  lastDate: '',
  applyLink: '',
  overview: '',
  selectionProcess: '',
  eligibility: {
    gender: 'Both',
    minAge: 18,
    maxAge: 37,
    qualification: 'Graduate',
  },
  documents: [''],
  stepsToApply: [''],
  commonMistakes: [''],
});

export const mapJobToForm = (job) => ({
  title: job?.title || '',
  department: job?.department || '',
  category: job?.category || 'Police',
  salary: job?.salary || '',
  totalVacancies: job?.totalVacancies ?? '',
  lastDate: job?.lastDate ? job.lastDate.slice(0, 10) : '',
  applyLink: job?.applyLink || '',
  overview: job?.overview || '',
  selectionProcess: job?.selectionProcess || '',
  eligibility: {
    gender: job?.eligibility?.gender || 'Both',
    minAge: job?.eligibility?.minAge ?? 18,
    maxAge: job?.eligibility?.maxAge ?? 37,
    qualification: job?.eligibility?.qualification || 'Graduate',
  },
  documents: job?.documents?.length ? job.documents : [''],
  stepsToApply: job?.stepsToApply?.length ? job.stepsToApply : [''],
  commonMistakes: job?.commonMistakes?.length ? job.commonMistakes : [''],
});

export const validateJobForm = (form) => {
  if (!form.title.trim()) return 'Job title is required.';
  if (!form.department.trim()) return 'Department is required.';
  if (!form.salary.trim()) return 'Salary is required.';
  if (!form.lastDate) return 'Last date is required.';
  if (!form.applyLink.trim()) return 'Apply link is required.';

  try {
    new URL(form.applyLink);
  } catch {
    return 'Apply link must be a valid URL.';
  }

  const minAge = Number(form.eligibility.minAge);
  const maxAge = Number(form.eligibility.maxAge);

  if (Number.isNaN(minAge) || minAge < 16 || minAge > 60) {
    return 'Minimum age must be between 16 and 60.';
  }

  if (Number.isNaN(maxAge) || maxAge < 16 || maxAge > 60) {
    return 'Maximum age must be between 16 and 60.';
  }

  if (minAge > maxAge) {
    return 'Minimum age cannot be greater than maximum age.';
  }

  return '';
};

export const normalizeJobPayload = (form) => ({
  ...form,
  title: form.title.trim(),
  department: form.department.trim(),
  salary: form.salary.trim(),
  applyLink: form.applyLink.trim(),
  overview: form.overview.trim(),
  selectionProcess: form.selectionProcess.trim(),
  totalVacancies: form.totalVacancies === '' ? null : Number(form.totalVacancies),
  eligibility: {
    ...form.eligibility,
    minAge: Number(form.eligibility.minAge),
    maxAge: Number(form.eligibility.maxAge),
  },
  documents: form.documents.map((item) => item.trim()).filter(Boolean),
  stepsToApply: form.stepsToApply.map((item) => item.trim()).filter(Boolean),
  commonMistakes: form.commonMistakes.map((item) => item.trim()).filter(Boolean),
});
