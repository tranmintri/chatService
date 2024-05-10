export const calculateTimeUserChat = (inputDateStr) => {
  // Assuming the input date string is in UTC format
  const inputDate = new Date(inputDateStr);

  // Get current date
  const currentDate = new Date();

  // Calculate time difference in milliseconds
  const timeDifference = Math.abs(currentDate - inputDate);

  if (timeDifference < 1000 * 60) {
    return "Few sec";
  }
  // Convert to appropriate units and format the output
  else if (timeDifference < 1000 * 60 * 60) {
    // Less than 1 hour: Return minutes
    const minutes = Math.floor(timeDifference / (1000 * 60));

    return `${minutes} minutes`;
  } else if (timeDifference < 1000 * 60 * 60 * 24) {
    // Less than 1 day: Return hours
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    return `${hours} hours`;
  } else if (timeDifference < 1000 * 60 * 60 * 24 * 7) {
    // Less than 7 days: Return days
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return `${days} days`;
  } else {
    // More than 7 days: Return date in DD/MM/YYYY format
    const dateFormat = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-US", dateFormat);
    return formattedDate;
  }
};
