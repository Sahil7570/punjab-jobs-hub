// LoadingSpinner
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="relative w-12 h-12">
      <div className="w-12 h-12 border-4 border-stone-200 rounded-full" />
      <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin absolute inset-0" />
    </div>
    <p className="text-stone-400 text-sm font-medium">{message}</p>
  </div>
);

// EmptyState
export const EmptyState = ({ message = 'No jobs found', subtext = 'Try adjusting your filters.', icon = '🔍' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-3 text-center px-4">
    <div className="text-5xl mb-1">{icon}</div>
    <h3 className="font-display font-semibold text-slate-700 text-xl">{message}</h3>
    <p className="text-stone-400 text-sm max-w-xs leading-relaxed">{subtext}</p>
  </div>
);

// SEO component (uses react-helmet-async)
import { Helmet } from 'react-helmet-async';
export const SEO = ({ title, description, canonical }) => (
  <Helmet>
    <title>{title ? `${title} | Punjab Jobs Hub` : 'Punjab Jobs Hub — Government Jobs in Punjab 2025'}</title>
    {description && <meta name="description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);

// SubscribeBox
import { useState } from 'react';
import { subscribersApi } from '../utils/api';

export const SubscribeBox = () => {
  const [email, setEmail]       = useState('');
  const [status, setStatus]     = useState('idle'); // idle | loading | success | error
  const [message, setMessage]   = useState('');

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
    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
      <div className="text-2xl mb-2">🎉</div>
      <p className="text-green-700 font-semibold text-sm">{message}</p>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200 rounded-xl p-5">
      <h3 className="font-display font-semibold text-slate-800 mb-1">📧 Get Job Alerts</h3>
      <p className="text-stone-500 text-xs mb-4">Get email alerts when new jobs are posted or deadlines are near.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="email" placeholder="your@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="input flex-1 text-xs py-2" />
        <button type="submit" disabled={status === 'loading'}
          className="btn-primary py-2 px-4 text-xs shrink-0 disabled:opacity-60">
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className="text-red-500 text-xs mt-2">{message}</p>}
    </div>
  );
};

// Pagination
export const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages, total } = pagination;
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className="btn-secondary py-2 px-3 disabled:opacity-40 disabled:cursor-not-allowed">
        ← Prev
      </button>
      <span className="text-sm text-stone-500 px-3">
        Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} jobs)
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= pages}
        className="btn-secondary py-2 px-3 disabled:opacity-40 disabled:cursor-not-allowed">
        Next →
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
