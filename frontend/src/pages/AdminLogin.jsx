import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SharedComponents';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(form.email.trim(), form.password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_42%),linear-gradient(180deg,_#fafaf9_0%,_#f5f5f4_100%)] px-4 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
            <section className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-saffron-200">
                  Admin Access
                </div>
                <h1 className="mt-6 font-display text-4xl font-semibold leading-tight">
                  Manage every Punjab Jobs Hub listing from one secure panel.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                  Add fresh openings, keep deadlines updated, and retire outdated posts without touching the public browsing experience.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  'Protected routes backed by the existing JWT auth flow.',
                  'Fast job publishing with the same data model your live site already uses.',
                  'Edit and delete tools built for responsive admin workflows.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="p-6 sm:p-10">
              <div className="mx-auto max-w-md">
                <div className="mb-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-500 text-lg font-bold text-white shadow-lg shadow-saffron-500/25">
                    PJ
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-semibold text-slate-900">Admin Login</h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Sign in with your existing admin credentials to manage job listings.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full justify-center rounded-xl py-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
