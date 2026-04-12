const cron = require('node-cron');
const Job = require('../models/Job');
const Subscriber = require('../models/Subscriber');
const { sendDeadlineReminder } = require('./email');

const startDeadlineReminders = () => {
  // Runs every day at 8:00 AM IST (2:30 AM UTC)
  cron.schedule('30 2 * * *', async () => {
    console.log('⏰ Running deadline reminder job...');
    try {
      const now = new Date();

      // Jobs expiring in 1–5 days
      const soon = new Date(now);
      soon.setDate(soon.getDate() + 5);

      const urgentJobs = await Job.find({
        lastDate: { $gte: now, $lte: soon },
        isActive: true,
      }).lean();

      if (urgentJobs.length === 0) {
        console.log('No urgent deadlines today.');
        return;
      }

      const subscribers = await Subscriber.find({ isActive: true }).lean();
      console.log(`📧 Sending deadline reminders to ${subscribers.length} subscribers for ${urgentJobs.length} jobs`);

      for (const subscriber of subscribers) {
        try {
          // Filter jobs by subscriber's category preference
          const relevantJobs = subscriber.categories.includes('All')
            ? urgentJobs
            : urgentJobs.filter((j) => subscriber.categories.includes(j.category));

          if (relevantJobs.length > 0) {
            await sendDeadlineReminder(subscriber, relevantJobs);
          }
        } catch (err) {
          console.error(`Failed to send reminder to ${subscriber.email}:`, err.message);
        }
      }

      console.log('✅ Deadline reminder job completed');
    } catch (err) {
      console.error('❌ Deadline reminder job failed:', err.message);
    }
  });
};

module.exports = { startDeadlineReminders };
