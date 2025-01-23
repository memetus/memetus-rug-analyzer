export const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const timeDifference = (
  start: Date,
  end: Date,
  type?: "d" | "h" | "m" | "s"
): string => {
  const diffMs = Math.abs(end.getTime() - start.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  if (type === "h") return hours.toString();
  if (type === "m") return minutes.toString();
  if (type === "s") return seconds.toString();
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const getCurrentTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
