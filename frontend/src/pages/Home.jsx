import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { LoadingSpinner, EmptyState, SEO, SubscribeBox, Pagination } from '../components/SharedComponents';
import { useJobs } from '../hooks/useJobs';

const CATEGORIES = ['Police', 'Clerk', 'Teaching', 'Others'];

const Home = () => {
  const [searchParams] = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const { jobs, loading, error, filters, pagination, updateFilter, resetFilters, goToPage } = useJobs();

  // Sync search param from URL
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) updateFilter('search', q);
  }, [searchParams]);

  return (
    <>
      <SEO
        title="Government Jobs in Punjab 2025"
        description="Find latest Punjab government jobs — Police, Clerk, Teaching and more. Filter by qualification, age, gender. Direct apply links."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-700 border border-saffron-200 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full" />
            ਪੰਜਾਬ ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-800 leading-tight">
            Government Jobs in <span className="text-saffron-500">Punjab</span>
          </h1>
          <p className="text-stone-500 mt-2">
            {loading ? 'Searching...' : `${pagination.total} job${pagination.total !== 1 ? 's' : ''} found`}
            {filters.search && <span className="ml-1">for "<strong>{filters.search}</strong>"</span>}
          </p>
        </div>

        {/* Category quick filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <button onClick={() => updateFilter('category', 'all')}
            className={`shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${filters.category === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-stone-600 border-stone-200 hover:border-slate-400'}`}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => updateFilter('category', cat)}
              className={`shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${filters.category === cat ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-stone-600 border-stone-200 hover:border-slate-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile filter toggle */}
        <button onClick={() => setShowMobileFilter((v) => !v)}
          className="lg:hidden btn-secondary mb-4 w-full justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6" />
          </svg>
          {showMobileFilter ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <div className={`${showMobileFilter ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0 space-y-4`}>
            <FilterSidebar filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
            <SubscribeBox />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 font-semibold">{error}</p>
                <p className="text-stone-400 text-sm mt-1">Make sure the backend is running.</p>
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState message="No jobs match your filters" subtext="Try changing category, qualification or age range." />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
                <Pagination pagination={pagination} onPageChange={goToPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
