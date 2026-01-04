// src/utils/dateUtils.js

export const getISOWeek = (dateString) => {
  const date = new Date(dateString);

  // Convert to UTC to avoid timezone bugs
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // ISO week starts on Monday
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);

  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));

  return Math.ceil(
    (((tempDate - yearStart) / 86400000) + 1) / 7
  );
};
