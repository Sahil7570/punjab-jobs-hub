import { useParams, Link } from 'react-router-dom';
import { useJobDetail } from '../hooks/useJobs';
import { LoadingSpinner, SEO } from '../components/SharedComponents';
import { formatDate, getUrgencyLevel, getCategoryClass, isJobActive, getDaysRemaining } from '../utils/helpers';

const Section = ({ title, icon, children }) => (
  <div className="card p-6">
    <h2 className="font-display text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
      {icon} {title}
    </h2>
    {children}
  </div>
);

const StatBox = ({ label, value, highlight }) => (
  <div className={`rounded-xl p-4 border ${highlight === 'urgent' ? 'bg-red-50 border-red-100' : highlight === 'soon' ? 'bg-amber-50 border-amber-100' : 'bg-stone-50 border-stone-100'}`}>
    <p className="text-xs text-stone-400 font-medium mb-1">{label}</p>
    <p className={`text-sm font-bold leading-tight ${highlight === 'urgent' ? 'text-red-600' : highlight === 'soon' ? 'text-amber-600' : 'text-slate-700'}`}>
      {value}
    </p>
  </div>
);

const JobDetail = () => {
  const { id } = useParams();
  const { job, loading, error } = useJobDetail(id);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12"><LoadingSpinner message="Loading job details..." /></div>;
  if (error)   return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-red-500 font-semibold mb-4">{error}</p>
      <Link to="/" className="btn-secondary">← Back to Jobs</Link>
    </div>
  );
  if (!job) return null;

  const urgency  = getUrgencyLevel(job.lastDate);
  const active   = isJobActive(job.lastDate);
  const daysLeft = getDaysRemaining(job.lastDate);

  return (
    <>
      <SEO title={job.title} description={job.overview?.slice(0, 155)} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-slate-700 transition-colors font-medium">
          ← Back to Jobs
        </Link>

        {/* Hero */}
        <div className="card p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={getCategoryClass(job.category)}>{job.category}</span>
            {!active && <span className="badge bg-stone-100 text-stone-500">Expired</span>}
            {active && urgency === 'urgent' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} left!
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800 leading-tight mb-1">{job.title}</h1>
          <p className="text-stone-500 text-sm mb-1">{job.department}</p>
          {job.totalVacancies && <p className="text-saffron-600 font-semibold text-sm mb-5">{job.totalVacancies.toLocaleString()} Vacancies</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            <StatBox label="Salary" value={job.salary} />
            <StatBox label="Last Date" value={formatDate(job.lastDate)} highlight={urgency !== 'normal' && urgency !== 'expired' ? urgency : undefined} />
            <StatBox label="Qualification" value={job.eligibility?.qualification} />
          </div>

          {active ? (
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
              className="btn-primary w-full justify-center text-base py-3.5 rounded-xl">
              Apply on Official Website →
            </a>
          ) : (
            <div className="w-full bg-stone-100 text-stone-400 text-center py-3.5 rounded-xl font-semibold text-sm">
              This Recruitment is Closed
            </div>
          )}
        </div>

        {/* Eligibility */}
        <Section title="Eligibility Criteria" icon="✅">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Gender', value: job.eligibility?.gender },
              { label: 'Age Range', value: `${job.eligibility?.minAge} – ${job.eligibility?.maxAge} yrs` },
              { label: 'Education', value: job.eligibility?.qualification },
            ].map(({ label, value }) => (
              <div key={label} className="bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
                <p className="text-xs text-stone-400 font-medium mb-1">{label}</p>
                <p className="font-semibold text-slate-700 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </Section>

        {job.overview && (
          <Section title="Overview" icon="📄">
            <p className="text-slate-600 text-sm leading-relaxed">{job.overview}</p>
          </Section>
        )}

        {job.selectionProcess && (
          <Section title="Selection Process" icon="🏆">
            <p className="text-slate-600 text-sm leading-relaxed">{job.selectionProcess}</p>
          </Section>
        )}

        {job.documents?.length > 0 && (
          <Section title="Documents Required" icon="📁">
            <ul className="space-y-2.5">
              {job.documents.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-6 h-6 bg-saffron-100 text-saffron-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</span>
                  {doc}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {job.stepsToApply?.length > 0 && (
          <Section title="Step-by-Step Apply Guide" icon="🧭">
            <ol className="space-y-3.5">
              {job.stepsToApply.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-saffron-500 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">{i + 1}</span>
                  <p className="text-slate-600 text-sm leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {job.commonMistakes?.length > 0 && (
          <Section title="Common Mistakes to Avoid" icon="⚠️">
            <ul className="space-y-2.5">
              {job.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-red-50 rounded-lg px-4 py-3">
                  <span className="text-red-500 shrink-0 font-bold">✗</span>
                  {m}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Bottom CTA */}
        {active && (
          <div className="card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-display font-semibold text-slate-800 text-lg">Ready to apply?</p>
              <p className="text-stone-500 text-sm mt-0.5">
                Deadline: <span className={`font-semibold ${urgency === 'urgent' ? 'text-red-600' : urgency === 'soon' ? 'text-amber-600' : 'text-slate-700'}`}>{formatDate(job.lastDate)}</span>
                {daysLeft >= 0 && <span className="text-stone-400 ml-1">({daysLeft} days left)</span>}
              </p>
            </div>
            <a href={job.applyLink} target="_blank" rel="noopener noreferrer"
              className="btn-primary shrink-0 py-3 px-6">
              Apply on Official Site →
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default JobDetail;
