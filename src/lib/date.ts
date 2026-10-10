import type { Event } from "@/types";

/**
 * Date formatting utilities for ACM BIT Mesra platform
 * Enforces ISO 8601 input and produces consistent human-readable dates
 */

export function formatDate(dateInput: string | Date): string {
  try {
    if (!dateInput) return "";
    let dateStr = typeof dateInput === "string" ? dateInput : dateInput.toISOString();
    if (dateStr.includes("T")) {
      dateStr = dateStr.split("T")[0];
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
      const parsed = new Date(dateInput);
      if (isNaN(parsed.getTime())) return typeof dateInput === "string" ? dateInput : "";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(parsed);
    }
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return typeof dateInput === "string" ? dateInput : "";
  }
}

export function formatDateRange(startDateStr: string, endDateStr?: string): string {
  if (!endDateStr || startDateStr === endDateStr) {
    return formatDate(startDateStr);
  }

  try {
    const sClean = startDateStr.includes("T") ? startDateStr.split("T")[0] : startDateStr;
    const eClean = endDateStr.includes("T") ? endDateStr.split("T")[0] : endDateStr;
    const [sYear, sMonth, sDay] = sClean.split("-").map(Number);
    const [eYear, eMonth, eDay] = eClean.split("-").map(Number);
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

export const EVENT_DATE_TBA_LABEL = "Date to be announced";

export function formatEventDate(event: Pick<Event, "date" | "endDate" | "dateTba">): string {
  if (event.dateTba) return EVENT_DATE_TBA_LABEL;
  return formatDateRange(event.date, event.endDate);
}
