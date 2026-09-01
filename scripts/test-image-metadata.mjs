import assert from "node:assert/strict";
import {
  fetchBytesWithRetry,
  mapWithConcurrency,
} from "./imageMetadataFetch.mjs";

let attempts = 0;
const bytes = await fetchBytesWithRetry("https://example.test/image.avif", {
  fetchImpl: async (_url, { signal }) => {
    assert.ok(signal instanceof AbortSignal);
    attempts++;
    if (attempts < 3) throw new TypeError("temporary network error");
    return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
  },
  maxRetries: 2,
  retryDelayMs: 0,
  sleepImpl: async () => {},
});
assert.deepEqual([...bytes], [1, 2, 3]);
assert.equal(attempts, 3, "transient fetch errors are retried");

let notFoundAttempts = 0;
await assert.rejects(
  fetchBytesWithRetry("https://example.test/missing.avif", {
    fetchImpl: async () => {
      notFoundAttempts++;
      return new Response(null, { status: 404 });
    },
    maxRetries: 3,
    retryDelayMs: 0,
    sleepImpl: async () => {},
  }),
  /HTTP 404/,
);
assert.equal(notFoundAttempts, 1, "non-retryable HTTP errors are not repeated");

let timedOutAttempts = 0;
await assert.rejects(
  fetchBytesWithRetry("https://example.test/slow.avif", {
    fetchImpl: async (_url, { signal }) => {
      timedOutAttempts++;
      await new Promise((_resolve, reject) => {
        const guard = setTimeout(
          () => reject(new Error("timeout signal was not delivered")),
          100,
        );
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(guard);
            reject(signal.reason);
          },
          { once: true },
        );
      });
    },
    maxRetries: 1,
    retryDelayMs: 0,
    sleepImpl: async () => {},
    timeoutMs: 1,
  }),
  /timeout/i,
);
assert.equal(timedOutAttempts, 2, "timed-out requests use the retry budget");

let active = 0;
let peak = 0;
const results = await mapWithConcurrency(
  [1, 2, 3, 4, 5, 6],
  async (value) => {
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 2));
    active--;
    return value * 2;
  },
  2,
);
assert.deepEqual(results, [2, 4, 6, 8, 10, 12]);
assert.equal(peak, 2, "metadata requests respect the concurrency limit");

console.log("Image metadata request regression tests passed.");
