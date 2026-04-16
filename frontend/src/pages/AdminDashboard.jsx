import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import JobFormFields from '../components/admin/JobFormFields';
import { LoadingSpinner, SEO } from '../components/SharedComponents';
import { adminApi, jobsApi } from '../utils/api';
import { createEmptyJobForm, normalizeJobPayload, validateJobForm } from '../utils/jobForm';

const StatCard = ({ label, value, tone = 'stone' }) => {
  const toneClassMap = {
    saffron: 'border-saffron-200 bg-saffron-50 text-saffron-700',
    green: 'border-green-200 bg-green-50 text-green-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    stone: 'border-stone-200 bg-white text-slate-800',
  };

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClassMap[tone] || toneClassMap.stone}`}>
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const [form, setForm] = useState(createEmptyJobForm);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await adminApi.stats();
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalJobs = useMemo(() => stats?.stats?.totalJobs ?? 0, [stats]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const validationMessage = validateJobForm(form);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);
    try {
      await jobsApi.create(normalizeJobPayload(form));
      setMessage('Job created successfully.');
      setForm(createEmptyJobForm());
      fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Dashboard" />
      <AdminLayout
        title="Admin Dashboard"
        subtitle="Create new job posts, track totals, and jump into job management."
        actions={
          <>
            <Link to="/" target="_blank" rel="noreferrer" className="btn-secondary px-4 py-2">
              View Public Site
            </Link>
            <Link to="/admin/jobs" className="btn-primary px-4 py-2">
              Manage Jobs
            </Link>
          </>
        }
      >
        <div className="space-y-8">
          {statsLoading ? (
            <div className="card">
              <LoadingSpinner message="Loading dashboard stats..." />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Jobs" value={totalJobs} tone="saffron" />
              <StatCard label="Active Jobs" value={stats?.stats?.activeJobs ?? 0} tone="green" />
              <StatCard label="Closing Soon" value={stats?.stats?.urgentJobs ?? 0} tone="blue" />
              <StatCard label="Subscribers" value={stats?.stats?.totalSubscribers ?? 0} />
            </div>
          )}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}
              {message ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              ) : null}

              <JobFormFields form={form} onChange={setForm} />

              <div className="flex flex-col gap-3 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setForm(createEmptyJobForm());
                    setError('');
                    setMessage('');
                  }}
                  className="btn-secondary justify-center px-5 py-3"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary justify-center px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Publishing Job...' : 'Publish Job'}
                </button>
              </div>
            </form>

            <aside className="space-y-6">
              <section className="card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900">Quick Notes</h2>
                <div className="mt-4 space-y-3 text-sm leading-6 text-stone-500">
                  <p>Jobs created here are sent through the protected admin API using your stored JWT token.</p>
                  <p>All fields map directly to the existing Job model, so public job pages stay intact.</p>
                  <p>Use the management screen to update expired listings, fix typos, or remove outdated jobs.</p>
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-display text-lg font-semibold text-slate-900">Category Breakdown</h2>
                <div className="mt-4 space-y-3">
                  {(stats?.categoryBreakdown || []).length === 0 ? (
                    <p className="text-sm text-stone-500">No category data yet.</p>
                  ) : (
                    stats.categoryBreakdown.map((item) => (
                      <div key={item._id} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
                        <span className="text-sm font-medium text-slate-700">{item._id}</span>
                        <span className="text-sm font-semibold text-saffron-600">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
