import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-saffron-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PJ</span>
            </div>
            <div className="leading-tight hidden sm:block">
              <span className="font-display font-semibold text-slate-800 text-lg block leading-none">Punjab Jobs</span>
              <span className="text-xs text-stone-400 font-medium">Hub</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, departments..."
                className="w-full border border-stone-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 bg-stone-50"
              />
              <svg className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Nav */}
          <nav className="flex items-center gap-1 shrink-0">
            <NavLink to="/" end className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-saffron-50 text-saffron-600' : 'text-slate-600 hover:bg-stone-100'}`}>
              Jobs
            </NavLink>
            <NavLink to="/apply-now" className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-saffron-50 text-saffron-600' : 'text-slate-600 hover:bg-stone-100'}`}>
              Apply Now
            </NavLink>
            <Link
              to={isLoggedIn ? '/admin/dashboard' : '/admin'}
              className="ml-1 inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              {isLoggedIn ? 'Admin Panel' : 'Admin Login'}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
