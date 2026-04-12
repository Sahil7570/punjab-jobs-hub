import JobCard from '../components/JobCard';
import { LoadingSpinner, EmptyState, SEO } from '../components/SharedComponents';
import { useJobs } from '../hooks/useJobs';
import { formatDate } from '../utils/helpers';

const ApplyNow = () => {
  const { jobs, loading, error, pagination } = useJobs(true);
  const mostUrgent = jobs.length > 0
    ? [...jobs].sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate))[0]
    : null;

  return (
    <>
      <SEO title="Apply Now — Active Punjab Govt Jobs" description="Active Punjab government recruitments accepting applications right now. Don't miss the deadlines!" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Live Recruitments
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-800">Apply Now</h1>
          <p className="text-stone-500 mt-2">
            {loading ? 'Loading...' : `${pagination.total} active recruitment${pagination.total !== 1 ? 's' : ''} accepting applications`}
          </p>
        </div>

        {!loading && mostUrgent && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-red-500 text-lg">⚡</span>
            <div>
              <p className="text-red-700 font-semibold text-sm">Don't miss this deadline!</p>
              <p className="text-red-600 text-sm mt-0.5">
                <strong>{mostUrgent.title}</strong> closes on <strong>{formatDate(mostUrgent.lastDate)}</strong>
              </p>
            </div>
          </div>
        )}

        {loading ? <LoadingSpinner message="Loading active jobs..." />
          : error ? <p className="text-red-500 text-center py-20">{error}</p>
          : jobs.length === 0 ? (
            <EmptyState icon="📭" message="No active recruitments right now"
              subtext="Check back soon. New government jobs are posted regularly." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          )}
      </div>
    </>
  );
};

export default ApplyNow;
