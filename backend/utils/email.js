const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ─── Email Templates ─────────────────────────────────────

const newJobEmailHTML = (jobs) => {
  const jobCards = jobs
    .map(
      (job) => `
      <div style="border:1px solid #e7e5e4;border-radius:12px;padding:20px;margin-bottom:16px;background:#fff;">
        <div style="display:inline-block;background:#fff7ed;color:#c2410c;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;margin-bottom:10px;text-transform:uppercase;">${job.category}</div>
        <h3 style="margin:0 0 6px;font-size:16px;color:#1c1917;">${job.title}</h3>
        <p style="margin:0 0 4px;color:#78716c;font-size:13px;">${job.department}</p>
        <div style="display:flex;gap:24px;margin:12px 0;">
          <div><span style="color:#a8a29e;font-size:12px;">Salary</span><br/><strong style="color:#1c1917;font-size:13px;">${job.salary}</strong></div>
          <div><span style="color:#a8a29e;font-size:12px;">Last Date</span><br/><strong style="color:#dc2626;font-size:13px;">${new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
        </div>
        <a href="${process.env.FRONTEND_URL}/jobs/${job._id}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">View & Apply →</a>
      </div>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
    <body style="margin:0;padding:0;background:#f5f5f4;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:32px auto;background:#f5f5f4;">
        <div style="background:#1c1917;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;">🏛️ Punjab Jobs Hub</h1>
          <p style="margin:6px 0 0;color:#a8a29e;font-size:13px;">New Government Jobs Alert</p>
        </div>
        <div style="background:#fff;padding:28px 32px;">
          <h2 style="margin:0 0 20px;font-size:18px;color:#1c1917;">📢 New Jobs Posted!</h2>
          ${jobCards}
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL}" style="display:inline-block;background:#1c1917;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">View All Jobs</a>
          </div>
        </div>
        <div style="padding:20px 32px;text-align:center;color:#a8a29e;font-size:12px;">
          <p>You received this because you subscribed to Punjab Jobs Hub alerts.</p>
          <p><a href="${process.env.FRONTEND_URL}/unsubscribe?token={{token}}" style="color:#f97316;">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const deadlineReminderHTML = (jobs) => {
  const jobCards = jobs
    .map((job) => {
      const daysLeft = Math.ceil(
        (new Date(job.lastDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return `
      <div style="border:1px solid #fee2e2;border-radius:12px;padding:20px;margin-bottom:16px;background:#fff5f5;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="background:#fee2e2;color:#dc2626;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">⚡ ${daysLeft} DAY${daysLeft !== 1 ? 'S' : ''} LEFT</span>
          <span style="background:#f1f5f9;color:#475569;font-size:11px;padding:4px 8px;border-radius:6px;">${job.category}</span>
        </div>
        <h3 style="margin:0 0 4px;font-size:15px;color:#1c1917;">${job.title}</h3>
        <p style="margin:0 0 12px;color:#78716c;font-size:12px;">${job.department}</p>
        <a href="${process.env.FRONTEND_URL}/jobs/${job._id}" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;">Apply Now — Deadline Soon!</a>
      </div>
    `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f5f5f4;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:32px auto;">
        <div style="background:#dc2626;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:20px;">⏰ Deadline Reminder</h1>
          <p style="margin:6px 0 0;color:#fca5a5;font-size:13px;">Don't miss these closing soon!</p>
        </div>
        <div style="background:#fff;padding:28px 32px;">
          ${jobCards}
          <div style="text-align:center;margin-top:20px;">
            <a href="${process.env.FRONTEND_URL}/apply-now" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">View All Active Jobs</a>
          </div>
        </div>
        <div style="padding:16px 32px;text-align:center;color:#a8a29e;font-size:12px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe?token={{token}}" style="color:#f97316;">Unsubscribe</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ─── Send Functions ──────────────────────────────────────

const sendNewJobAlert = async (subscriber, jobs) => {
  const transporter = createTransporter();
  const html = newJobEmailHTML(jobs).replace('{{token}}', subscriber.token || '');
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: subscriber.email,
    subject: `🏛️ ${jobs.length} New Govt Job${jobs.length > 1 ? 's' : ''} in Punjab — Apply Now`,
    html,
  });
};

const sendDeadlineReminder = async (subscriber, jobs) => {
  const transporter = createTransporter();
  const html = deadlineReminderHTML(jobs).replace('{{token}}', subscriber.token || '');
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: subscriber.email,
    subject: `⏰ Deadline Alert: ${jobs.length} Punjab Job${jobs.length > 1 ? 's' : ''} Closing Soon!`,
    html,
  });
};

const sendWelcomeEmail = async (subscriber) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: subscriber.email,
    subject: '✅ You\'re subscribed to Punjab Jobs Hub!',
    html: `
      <div style="max-width:500px;margin:32px auto;font-family:'Segoe UI',sans-serif;">
        <div style="background:#1c1917;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;">🏛️ Punjab Jobs Hub</h1>
        </div>
        <div style="background:#fff;padding:28px;border:1px solid #e7e5e4;border-radius:0 0 12px 12px;">
          <h2 style="color:#1c1917;">Welcome${subscriber.name ? ', ' + subscriber.name : ''}! 🎉</h2>
          <p style="color:#57534e;">You'll now receive alerts for new government jobs and deadline reminders for Punjab recruitments.</p>
          <a href="${process.env.FRONTEND_URL}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;margin-top:8px;">Browse Jobs Now →</a>
          <p style="color:#a8a29e;font-size:12px;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL}/unsubscribe?token=${subscriber.token}" style="color:#f97316;">Unsubscribe anytime</a>
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendNewJobAlert, sendDeadlineReminder, sendWelcomeEmail };
