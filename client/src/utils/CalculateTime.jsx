export const calculateTime = (inputDateStr) => {
  // Assuming the input date string is in UTC format
  const inputDate = new Date(inputDateStr);

  // Get current date
  const currentDate = new Date();

  // Set up date formats
  const timeFormat = { hour: "numeric", minute: "2-digit", hour12: true }; // Include hour12 for AM/PM
  const dateFormat = {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  // Check if it's today, tomorrow, or more than one day ago
  if (
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCDate() === currentDate.getUTCDate()
  ) {
    // Today: Convert to AM/PM format
    const ampmTime = inputDate.toLocaleTimeString("en-US", timeFormat);
    return ampmTime;
  } else if (
    inputDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
    inputDate.getUTCMonth() === currentDate.getUTCMonth() &&
    inputDate.getUTCDate() === currentDate.getUTCDate() - 1
  ) {
    // Tomorrow: Show "Yesterday"
    return "Yesterday";
  } else {
    // More than a day ago: Show short weekday, date (DD/MM/YYYY) without commas
    const formattedDate = inputDate.toLocaleDateString("en-US", dateFormat);
    // Remove commas and add space
    const finalDate = formattedDate.replace(/\,/g, "").replace(/\s+/g, " "); // Replace commas and extra spaces
    // const ampmTime = inputDate.toLocaleTimeString("en-US", timeFormat);
    return `${finalDate}`;
  }
};
