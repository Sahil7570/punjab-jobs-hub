const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Police', 'Clerk', 'Teaching', 'Others'],
        message: 'Category must be one of: Police, Clerk, Teaching, Others',
      },
    },
    salary: {
      type: String,
      required: [true, 'Salary is required'],
      trim: true,
    },
    totalVacancies: {
      type: Number,
      default: null,
    },
    lastDate: {
      type: Date,
      required: [true, 'Last date is required'],
    },
    applyLink: {
      type: String,
      required: [true, 'Apply link is required'],
      trim: true,
    },
    eligibility: {
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Both'],
        default: 'Both',
      },
      minAge: { type: Number, default: 18 },
      maxAge: { type: Number, default: 40 },
      qualification: {
        type: String,
        enum: ['10th', '12th', 'Graduate'],
        default: 'Graduate',
      },
    },
    overview: { type: String, default: '' },
    selectionProcess: { type: String, default: '' },
    documents: { type: [String], default: [] },
    stepsToApply: { type: [String], default: [] },
    commonMistakes: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// ─── Full-text Search Index ──────────────────────────────
jobSchema.index(
  { title: 'text', department: 'text', overview: 'text', category: 'text' },
  { weights: { title: 10, department: 5, category: 3, overview: 1 }, name: 'JobTextIndex' }
);

// ─── Query Indexes ───────────────────────────────────────
jobSchema.index({ category: 1, lastDate: 1 });
jobSchema.index({ 'eligibility.gender': 1, 'eligibility.qualification': 1 });
jobSchema.index({ lastDate: 1 });
jobSchema.index({ isActive: 1 });

// ─── Auto-generate slug ──────────────────────────────────
jobSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .substring(0, 80) +
      '-' +
      Date.now();
  }
  next();
});

// ─── Virtual: isExpired ──────────────────────────────────
jobSchema.virtual('isExpired').get(function () {
  return new Date(this.lastDate) < new Date();
});

jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
