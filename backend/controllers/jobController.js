const Job = require('../models/Job');
const Subscriber = require('../models/Subscriber');
const { sendNewJobAlert } = require('../utils/email');

// ─── Build Filter Query ──────────────────────────────────
const buildFilterQuery = (query) => {
  const filter = { isActive: true };

  if (query.gender && query.gender !== 'all') {
    filter['eligibility.gender'] = { $in: [query.gender, 'Both'] };
  }
  if (query.minAge) {
    filter['eligibility.minAge'] = { $lte: parseInt(query.minAge) };
  }
  if (query.maxAge) {
    filter['eligibility.maxAge'] = { $gte: parseInt(query.maxAge) };
  }
  if (query.qualification && query.qualification !== 'all') {
    const qualMap = { '10th': 0, '12th': 1, Graduate: 2 };
    const level = qualMap[query.qualification];
    const allowed = Object.keys(qualMap).filter((q) => qualMap[q] >= level);
    filter['eligibility.qualification'] = { $in: allowed };
  }
  if (query.category && query.category !== 'all') {
    filter.category = query.category;
  }
  if (query.activeOnly === 'true') {
    filter.lastDate = { $gte: new Date() };
  }

  return filter;
};

// GET /api/jobs — All jobs with filters + full-text search
const getAllJobs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;
    const { search } = req.query;

    let query;
    let sort = { createdAt: -1 };

    if (search && search.trim()) {
      // Full-text search
      query = {
        ...buildFilterQuery(req.query),
        $text: { $search: search.trim() },
      };
      sort = { score: { $meta: 'textScore' }, createdAt: -1 };

      const [jobs, total] = await Promise.all([
        Job.find(query, { score: { $meta: 'textScore' } })
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Job.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: jobs,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
        search: search.trim(),
      });
    }

    // Normal filter query
    query = buildFilterQuery(req.query);
    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllJobs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

// GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }
    res.status(500).json({ success: false, message: 'Failed to fetch job' });
  }
};

// GET /api/jobs/filter
const filterJobs = async (req, res) => {
  try {
    const filter = buildFilterQuery(req.query);
    const jobs = await Job.find(filter).sort({ lastDate: 1 }).lean();
    res.json({ success: true, data: jobs, total: jobs.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to filter jobs' });
  }
};

// POST /api/jobs (admin only)
const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    const savedJob = await job.save();

    // Notify subscribers in background (don't await)
    notifySubscribersNewJob(savedJob).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: savedJob,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to create job' });
  }
};

// PUT /api/jobs/:id (admin only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job updated', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update job' });
  }
};

// DELETE /api/jobs/:id (admin only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete job' });
  }
};

// Helper — notify subscribers about new job
const notifySubscribersNewJob = async (job) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true }).lean();
    for (const subscriber of subscribers) {
      const interested =
        subscriber.categories.includes('All') ||
        subscriber.categories.includes(job.category);
      if (interested) {
        await sendNewJobAlert(subscriber, [job]);
      }
    }
  } catch (err) {
    console.error('Subscriber notification failed:', err.message);
  }
};

module.exports = { getAllJobs, getJobById, filterJobs, createJob, updateJob, deleteJob };
