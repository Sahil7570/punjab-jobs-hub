import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi, jobsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, SEO } from '../components/SharedComponents';
import { formatDate, getUrgencyLevel } from '../utils/helpers';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ label, value, icon, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-slate-800">{value ?? '—'}</p>
      <p className="text-stone-500 text-sm">{label}</p>
    </div>
  </div>
);

// ── Category Badge ─────────────────────────────────────────
const CatBadge = ({ cat }) => {
  const map = {
    Police:   'bg-blue-100 text-blue-700',
    Clerk:    'bg-purple-100 text-purple-700',
    Teaching: 'bg-green-100 text-green-700',
    Others:   'bg-stone-100 text-stone-600',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${map[cat] || map.Others}`}>
      {cat}
    </span>
  );
};

// ── Main Component ─────────────────────────────────────────
const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [stats,   setStats]   = useState(null);
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [page,    setPage]    = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQ, setSearchQ] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null); // job to confirm deletion

  // Load dashboard stats
  useEffect(() => {
    adminApi.stats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Load jobs list
  const loadJobs = useCallback(async (p = 1) => {
    setJobsLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (searchQ.trim()) params.search = searchQ.trim();
      if (catFilter !== 'all') params.category = catFilter;
      const res = await jobsApi.getAll(params);
      setJobs(res.data || []);
      setTotalPages(res.pagination?.pages || 1);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setJobsLoading(false);
    }
  }, [searchQ, catFilter]);

  useEffect(() => { loadJobs(1); }, [loadJobs]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await jobsApi.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setConfirmDelete(null);
      // Refresh stats
      adminApi.stats().then((res) => setStats(res.data)).catch(() => {});
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <>
      <SEO title="Admin Dashboard" />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h3 className="font-display font-semibold text-slate-800 text-lg text-center mb-2">Delete Job?</h3>
            <p className="text-stone-500 text-sm text-center mb-6">
              "<strong>{confirmDelete.title}</strong>" will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                disabled={deletingId === confirmDelete._id}
                className="btn-danger flex-1 justify-center disabled:opacity-60"
              >
                {deletingId === confirmDelete._id ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-stone-50">
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-saffron-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PJ</span>
              </div>
              <div>
                <span className="font-display font-semibold text-slate-800">Admin Panel</span>
                <span className="text-stone-400 text-xs ml-2 hidden sm:inline">Punjab Jobs Hub</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" target="_blank" className="btn-secondary py-1.5 px-3 text-xs hidden sm:inline-flex">
                View Site ↗
              </Link>
              <span className="text-stone-500 text-sm hidden sm:block">{admin?.name}</span>
              <button onClick={handleLogout} className="btn-secondary py-1.5 px-3 text-xs">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* Stats */}
          {loading ? (
            <LoadingSpinner message="Loading stats..." />
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
          ) : stats ? (
            <>
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <StatCard label="Total Jobs"       value={stats.stats.totalJobs}       icon="📋" color="bg-slate-100" />
                  <StatCard label="Active Jobs"      value={stats.stats.activeJobs}      icon="✅" color="bg-green-100" />
                  <StatCard label="Expired"          value={stats.stats.expiredJobs}     icon="⌛" color="bg-stone-100" />
                  <StatCard label="Closing Soon"     value={stats.stats.urgentJobs}      icon="⚡" color="bg-red-100"  />
                  <StatCard label="Subscribers"      value={stats.stats.totalSubscribers} icon="📧" color="bg-blue-100" />
                </div>
              </div>

              {/* Category breakdown */}
              {stats.categoryBreakdown?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">Jobs by Category</h3>
                  <div className="flex flex-wrap gap-3">
                    {stats.categoryBreakdown.map(({ _id, count }) => (
                      <div key={_id} className="flex items-center gap-2 bg-stone-50 rounded-lg px-4 py-2.5">
                        <CatBadge cat={_id} />
                        <span className="text-slate-700 font-bold text-sm">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top viewed */}
              {stats.topViewed?.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-semibold text-slate-800 mb-4">🔥 Most Viewed Jobs</h3>
                  <div className="space-y-2">
                    {stats.topViewed.map((job, i) => (
                      <div key={job._id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-stone-400 text-xs font-bold w-5 shrink-0">#{i + 1}</span>
                          <p className="text-sm text-slate-700 font-medium truncate">{job.title}</p>
                          <CatBadge cat={job.category} />
                        </div>
                        <span className="text-saffron-600 font-semibold text-sm shrink-0 ml-3">{job.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}

          {/* Job Management */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="font-display text-xl font-semibold text-slate-800">Manage Jobs</h2>
              <Link to="/admin/jobs/new" className="btn-primary shrink-0">
                + Add New Job
              </Link>
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="input flex-1"
              />
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="input sm:w-44">
                <option value="all">All Categories</option>
                <option value="Police">Police</option>
                <option value="Clerk">Clerk</option>
                <option value="Teaching">Teaching</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Jobs Table */}
            <div className="card overflow-hidden">
              {jobsLoading ? (
                <LoadingSpinner message="Loading jobs..." />
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm">No jobs found</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Job Title</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Category</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Last Date</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Views</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {jobs.map((job) => {
                          const urgency  = getUrgencyLevel(job.lastDate);
                          const isActive = urgency !== 'expired';
                          return (
                            <tr key={job._id} className="hover:bg-stone-50 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{job.title}</p>
                                <p className="text-xs text-stone-400 truncate max-w-xs">{job.department}</p>
                              </td>
                              <td className="px-4 py-3"><CatBadge cat={job.category} /></td>
                              <td className="px-4 py-3">
                                <span className={`text-sm font-medium ${urgency === 'urgent' ? 'text-red-600' : urgency === 'soon' ? 'text-amber-600' : 'text-slate-600'}`}>
                                  {formatDate(job.lastDate)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-stone-400'}`} />
                                  {isActive ? 'Active' : 'Expired'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-stone-500">{job.views || 0}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                  <Link to={`/admin/jobs/edit/${job._id}`}
                                    className="text-xs text-saffron-600 hover:text-saffron-700 font-semibold px-2 py-1 rounded hover:bg-saffron-50 transition-colors">
                                    Edit
                                  </Link>
                                  <button onClick={() => setConfirmDelete(job)}
                                    className="text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors">
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="sm:hidden divide-y divide-stone-100">
                    {jobs.map((job) => {
                      const urgency  = getUrgencyLevel(job.lastDate);
                      const isActive = urgency !== 'expired';
                      return (
                        <div key={job._id} className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 text-sm line-clamp-2">{job.title}</p>
                              <p className="text-xs text-stone-400 mt-0.5">{job.department}</p>
                            </div>
                            <CatBadge cat={job.category} />
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className={`font-medium ${urgency === 'urgent' ? 'text-red-600' : urgency === 'soon' ? 'text-amber-600' : 'text-slate-600'}`}>
                              {formatDate(job.lastDate)}
                            </span>
                            <span className={`font-semibold ${isActive ? 'text-green-600' : 'text-stone-400'}`}>
                              {isActive ? '● Active' : '● Expired'}
                            </span>
                            <span className="text-stone-400">{job.views || 0} views</span>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Link to={`/admin/jobs/edit/${job._id}`} className="btn-secondary py-1.5 px-3 text-xs flex-1 justify-center">Edit</Link>
                            <button onClick={() => setConfirmDelete(job)} className="btn-danger py-1.5 px-3 text-xs flex-1 justify-center">Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-4 border-t border-stone-100">
                      <button onClick={() => loadJobs(page - 1)} disabled={page <= 1}
                        className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">← Prev</button>
                      <span className="text-sm text-stone-500">Page {page} of {totalPages}</span>
                      <button onClick={() => loadJobs(page + 1)} disabled={page >= totalPages}
                        className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">Next →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
