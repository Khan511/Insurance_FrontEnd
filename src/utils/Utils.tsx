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
