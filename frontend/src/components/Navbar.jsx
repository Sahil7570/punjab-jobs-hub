import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItemClass = ({ isActive }) =>
  `rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
  }`;

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex min-h-18 items-center justify-between gap-3 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 text-sm font-bold text-white shadow-[0_14px_24px_rgba(59,130,246,0.28)]">
              PJ
            </div>
            <div className="leading-tight">
              <span className="block font-display text-lg font-semibold text-slate-900">Punjab Jobs Hub</span>
              <span className="hidden text-xs font-medium text-slate-400 sm:block">Verified Punjab government vacancies</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden max-w-xl flex-1 lg:block">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search job title, department, or keyword"
                className="input !py-3 pl-12 pr-4"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <div className="hidden items-center gap-2 lg:flex">
            <NavLink to="/" end className={navItemClass}>
              Home
            </NavLink>
            <a href="/#jobs-section" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
              Jobs
            </a>
            <Link to={isLoggedIn ? '/admin/dashboard' : '/admin'} className="btn-primary px-4 py-2.5">
              {isLoggedIn ? 'Admin Panel' : 'Admin'}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-slate-200 pb-4 pt-4 lg:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search job title or department"
                  className="input pl-12"
                />
                <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            <nav className="grid gap-2">
              <NavLink to="/" end className={navItemClass}>
                Home
              </NavLink>
              <a href="/#jobs-section" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                Jobs
              </a>
              <Link to={isLoggedIn ? '/admin/dashboard' : '/admin'} className="btn-primary justify-center">
                {isLoggedIn ? 'Open Admin Panel' : 'Admin Login'}
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
