import assert from "node:assert/strict";
import { buildPostDateDisplay } from "../src/utils/postDateDisplay.ts";

assert.deepEqual(
  buildPostDateDisplay("2026-04-30T18:30:00Z", null, "Asia/Bangkok"),
  {
    isModified: false,
    isoDateTime: "2026-04-30T18:30:00.000Z",
    label: "1 May, 2026",
  },
  "the label uses the configured timezone without changing the source instant",
);

assert.deepEqual(
  buildPostDateDisplay(
    new Date("2026-10-24T23:30:00Z"),
    "2026-10-25T01:30:00Z",
    "Europe/London",
  ),
  {
    isModified: true,
    isoDateTime: "2026-10-25T01:30:00.000Z",
    label: "25 Oct, 2026",
  },
  "a later modified date is selected across the daylight-saving transition",
);

assert.deepEqual(
  buildPostDateDisplay(
    "2026-05-01T00:00:00Z",
    new Date("2026-04-30T23:59:59Z"),
    "UTC",
  ),
  {
    isModified: false,
    isoDateTime: "2026-05-01T00:00:00.000Z",
    label: "1 May, 2026",
  },
  "an older modified date does not replace the publication date",
);

assert.throws(
  () => buildPostDateDisplay("invalid", null, "UTC"),
  /pubDatetime must be a valid date/,
  "invalid input dates fail clearly",
);

assert.throws(
  () => buildPostDateDisplay("2026-05-01T00:00:00Z", null, "Invalid/Zone"),
  RangeError,
  "invalid IANA timezones fail clearly",
);

console.log("Date formatting regression tests passed.");
