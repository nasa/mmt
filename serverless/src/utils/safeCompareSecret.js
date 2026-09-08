import { timingSafeEqual } from 'crypto'

/**
 * Compares a caller-supplied secret against the expected value in constant time.
 *
 * A plain `===` returns as soon as the first differing byte is found, which
 * leaks how much of the secret a caller guessed correctly. `timingSafeEqual`
 * always compares the full buffers. It throws when the buffers differ in
 * length, so the length check (itself not secret) happens first.
 * @param {string} provided The value received from the request
 * @param {string} expected The configured secret to compare against
 * @returns {boolean} true only when both are non-empty strings of equal value
 */
export const safeCompareSecret = (provided, expected) => {
  if (typeof provided !== 'string' || typeof expected !== 'string') return false
  if (provided.length === 0 || expected.length === 0) return false

  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)

  if (providedBuffer.length !== expectedBuffer.length) return false

  return timingSafeEqual(providedBuffer, expectedBuffer)
}

export default safeCompareSecret
