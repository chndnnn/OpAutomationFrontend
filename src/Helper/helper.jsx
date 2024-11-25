export const parseExcelDate = (excelDate) => {
  if (!excelDate) {
    // If the date value is empty or undefined, return null or a placeholder
    return null;
  }

  // Check if the value is a valid number (for Excel serial dates)
  if (typeof excelDate === "number") {
    const date = new Date((excelDate - 25569) * 86400 * 1000); // Convert Excel serial date to JS Date
    return isNaN(date.getTime()) ? null : date.toISOString();
  }

  // If the value is a string, try parsing it
  const date = new Date(excelDate);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

