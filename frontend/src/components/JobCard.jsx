import { Link } from 'react-router-dom';
import { formatDate, getDaysRemaining, getUrgencyLevel, getCategoryClass } from '../utils/helpers';

const UrgencyBadge = ({ lastDate }) => {
  const days = getDaysRemaining(lastDate);
  const level = getUrgencyLevel(lastDate);
  if (level === 'expired') return <span className="text-xs font-semibold text-slate-400">Expired</span>;
  if (level === 'urgent') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
      {days} day{days !== 1 ? 's' : ''} left
    </span>
  );
  if (level === 'soon') return <span className="text-xs font-semibold text-amber-600">Closing soon</span>;
  return null;
};

const JobCard = ({ job }) => {
  const urgency = getUrgencyLevel(job.lastDate);
  const isExpired = urgency === 'expired';
  const isNew = job.createdAt && (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 7;

  return (
    <div className={`card group flex h-full flex-col gap-5 p-5 animate-fade-in ${isExpired ? 'opacity-70' : 'hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]'}`}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isNew ? <span className="badge bg-emerald-100 text-emerald-700">NEW</span> : null}
            <span className={getCategoryClass(job.category)}>{job.category}</span>
          </div>
          <UrgencyBadge lastDate={job.lastDate} />
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug text-slate-900 line-clamp-2">
          {job.title}
        </h3>
        <p className="truncate text-sm text-slate-500">{job.department}</p>
        {job.totalVacancies ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
            {job.totalVacancies.toLocaleString()} Vacancies
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
          <p className="mb-1 text-xs font-medium text-slate-400">Salary</p>
          <p className="text-sm font-semibold leading-tight text-slate-800">{job.salary}</p>
        </div>
        <div className={`rounded-2xl border p-3.5 ${urgency === 'urgent' ? 'border-red-100 bg-red-50' : urgency === 'soon' ? 'border-amber-100 bg-amber-50' : 'border-slate-100 bg-slate-50'}`}>
          <p className="mb-1 text-xs font-medium text-slate-400">Last Date</p>
          <p className={`text-sm font-semibold leading-tight ${urgency === 'urgent' ? 'text-red-600' : urgency === 'soon' ? 'text-amber-600' : 'text-slate-800'}`}>
            {formatDate(job.lastDate)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[job.eligibility?.gender, job.eligibility?.qualification, `Age ${job.eligibility?.minAge}-${job.eligibility?.maxAge}`].map((tag, index) => (
          <span key={index} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{tag}</span>
        ))}
      </div>

      <div className="mt-auto flex gap-2 border-t border-slate-100 pt-3">
        <Link to={`/jobs/${job._id}`} className="btn-secondary flex-1 justify-center">View Details</Link>
        {!isExpired ? (
          <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 justify-center">
            Apply Now
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default JobCard;
