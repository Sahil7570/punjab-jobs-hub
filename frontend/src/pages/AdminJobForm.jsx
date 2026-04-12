import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobsApi } from '../utils/api';
import { SEO } from '../components/SharedComponents';

const EMPTY_FORM = {
  title: '', department: '', category: 'Police', salary: '',
  totalVacancies: '', lastDate: '', applyLink: '',
  eligibility: { gender: 'Both', minAge: 18, maxAge: 37, qualification: 'Graduate' },
  overview: '', selectionProcess: '',
  documents: [''], stepsToApply: [''], commonMistakes: [''],
};

// ── Dynamic List Field ────────────────────────────────────
const ListField = ({ label, icon, items, onChange, placeholder }) => {
  const update = (i, val) => { const arr = [...items]; arr[i] = val; onChange(arr); };
  const add    = ()       => onChange([...items, '']);
  const remove = (i)      => { if (items.length > 1) onChange(items.filter((_, idx) => idx !== i)); };

  return (
    <div>
      <label className="label">{icon} {label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex items-center justify-center w-6 h-9 shrink-0 text-xs font-bold text-stone-400">{i + 1}</div>
            <input value={item} onChange={(e) => update(i, e.target.value)}
              className="input flex-1" placeholder={`${placeholder} ${i + 1}`} />
            <button type="button" onClick={() => remove(i)}
              className="w-9 h-9 shrink-0 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-lg">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={add}
          className="text-sm text-saffron-600 hover:text-saffron-700 font-semibold flex items-center gap-1.5 mt-1">
          + Add {label.split(' ')[0]}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
const AdminJobForm = () => {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // Load existing job data for edit mode
  useEffect(() => {
    if (!isEdit) return;
    jobsApi.getById(id)
      .then((res) => {
        const job = res.data;
        setForm({
          title:       job.title       || '',
          department:  job.department  || '',
          category:    job.category    || 'Police',
          salary:      job.salary      || '',
          totalVacancies: job.totalVacancies || '',
          lastDate:    job.lastDate ? job.lastDate.slice(0, 10) : '',
          applyLink:   job.applyLink   || '',
          eligibility: {
            gender:        job.eligibility?.gender        || 'Both',
            minAge:        job.eligibility?.minAge        || 18,
            maxAge:        job.eligibility?.maxAge        || 37,
            qualification: job.eligibility?.qualification || 'Graduate',
          },
          overview:         job.overview         || '',
          selectionProcess: job.selectionProcess || '',
          documents:    job.documents?.length    ? job.documents    : [''],
          stepsToApply: job.stepsToApply?.length ? job.stepsToApply : [''],
          commonMistakes: job.commonMistakes?.length ? job.commonMistakes : [''],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set  = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setE = (key, val) => setForm((p) => ({ ...p, eligibility: { ...p.eligibility, [key]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const payload = {
        ...form,
        totalVacancies: form.totalVacancies ? Number(form.totalVacancies) : null,
        documents:     form.documents.filter(Boolean),
        stepsToApply:  form.stepsToApply.filter(Boolean),
        commonMistakes: form.commonMistakes.filter(Boolean),
        eligibility: {
          ...form.eligibility,
          minAge: Number(form.eligibility.minAge),
          maxAge: Number(form.eligibility.maxAge),
        },
      };

      if (isEdit) {
        await jobsApi.update(id, payload);
        setSuccess('Job updated successfully!');
      } else {
        await jobsApi.create(payload);
        setSuccess('Job created successfully!');
        setForm(EMPTY_FORM);
      }
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-400 text-sm">Loading job data...</p>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={isEdit ? 'Edit Job' : 'Add New Job'} />
      <div className="min-h-screen bg-stone-50">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/admin" className="text-stone-500 hover:text-slate-700 transition-colors">
                ← Dashboard
              </Link>
              <span className="text-stone-300">|</span>
              <h1 className="font-display font-semibold text-slate-800">
                {isEdit ? 'Edit Job' : 'Add New Job'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Link to="/admin" className="btn-secondary py-1.5 px-3 text-xs">Cancel</Link>
              <button form="job-form" type="submit" disabled={loading}
                className="btn-primary py-1.5 px-4 text-xs disabled:opacity-60">
                {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {error   && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-5 text-sm">✅ {success}</div>}

          <form id="job-form" onSubmit={handleSubmit} className="space-y-5">

            {/* ── Basic Info ── */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-semibold text-slate-800 text-lg pb-2 border-b border-stone-100">Basic Information</h2>

              <div>
                <label className="label">Job Title *</label>
                <input value={form.title} onChange={(e) => set('title', e.target.value)}
                  required className="input" placeholder="e.g. Punjab Police Constable Recruitment 2025" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Department *</label>
                  <input value={form.department} onChange={(e) => set('department', e.target.value)}
                    required className="input" placeholder="e.g. Punjab Police Department" />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input">
                    <option>Police</option><option>Clerk</option><option>Teaching</option><option>Others</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Salary *</label>
                  <input value={form.salary} onChange={(e) => set('salary', e.target.value)}
                    required className="input" placeholder="e.g. ₹19,900 - ₹63,200 per month" />
                </div>
                <div>
                  <label className="label">Total Vacancies</label>
                  <input type="number" value={form.totalVacancies} onChange={(e) => set('totalVacancies', e.target.value)}
                    className="input" placeholder="e.g. 1746" min="1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Last Date to Apply *</label>
                  <input type="date" value={form.lastDate} onChange={(e) => set('lastDate', e.target.value)}
                    required className="input" />
                </div>
                <div>
                  <label className="label">Official Apply Link *</label>
                  <input type="url" value={form.applyLink} onChange={(e) => set('applyLink', e.target.value)}
                    required className="input" placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* ── Eligibility ── */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-semibold text-slate-800 text-lg pb-2 border-b border-stone-100">Eligibility Criteria</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="label">Gender</label>
                  <select value={form.eligibility.gender} onChange={(e) => setE('gender', e.target.value)} className="input">
                    <option>Both</option><option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="label">Min Age</label>
                  <input type="number" value={form.eligibility.minAge} onChange={(e) => setE('minAge', e.target.value)}
                    className="input" min="16" max="60" />
                </div>
                <div>
                  <label className="label">Max Age</label>
                  <input type="number" value={form.eligibility.maxAge} onChange={(e) => setE('maxAge', e.target.value)}
                    className="input" min="16" max="60" />
                </div>
                <div>
                  <label className="label">Qualification</label>
                  <select value={form.eligibility.qualification} onChange={(e) => setE('qualification', e.target.value)} className="input">
                    <option>10th</option><option>12th</option><option>Graduate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Details ── */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-semibold text-slate-800 text-lg pb-2 border-b border-stone-100">Job Details</h2>

              <div>
                <label className="label">Overview *</label>
                <textarea value={form.overview} onChange={(e) => set('overview', e.target.value)}
                  required rows={4} className="input resize-none"
                  placeholder="Brief description of the job, department, and opportunity..." />
              </div>

              <div>
                <label className="label">Selection Process *</label>
                <textarea value={form.selectionProcess} onChange={(e) => set('selectionProcess', e.target.value)}
                  required rows={3} className="input resize-none"
                  placeholder="Describe the stages of selection: Written Test, Physical Test, Interview..." />
              </div>
            </div>

            {/* ── Lists ── */}
            <div className="card p-6 space-y-6">
              <h2 className="font-display font-semibold text-slate-800 text-lg pb-2 border-b border-stone-100">Detailed Information</h2>

              <ListField label="Documents Required" icon="📁"
                items={form.documents} onChange={(v) => set('documents', v)}
                placeholder="Document" />

              <ListField label="Steps to Apply" icon="🧭"
                items={form.stepsToApply} onChange={(v) => set('stepsToApply', v)}
                placeholder="Step" />

              <ListField label="Common Mistakes" icon="⚠️"
                items={form.commonMistakes} onChange={(v) => set('commonMistakes', v)}
                placeholder="Mistake" />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pb-8">
              <Link to="/admin" className="btn-secondary flex-1 justify-center py-3">Cancel</Link>
              <button type="submit" disabled={loading}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-60 text-base">
                {loading ? 'Saving...' : isEdit ? '✅ Update Job' : '✅ Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminJobForm;
