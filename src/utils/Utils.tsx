// Add this helper function near your other utility functions

type DateTuple = [number, number, number, number?, number?];

export const getTimeDifferenceInHours = (
  dateInput: string | DateTuple
): number => {
  const parseDate = (dateInput: string | DateTuple): Date => {
    if (typeof dateInput === "string") {
      return new Date(dateInput);
    } else {
      const [y, m, d, h = 0, min = 0] = dateInput;
      return new Date(y, m - 1, d, h, min);
    }
  };

  const date = parseDate(dateInput);
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();
  return timeDiff / (1000 * 60 * 60); // Convert to hours
};

//Formate Date and time
export const formatDateTime = (
  dateInput?: Date | string | number[] | null
): string => {
  if (!dateInput) return "—";

  let date: Date;

  if (Array.isArray(dateInput)) {
    // Handle array format [2025, 12, 24, 10, 49, 29, 427823000]
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
    date = new Date(year, month - 1, day, hour, minute, second);
  } else {
    date = new Date(dateInput);
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formate date
export const formatDate = (
  dateInput?: string | Date | (number | undefined)[] | null
): string => {
  if (!dateInput) return "Date not available";

  let date: Date;

  if (Array.isArray(dateInput)) {
    // Handle array with optional elements
    const [year, month, day, hour = 0, minute = 0] = dateInput;

    if (year === undefined || month === undefined || day === undefined) {
      return "Invalid date";
    }

    date = new Date(year, month - 1, day, hour, minute);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return "Invalid date";

  // Show time if hour/minute were provided in the array
  const showTime =
    Array.isArray(dateInput) &&
    (dateInput[3] !== undefined || dateInput[4] !== undefined);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(showTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
};
