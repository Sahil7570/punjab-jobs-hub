export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

export const getDaysRemaining = (lastDate) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const end   = new Date(lastDate); end.setHours(0,0,0,0);
  return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
};

export const isJobActive = (lastDate) => getDaysRemaining(lastDate) >= 0;

export const getUrgencyLevel = (lastDate) => {
  const d = getDaysRemaining(lastDate);
  if (d < 0)  return 'expired';
  if (d <= 5) return 'urgent';
  if (d <= 15) return 'soon';
  return 'normal';
};

export const getCategoryClass = (cat) =>
  ({ Police: 'badge-Police', Clerk: 'badge-Clerk', Teaching: 'badge-Teaching', Others: 'badge-Others' }[cat] || 'badge-Others');

export const truncate = (str, n = 100) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;
