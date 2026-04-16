const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const hasActive = ['gender', 'qualification', 'category', 'minAge', 'maxAge', 'search']
    .some((key) => filters[key] && filters[key] !== 'all');

  return (
    <aside className="card sticky top-24 h-fit p-5">
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">Smart Filters</h2>
          <p className="mt-1 text-sm text-slate-500">Narrow results quickly and clearly.</p>
        </div>
        {hasActive ? (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      <div className="space-y-5">
        <div>
          <label className="label">Category</label>
          <select value={filters.category} onChange={(event) => onFilterChange('category', event.target.value)} className="input">
            <option value="all">All Categories</option>
            <option value="Police">Police</option>
            <option value="Clerk">Clerk</option>
            <option value="Teaching">Teaching</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="label">Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {['all', 'Male', 'Female', 'Both'].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => onFilterChange('gender', gender)}
                className={`rounded-2xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                  filters.gender === gender
                    ? 'border-indigo-500 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-700'
                }`}
              >
                {gender === 'all' ? 'Any' : gender}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Qualification</label>
          <select value={filters.qualification} onChange={(event) => onFilterChange('qualification', event.target.value)} className="input">
            <option value="all">Any Qualification</option>
            <option value="10th">10th Pass</option>
            <option value="12th">12th Pass</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>

        <div>
          <label className="label">Your Age</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="18"
              max="60"
              value={filters.minAge}
              onChange={(event) => onFilterChange('minAge', event.target.value)}
              className="input"
            />
            <span className="text-slate-300">to</span>
            <input
              type="number"
              placeholder="Max"
              min="18"
              max="60"
              value={filters.maxAge}
              onChange={(event) => onFilterChange('maxAge', event.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 text-sm text-indigo-900">
          <p className="font-semibold">Tip</p>
          <p className="mt-1 text-indigo-700">Use category and qualification first, then narrow by age for the fastest results.</p>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
