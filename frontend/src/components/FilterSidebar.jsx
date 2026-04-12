const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const hasActive = ['gender','qualification','category','minAge','maxAge']
    .some((k) => filters[k] && filters[k] !== 'all');

  return (
    <aside className="bg-white rounded-xl border border-stone-200 p-5 h-fit sticky top-20">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
        <h2 className="font-display font-semibold text-slate-800 text-lg">Filters</h2>
        {hasActive && (
          <button onClick={onReset} className="text-xs text-saffron-600 hover:text-saffron-700 font-semibold">
            Reset All
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Category */}
        <div>
          <label className="label">Category</label>
          <div className="space-y-1">
            {['all','Police','Clerk','Teaching','Others'].map((c) => (
              <button key={c} onClick={() => onFilterChange('category', c)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  filters.category === c
                    ? 'bg-saffron-50 text-saffron-700 border-saffron-200'
                    : 'text-stone-600 hover:bg-stone-50 border-transparent'
                }`}>
                {c === 'all' ? 'All Categories' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="label">Gender</label>
          <div className="grid grid-cols-2 gap-1.5">
            {['all','Male','Female','Both'].map((g) => (
              <button key={g} onClick={() => onFilterChange('gender', g)}
                className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                  filters.gender === g
                    ? 'bg-saffron-500 border-saffron-500 text-white'
                    : 'border-stone-200 text-stone-500 hover:border-saffron-300'
                }`}>
                {g === 'all' ? 'Any' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Qualification */}
        <div>
          <label className="label">Qualification</label>
          <select value={filters.qualification} onChange={(e) => onFilterChange('qualification', e.target.value)} className="input">
            <option value="all">Any Qualification</option>
            <option value="10th">10th Pass</option>
            <option value="12th">12th Pass</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="label">Your Age</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" min="18" max="60" value={filters.minAge}
              onChange={(e) => onFilterChange('minAge', e.target.value)} className="input" />
            <span className="text-stone-300">—</span>
            <input type="number" placeholder="Max" min="18" max="60" value={filters.maxAge}
              onChange={(e) => onFilterChange('maxAge', e.target.value)} className="input" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
