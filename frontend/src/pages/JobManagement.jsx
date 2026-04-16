import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import JobFormFields from '../components/admin/JobFormFields';
import { LoadingSpinner, SEO } from '../components/SharedComponents';
import { jobsApi } from '../utils/api';
import { formatDate, getUrgencyLevel } from '../utils/helpers';
import { mapJobToForm, normalizeJobPayload, validateJobForm } from '../utils/jobForm';

const getStatusStyles = (lastDate) => {
  const urgency = getUrgencyLevel(lastDate);

  if (urgency === 'expired') {
    return { label: 'Expired', className: 'bg-stone-100 text-stone-600' };
  }

  if (urgency === 'urgent') {
    return { label: 'Closing Soon', className: 'bg-red-100 text-red-600' };
  }

  return { label: 'Active', className: 'bg-green-100 text-green-700' };
};

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [search, setSearch] = useState('');
  const [editingJobId, setEditingJobId] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [formError, setFormError] = useState('');
  const [pageMessage, setPageMessage] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await jobsApi.getAdminList({ page: 1, limit: 100, search: search.trim() || undefined });
      setJobs(response.data || []);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadJobs();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const startEditing = async (jobId) => {
    setPageMessage('');
    setFormError('');

    try {
      const response = await jobsApi.getAdminById(jobId);
      setEditingJobId(jobId);
      setEditForm(mapJobToForm(response.data));
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const closeEditor = () => {
    setEditingJobId('');
    setEditForm(null);
    setFormError('');
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const validationMessage = validateJobForm(editForm);

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setSaving(true);
    setFormError('');
    setPageMessage('');

    try {
      await jobsApi.update(editingJobId, normalizeJobPayload(editForm));
      setPageMessage('Job updated successfully.');
      closeEditor();
      loadJobs();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jobId, title) => {
    const confirmed = window.confirm(`Delete "${title}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setDeletingId(jobId);
    setFetchError('');
    setPageMessage('');

    try {
      await jobsApi.delete(jobId);
      setJobs((current) => current.filter((job) => job._id !== jobId));
      if (editingJobId === jobId) {
        closeEditor();
      }
      setPageMessage('Job deleted successfully.');
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setDeletingId('');
    }
  };

  const totalJobs = useMemo(() => jobs.length, [jobs]);

  return (
    <>
      <SEO title="Job Management" />
      <AdminLayout title="Job Management" subtitle="Search, edit, and delete jobs without affecting the public browsing flow.">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Total jobs in current view</p>
              <p className="mt-1 font-display text-3xl font-semibold text-slate-900">{totalJobs}</p>
            </div>

            <div className="w-full max-w-md">
              <label className="label">Search Jobs</label>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input"
                placeholder="Search by title, department, or category"
              />
            </div>
          </div>

          {fetchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {fetchError}
            </div>
          ) : null}

          {pageMessage ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {pageMessage}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
            <section className="card overflow-hidden">
              {loading ? (
                <LoadingSpinner message="Loading jobs..." />
              ) : jobs.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="font-display text-2xl font-semibold text-slate-800">No jobs found</p>
                  <p className="mt-2 text-sm text-stone-500">Try changing the search term or add a new job from the dashboard.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-stone-50">
                      <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-[0.18em] text-stone-500">
                        <th className="px-4 py-4 font-semibold">Title</th>
                        <th className="px-4 py-4 font-semibold">Category</th>
                        <th className="px-4 py-4 font-semibold">Last Date</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                        <th className="px-4 py-4 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {jobs.map((job) => {
                        const status = getStatusStyles(job.lastDate);
                        return (
                          <tr key={job._id} className="align-top transition-colors hover:bg-stone-50">
                            <td className="px-4 py-4">
                              <p className="font-medium text-slate-900">{job.title}</p>
                              <p className="mt-1 text-xs text-stone-500">{job.department}</p>
                            </td>
                            <td className="px-4 py-4 text-stone-600">{job.category}</td>
                            <td className="px-4 py-4 text-stone-600">{formatDate(job.lastDate)}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => startEditing(job._id)} className="btn-secondary px-3 py-2 text-xs">
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(job._id, job.title)}
                                  disabled={deletingId === job._id}
                                  className="btn-danger px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {deletingId === job._id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="space-y-4">
              {editForm ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-xl font-semibold text-slate-900">Edit Job</h2>
                        <p className="mt-1 text-sm text-stone-500">Update the selected listing and save changes to the live data source.</p>
                      </div>
                      <button type="button" onClick={closeEditor} className="btn-secondary px-3 py-2 text-xs">
                        Close
                      </button>
                    </div>
                  </div>

                  {formError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {formError}
                    </div>
                  ) : null}

                  <JobFormFields form={editForm} onChange={setEditForm} />

                  <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button type="button" onClick={closeEditor} className="btn-secondary justify-center px-5 py-3">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary justify-center px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                  <h2 className="font-display text-2xl font-semibold text-slate-900">Select a job to edit</h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Choose any row from the table to load its current values into the edit form.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default JobManagement;
