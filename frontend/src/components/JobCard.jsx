import { Link } from 'react-router-dom';
import { formatDate, getDaysRemaining, getUrgencyLevel, getCategoryClass } from '../utils/helpers';

const UrgencyBadge = ({ lastDate }) => {
  const days = getDaysRemaining(lastDate);
  const level = getUrgencyLevel(lastDate);
  if (level === 'expired') return <span className="text-xs font-semibold text-stone-400">Expired</span>;
  if (level === 'urgent')  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      {days} day{days !== 1 ? 's' : ''} left!
    </span>
  );
  if (level === 'soon') return (
    <span className="text-xs font-semibold text-amber-600">⏳ {days} days left</span>
  );
  return null;
};

const JobCard = ({ job }) => {
  const urgency   = getUrgencyLevel(job.lastDate);
  const isExpired = urgency === 'expired';

  return (
    <div className={`card p-5 flex flex-col gap-4 animate-fade-in ${isExpired ? 'opacity-60' : ''}`}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={getCategoryClass(job.category)}>{job.category}</span>
          <UrgencyBadge lastDate={job.lastDate} />
        </div>
        <h3 className="font-display font-semibold text-slate-800 text-base leading-snug line-clamp-2">
          {job.title}
        </h3>
        <p className="text-stone-500 text-sm truncate">{job.department}</p>
        {job.totalVacancies && (
          <p className="text-xs text-saffron-600 font-semibold">{job.totalVacancies.toLocaleString()} Vacancies</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-stone-50 rounded-lg p-3">
          <p className="text-xs text-stone-400 font-medium mb-0.5">Salary</p>
          <p className="text-sm font-semibold text-slate-700 leading-tight">{job.salary}</p>
        </div>
        <div className={`rounded-lg p-3 ${urgency === 'urgent' ? 'bg-red-50' : urgency === 'soon' ? 'bg-amber-50' : 'bg-stone-50'}`}>
          <p className="text-xs text-stone-400 font-medium mb-0.5">Last Date</p>
          <p className={`text-sm font-semibold leading-tight ${urgency === 'urgent' ? 'text-red-600' : urgency === 'soon' ? 'text-amber-600' : 'text-slate-700'}`}>
            {formatDate(job.lastDate)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {[job.eligibility?.gender, job.eligibility?.qualification, `Age ${job.eligibility?.minAge}–${job.eligibility?.maxAge}`].map((tag, i) => (
          <span key={i} className="bg-stone-100 text-stone-500 text-xs px-2.5 py-1 rounded-full font-medium">{tag}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-1 border-t border-stone-100">
        <Link to={`/jobs/${job._id}`} className="btn-secondary flex-1 justify-center">View Details</Link>
        {!isExpired && (
          <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 justify-center">
            Apply Now
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;
