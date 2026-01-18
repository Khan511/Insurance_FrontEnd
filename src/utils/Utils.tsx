// Add this helper function near your other utility functions

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

// Helper function to format date array [year, month, day] to YYYY-MM-DD
export const formatDateArrayForInput = (dateArray?: any): string => {
  if (!dateArray) return "";

  try {
    // Handle array format [year, month, day]
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      // Note: Java LocalDate months are 1-indexed (1=January), so no need to adjust
      const formattedMonth = String(month).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      return `${year}-${formattedMonth}-${formattedDay}`;
    }

    // Handle string date format
    if (typeof dateArray === "string") {
      const date = new Date(dateArray);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }

    return "";
  } catch (error) {
    console.error("Error formatting date:", error, dateArray);
    return "";
  }
};

/* ---------- badges ---------- */
export const customerStatusBadge = (s: string) => (
  <Badge
    className={cn(
      "px-2.5 py-1 text-xs font-semibold",
      s === "ACTIVE"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 p-2"
        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 p-2"
    )}
  >
    {s}
  </Badge>
);
