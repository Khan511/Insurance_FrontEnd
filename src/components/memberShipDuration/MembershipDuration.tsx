import { intervalToDuration } from "date-fns";

export function membershipDuration(createdAtISO?: string) {
  if (!createdAtISO) return null;
  const start = new Date(createdAtISO);
  if (isNaN(start.getTime())) return null;

  const d = intervalToDuration({ start, end: new Date() });
  // d has years, months, days, etc.
  const years = d.years ?? 0;
  const months = d.months ?? 0;

  const parts: string[] = [];
  if (years) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  return parts.length ? parts.join(" ") : "Less than a month";
}
