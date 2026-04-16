import {
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  QUALIFICATION_OPTIONS,
} from '../../utils/jobForm';

const Section = ({ title, description, children }) => (
  <section className="card p-6">
    <div className="mb-5 border-b border-stone-100 pb-4">
      <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>
      {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
    </div>
    <div className="space-y-5">{children}</div>
  </section>
);

const ListField = ({ label, placeholder, items, onChange }) => {
  const updateItem = (index, value) => {
    const nextItems = [...items];
    nextItems[index] = value;
    onChange(nextItems);
  };

  const addItem = () => onChange([...items, '']);
  const removeItem = (index) => {
    if (items.length === 1) {
      onChange(['']);
      return;
    }
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-xs font-semibold text-stone-500">
              {index + 1}
            </span>
            <input
              type="text"
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              className="input flex-1"
              placeholder={`${placeholder} ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-stone-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              aria-label={`Remove ${label} ${index + 1}`}
            >
              x
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="mt-3 text-sm font-semibold text-saffron-600 hover:text-saffron-700">
        + Add {label}
      </button>
    </div>
  );
};

const JobFormFields = ({ form, onChange }) => {
  const updateField = (key, value) => onChange((current) => ({ ...current, [key]: value }));
  const updateEligibility = (key, value) =>
    onChange((current) => ({
      ...current,
      eligibility: {
        ...current.eligibility,
        [key]: value,
      },
    }));

  return (
    <div className="space-y-6">
      <Section title="Basic Information" description="Add the core listing details exactly as they should appear on the public site.">
        <div>
          <label className="label">Job Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            className="input"
            placeholder="Punjab Police Constable Recruitment 2026"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Department</label>
            <input
              type="text"
              value={form.department}
              onChange={(event) => updateField('department', event.target.value)}
              className="input"
              placeholder="Punjab Police Department"
              required
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              className="input"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Salary</label>
            <input
              type="text"
              value={form.salary}
              onChange={(event) => updateField('salary', event.target.value)}
              className="input"
              placeholder="Rs. 19,900 - Rs. 63,200"
              required
            />
          </div>
          <div>
            <label className="label">Total Vacancies</label>
            <input
              type="number"
              min="1"
              value={form.totalVacancies}
              onChange={(event) => updateField('totalVacancies', event.target.value)}
              className="input"
              placeholder="1746"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Last Date</label>
            <input
              type="date"
              value={form.lastDate}
              onChange={(event) => updateField('lastDate', event.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Official Apply Link</label>
            <input
              type="url"
              value={form.applyLink}
              onChange={(event) => updateField('applyLink', event.target.value)}
              className="input"
              placeholder="https://official-portal.example"
              required
            />
          </div>
        </div>
      </Section>

      <Section title="Eligibility" description="Set who can apply and the minimum qualification information shown to users.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="label">Gender</label>
            <select
              value={form.eligibility.gender}
              onChange={(event) => updateEligibility('gender', event.target.value)}
              className="input"
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Minimum Age</label>
            <input
              type="number"
              min="16"
              max="60"
              value={form.eligibility.minAge}
              onChange={(event) => updateEligibility('minAge', event.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Maximum Age</label>
            <input
              type="number"
              min="16"
              max="60"
              value={form.eligibility.maxAge}
              onChange={(event) => updateEligibility('maxAge', event.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Qualification</label>
            <select
              value={form.eligibility.qualification}
              onChange={(event) => updateEligibility('qualification', event.target.value)}
              className="input"
            >
              {QUALIFICATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Public Content" description="These sections appear on the job details page, so keep the wording polished and applicant-friendly.">
        <div>
          <label className="label">Overview</label>
          <textarea
            value={form.overview}
            onChange={(event) => updateField('overview', event.target.value)}
            className="input min-h-32 resize-y"
            placeholder="Add a concise summary of the recruitment, department, and opportunity."
          />
        </div>
        <div>
          <label className="label">Selection Process</label>
          <textarea
            value={form.selectionProcess}
            onChange={(event) => updateField('selectionProcess', event.target.value)}
            className="input min-h-28 resize-y"
            placeholder="Written test, interview, document verification, and other stages."
          />
        </div>
      </Section>

      <Section title="Detailed Lists" description="These become the numbered and checklist sections on the public job detail page.">
        <ListField
          label="Documents Required"
          placeholder="Document"
          items={form.documents}
          onChange={(items) => updateField('documents', items)}
        />
        <ListField
          label="Steps To Apply"
          placeholder="Step"
          items={form.stepsToApply}
          onChange={(items) => updateField('stepsToApply', items)}
        />
        <ListField
          label="Common Mistakes"
          placeholder="Mistake"
          items={form.commonMistakes}
          onChange={(items) => updateField('commonMistakes', items)}
        />
      </Section>
    </div>
  );
};

export default JobFormFields;
