// LoadingSpinner
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
    <div className="relative h-14 w-14">
      <div className="h-14 w-14 rounded-full border-4 border-slate-200" />
      <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
    </div>
    <p className="text-sm font-medium text-slate-500">{message}</p>
  </div>
);

// EmptyState
export const EmptyState = ({ message = 'No jobs found', subtext = 'Try adjusting your filters.', icon = '🔍' }) => (
  <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    <div className="mb-1 text-5xl">{icon}</div>
    <h3 className="font-display text-2xl font-semibold text-slate-800">{message}</h3>
    <p className="max-w-sm text-sm leading-relaxed text-slate-500">{subtext}</p>
  </div>
);

// SEO component (uses react-helmet-async)
import { Helmet } from 'react-helmet-async';
export const SEO = ({ title, description, canonical }) => (
  <Helmet>
    <title>{title ? `${title} | Punjab Jobs Hub` : 'Punjab Jobs Hub - Government Jobs in Punjab 2026'}</title>
    {description && <meta name="description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);

// SubscribeBox
import { useState } from 'react';
import { subscribersApi } from '../utils/api';

export const SubscribeBox = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await subscribersApi.subscribe({ email });
      setStatus('success');
      setMessage(res.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  if (status === 'success') return (
    <div className="rounded-3xl border border-green-200 bg-green-50 p-5 text-center">
      <div className="mb-2 text-2xl">🎉</div>
      <p className="text-sm font-semibold text-green-700">{message}</p>
    </div>
  );

  return (
    <div className="card bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5">
      <h3 className="mb-1 font-display font-semibold text-slate-800">📧 Get Job Alerts</h3>
      <p className="mb-4 text-xs text-slate-500">Get email alerts when new jobs are posted or deadlines are near.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="email" placeholder="your@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="input flex-1 text-xs py-2" />
        <button type="submit" disabled={status === 'loading'}
          className="btn-primary shrink-0 px-4 py-2 text-xs disabled:opacity-60">
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="mt-2 text-xs text-red-500">{message}</p>}
    </div>
  );
};

// Pagination
export const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total } = pagination;
  if (pages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className="btn-secondary px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">
        Previous
      </button>
      <span className="px-3 text-sm text-slate-500">
        Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} jobs)
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= pages}
        className="btn-secondary px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">
        Next
      </button>
    </div>
  );
};

// ProtectedRoute
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Checking session..." />;
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  return children;
};
