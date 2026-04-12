const Job = require('../models/Job');
const Subscriber = require('../models/Subscriber');

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fiveDaysFromNow = new Date(now);
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

    const [
      totalJobs,
      activeJobs,
      expiredJobs,
      urgentJobs,
      totalSubscribers,
      recentJobs,
      categoryBreakdown,
      topViewed,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ lastDate: { $gte: now }, isActive: true }),
      Job.countDocuments({ lastDate: { $lt: now } }),
      Job.countDocuments({ lastDate: { $gte: now, $lte: fiveDaysFromNow }, isActive: true }),
      Subscriber.countDocuments({ isActive: true }),
      Job.find().sort({ createdAt: -1 }).limit(5).select('title category lastDate createdAt views').lean(),
      Job.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Job.find({ isActive: true }).sort({ views: -1 }).limit(5).select('title views category').lean(),
    ]);

    res.json({
      success: true,
      data: {
        stats: { totalJobs, activeJobs, expiredJobs, urgentJobs, totalSubscribers },
        recentJobs,
        categoryBreakdown,
        topViewed,
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
};

module.exports = { getDashboardStats };
