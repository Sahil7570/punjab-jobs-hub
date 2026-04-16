import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { LoadingSpinner, EmptyState, SEO, SubscribeBox, Pagination } from '../components/SharedComponents';
import { useJobs } from '../hooks/useJobs';

const CATEGORIES = ['Police', 'Clerk', 'Teaching', 'Others'];

const Home = () => {
  const [searchParams] = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [heroSearch, setHeroSearch] = useState('');
  const { jobs, loading, error, filters, pagination, updateFilter, resetFilters, goToPage } = useJobs();

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) updateFilter('search', q);
  }, [searchParams]);

  useEffect(() => {
    setHeroSearch(filters.search || '');
  }, [filters.search]);

  const handleHeroSearch = (event) => {
    event.preventDefault();
    updateFilter('search', heroSearch.trim());
    window.location.hash = 'jobs-section';
  };

  return (
    <>
      <SEO
        title="Latest Punjab Govt Jobs 2026"
        description="Find verified government jobs with full details, search filters, and direct apply links across Punjab departments."
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <section className="card relative overflow-hidden border-indigo-100 bg-[linear-gradient(135deg,rgba(224,231,255,0.9),rgba(255,255,255,0.96)_42%,rgba(224,242,254,0.85))] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)] lg:block" />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700 shadow-sm">
              Trusted Punjab Job Updates
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Latest Punjab Govt Jobs 2026
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Find verified government jobs with full details and apply links. Search quickly, compare deadlines, and revisit openings worth tracking.
            </p>

            <form onSubmit={handleHeroSearch} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-[1.75rem] border border-white/80 bg-white/90 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-4 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(event) => setHeroSearch(event.target.value)}
                  placeholder="Search by job title or department"
                  className="input border-transparent bg-slate-50 pl-12 shadow-none"
                />
              </div>
              <button type="submit" className="btn-primary justify-center px-6 py-3">
                Search Jobs
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a href="#jobs-section" className="btn-secondary px-5 py-3">Browse Jobs</a>
              <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                {loading ? 'Loading jobs...' : `${pagination.total} live opportunities indexed`}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => updateFilter('category', 'all')}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${filters.category === 'all' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700'}`}
            >
              All Jobs
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => updateFilter('category', category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${filters.category === category ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Browse Jobs</h2>
              <p className="text-sm text-slate-500">Use filters to refine the list on mobile.</p>
            </div>
            <button onClick={() => setShowMobileFilter((value) => !value)} className="btn-secondary px-4 py-2.5">
              {showMobileFilter ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="flex items-start gap-6">
            <div className={`${showMobileFilter ? 'block' : 'hidden'} w-full shrink-0 space-y-4 lg:block lg:w-72`}>
              <FilterSidebar filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
              <SubscribeBox />
            </div>

            <div id="jobs-section" className="min-w-0 flex-1 scroll-mt-28">
              <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Jobs Feed</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">Verified Punjab vacancies</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {loading ? 'Searching jobs...' : `${pagination.total} result${pagination.total !== 1 ? 's' : ''}${filters.search ? ` for "${filters.search}"` : ''}`}
                  </p>
                </div>
                {filters.search ? (
                  <button type="button" onClick={resetFilters} className="btn-secondary self-start px-4 py-2.5 sm:self-auto">
                    Clear Filters
                  </button>
                ) : null}
              </div>

              {loading ? (
                <LoadingSpinner message="Loading the latest jobs..." />
              ) : error ? (
                <div className="card px-6 py-12 text-center">
                  <p className="font-semibold text-red-500">{error}</p>
                  <p className="mt-2 text-sm text-slate-500">Make sure the backend is running and connected to the API.</p>
                </div>
              ) : jobs.length === 0 ? (
                <EmptyState message="No jobs found" subtext="Try a different keyword or clear your current filters to explore more roles." icon="📭" />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                  </div>
                  <Pagination pagination={pagination} onPageChange={goToPage} />
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
