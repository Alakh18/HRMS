// Helper functions

export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatDateTime = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
};

export const generateEmployeeId = () => {
  return 'EMP' + Date.now().toString().slice(-8);
};

