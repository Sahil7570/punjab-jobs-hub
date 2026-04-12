import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { subscribersApi } from '../utils/api';
import { SEO } from '../components/SharedComponents';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Invalid unsubscribe link.'); return; }
    subscribersApi.unsubscribe(token)
      .then((res) => { setStatus('success'); setMessage(res.message); })
      .catch((err) => { setStatus('error'); setMessage(err.message); });
  }, [token]);

  return (
    <>
      <SEO title="Unsubscribe" />
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          {status === 'loading' && (
            <div>
              <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-500">Processing...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="card p-8">
              <div className="text-5xl mb-4">👋</div>
              <h1 className="font-display text-xl font-semibold text-slate-800 mb-2">Unsubscribed</h1>
              <p className="text-stone-500 text-sm mb-6">{message}</p>
              <Link to="/" className="btn-primary">Browse Jobs</Link>
            </div>
          )}
          {status === 'error' && (
            <div className="card p-8">
              <div className="text-5xl mb-4">❌</div>
              <h1 className="font-display text-xl font-semibold text-slate-800 mb-2">Something went wrong</h1>
              <p className="text-stone-500 text-sm mb-6">{message}</p>
              <Link to="/" className="btn-secondary">Go Home</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Unsubscribe;
