const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];
const RETRYABLE_ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ENOTFOUND',
  'EAI_AGAIN',
];

function isRetryable(error) {
  const status = error?.status ?? error?.response?.status;
  const code = error?.code;

  return (
    RETRYABLE_STATUS_CODES.includes(status) ||
    RETRYABLE_ERROR_CODES.includes(code)
  );
}

export async function retry(
  fn,
  {
    retries = 3,
    delay = 1000,
    factor = 2,
    onRetry = null,
  } = {}
) {
  let currentDelay = delay;
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryable(error) || attempt === retries) {
        throw error;
      }

      onRetry?.(error, attempt);

      await new Promise(resolve =>
        setTimeout(resolve, currentDelay)
      );

      currentDelay *= factor;
    }
  }

  throw lastError;
}