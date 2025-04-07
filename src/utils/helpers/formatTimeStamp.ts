export const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full day name (e.g., Thursday)
    hour: "numeric", // Hour (e.g., 4)
    minute: "2-digit", // Minutes with leading zero if needed (e.g., 20)
    hour12: true, // Use 12-hour format (e.g., pm/am)
  };

  return date.toLocaleString("en-US", options);
};

export const timeAgo = (timestamp: number): string => {
  if (!timestamp) return "";
  
  const now = Date.now();
  const difference = Math.floor((now - timestamp) / 1000); // Difference in seconds

  if (difference < 60) {
    return `${difference} second${difference !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(difference / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};
