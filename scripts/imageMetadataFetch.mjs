const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 250;

class HttpError extends Error {
  constructor(url, status) {
    super(`HTTP ${status} from ${url}`);
    this.name = "HttpError";
    this.status = status;
    this.retryable = status === 408 || status === 425 || status === 429 || status >= 500;
  }
}

function isRetryableError(error) {
  if (error instanceof HttpError) return error.retryable;
  return true;
}

function getRetryDelay(attempt, baseDelayMs) {
  return baseDelayMs * 2 ** (attempt - 1);
}

export async function fetchBytesWithRetry(
  url,
  {
    fetchImpl = fetch,
    headers,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    returnDetails = false,
    sleepImpl = (delay) => new Promise((resolve) => setTimeout(resolve, delay)),
  } = {},
) {
  if (!Number.isInteger(maxRetries) || maxRetries < 0) {
    throw new RangeError("maxRetries must be a non-negative integer");
  }

  const maxAttempts = maxRetries + 1;
  let lastError;
  let attempts = 0;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    attempts = attempt;
    try {
      const response = await fetchImpl(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) throw new HttpError(url, response.status);
      const bytes = Buffer.from(await response.arrayBuffer());
      return returnDetails ? { attempts: attempt, bytes } : bytes;
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || attempt === maxAttempts) break;
      await sleepImpl(getRetryDelay(attempt, retryDelayMs));
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  const finalError = new Error(`${message} (after ${attempts} attempt(s))`, {
    cause: lastError,
  });
  finalError.attempts = attempts;
  throw finalError;
}

export async function mapWithConcurrency(values, mapper, concurrency = 4) {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive integer");
  }

  const results = new Array(values.length);
  let nextIndex = 0;
  const workerCount = Math.min(concurrency, values.length);

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await mapper(values[index], index);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}
