import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-saffron-500 text-white'
      : 'text-stone-600 hover:bg-stone-100 hover:text-slate-800'
  }`;

const AdminLayout = ({ title, subtitle, actions, children }) => {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-saffron-500 text-lg font-bold text-white">
              PJ
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                Punjab Jobs Hub
              </p>
              <h1 className="font-display text-xl font-semibold text-slate-900">{title}</h1>
              {subtitle ? <p className="text-sm text-stone-500">{subtitle}</p> : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap gap-2">
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/jobs" className={navLinkClass}>
                Manage Jobs
              </NavLink>
            </nav>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="hidden rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-right sm:block">
                <p className="text-xs font-medium text-stone-400">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800">{admin?.email}</p>
              </div>
              <button type="button" onClick={handleLogout} className="btn-secondary px-4 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {actions ? <div className="mb-6 flex flex-wrap items-center justify-end gap-3">{actions}</div> : null}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
