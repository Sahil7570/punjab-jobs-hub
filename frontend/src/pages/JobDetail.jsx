import { useParams, Link } from 'react-router-dom';
import { useJobDetail } from '../hooks/useJobs';
import { LoadingSpinner, SEO } from '../components/SharedComponents';
import { formatDate, getUrgencyLevel, getCategoryClass, isJobActive, getDaysRemaining } from '../utils/helpers';

const Section = ({ title, icon, children }) => (
  <div className="card p-6 sm:p-7">
    <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-slate-900">
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-base text-indigo-600">{icon}</span>
      {title}
    </h2>
    {children}
  </div>
);

const StatBox = ({ label, value, highlight }) => (
  <div className={`rounded-2xl border p-4 ${highlight === 'urgent' ? 'border-red-100 bg-red-50' : highlight === 'soon' ? 'border-amber-100 bg-amber-50' : 'border-slate-100 bg-slate-50'}`}>
    <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
    <p className={`text-sm font-bold leading-tight ${highlight === 'urgent' ? 'text-red-600' : highlight === 'soon' ? 'text-amber-600' : 'text-slate-800'}`}>
      {value}
    </p>
  </div>
);

const JobDetail = () => {
  const { id } = useParams();
  const { job, loading, error } = useJobDetail(id);

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-12"><LoadingSpinner message="Loading job details..." /></div>;
  if (error) return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <div className="text-5xl mb-4">😕</div>
      <p className="mb-4 font-semibold text-red-500">{error}</p>
      <Link to="/" className="btn-secondary">Back to Jobs</Link>
    </div>
  );
  if (!job) return null;

  const urgency = getUrgencyLevel(job.lastDate);
  const active = isJobActive(job.lastDate);
  const daysLeft = getDaysRemaining(job.lastDate);

  return (
    <>
      <SEO title={job.title} description={job.overview?.slice(0, 155)} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800">
          Back to Jobs
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="card overflow-hidden p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className={getCategoryClass(job.category)}>{job.category}</span>
                {!active ? <span className="badge bg-slate-100 text-slate-500">Expired</span> : null}
                {active && urgency === 'urgent' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Only {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                  </span>
                ) : null}
              </div>

              <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">{job.title}</h1>
              <p className="mt-2 text-base text-slate-500">{job.department}</p>
              {job.totalVacancies ? (
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  {job.totalVacancies.toLocaleString()} Vacancies
                </p>
              ) : null}

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatBox label="Salary" value={job.salary} />
                <StatBox label="Last Date" value={formatDate(job.lastDate)} highlight={urgency !== 'normal' && urgency !== 'expired' ? urgency : undefined} />
                <StatBox label="Qualification" value={job.eligibility?.qualification} />
              </div>
            </div>

            {job.overview ? (
              <Section title="Overview" icon="📝">
                <p className="text-sm leading-7 text-slate-600">{job.overview}</p>
              </Section>
            ) : null}

            <Section title="Eligibility" icon="✅">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Gender', value: job.eligibility?.gender },
                  { label: 'Age Range', value: `${job.eligibility?.minAge} - ${job.eligibility?.maxAge} years` },
                  { label: 'Education', value: job.eligibility?.qualification },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </Section>

            {job.selectionProcess ? (
              <Section title="Selection Process" icon="🏆">
                <p className="text-sm leading-7 text-slate-600">{job.selectionProcess}</p>
              </Section>
            ) : null}

            {job.documents?.length > 0 ? (
              <Section title="Documents" icon="📁">
                <ul className="space-y-3">
                  {job.documents.map((doc, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{index + 1}</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {job.stepsToApply?.length > 0 ? (
              <Section title="Steps to Apply" icon="🧭">
                <ol className="space-y-3.5">
                  {job.stepsToApply.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">{index + 1}</span>
                      <p className="pt-1 text-sm leading-7 text-slate-600">{step}</p>
                    </li>
                  ))}
                </ol>
              </Section>
            ) : null}

            {job.commonMistakes?.length > 0 ? (
              <Section title="Common Mistakes" icon="⚠️">
                <ul className="space-y-3">
                  {job.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-slate-600">
                      <span className="shrink-0 font-bold text-rose-500">!</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Apply Now</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review the deadline and official application link before submitting your form.
              </p>

              <div className="mt-5 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Deadline</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(job.lastDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Status</p>
                  <p className={`mt-1 text-sm font-semibold ${active ? 'text-emerald-600' : 'text-slate-500'}`}>{active ? 'Accepting applications' : 'Applications closed'}</p>
                </div>
              </div>

              {active ? (
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-full justify-center py-3.5 text-base">
                  Apply Now
                </a>
              ) : (
                <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-500">
                  This recruitment is closed
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default JobDetail;
