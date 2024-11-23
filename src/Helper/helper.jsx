export const parseExcelDate = (serial) => {
  if (!serial) return null;
  const epoch = new Date(Date.UTC(1900, 0, 1)); // Excel's epoch (Jan 1, 1900)
  const days = serial - 2; // Excel serial includes an extra leap year day for 1900
  epoch.setDate(epoch.getDate() + days);
  return epoch.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};
