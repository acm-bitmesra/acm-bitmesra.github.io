/**
 * Date formatting utilities for ACM BIT Mesra platform
 * Enforces ISO 8601 input and produces consistent human-readable dates
 */

export function formatDate(isoString: string): string {
  try {
    const [year, month, day] = isoString.split("-").map(Number);
    if (!year || !month || !day) return isoString;
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateRange(startDateStr: string, endDateStr?: string): string {
  if (!endDateStr || startDateStr === endDateStr) {
    return formatDate(startDateStr);
  }

  try {
    const [sYear, sMonth, sDay] = startDateStr.split("-").map(Number);
    const [eYear, eMonth, eDay] = endDateStr.split("-").map(Number);
    const sDate = new Date(Date.UTC(sYear, sMonth - 1, sDay));
    const eDate = new Date(Date.UTC(eYear, eMonth - 1, eDay));

    const sFmtMonth = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(sDate);
    const eFmtMonth = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(eDate);

    if (sYear === eYear && sMonth === eMonth) {
      return `${sFmtMonth} ${sDay}–${eDay}, ${sYear}`;
    }

    if (sYear === eYear) {
      return `${sFmtMonth} ${sDay} – ${eFmtMonth} ${eDay}, ${sYear}`;
    }

    return `${formatDate(startDateStr)} – ${formatDate(endDateStr)}`;
  } catch {
    return `${startDateStr} – ${endDateStr}`;
  }
}
