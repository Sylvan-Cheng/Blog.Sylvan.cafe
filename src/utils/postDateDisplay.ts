export type DateInput = string | Date;

export type PostDateDisplay = {
  isModified: boolean;
  isoDateTime: string;
  label: string;
};

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function parseDate(value: DateInput, field: string): Date {
  const date =
    value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`${field} must be a valid date.`);
  }
  return date;
}

function getDateFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = dateFormatters.get(timeZone);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone,
    year: "numeric",
  });
  dateFormatters.set(timeZone, formatter);
  return formatter;
}

function formatDate(date: Date, timeZone: string): string {
  const parts = getDateFormatter(timeZone).formatToParts(date);
  const values = new Map(parts.map(({ type, value }) => [type, value]));
  return `${values.get("day")} ${values.get("month")}, ${values.get("year")}`;
}

export function buildPostDateDisplay(
  pubDatetime: DateInput,
  modDatetime: DateInput | null | undefined,
  timeZone: string,
): PostDateDisplay {
  const published = parseDate(pubDatetime, "pubDatetime");
  const modified =
    modDatetime === null || modDatetime === undefined
      ? null
      : parseDate(modDatetime, "modDatetime");
  let datetime = published;
  let isModified = false;

  if (modified !== null && modified.getTime() > published.getTime()) {
    datetime = modified;
    isModified = true;
  }

  return {
    isModified,
    isoDateTime: datetime.toISOString(),
    label: formatDate(datetime, timeZone),
  };
}
