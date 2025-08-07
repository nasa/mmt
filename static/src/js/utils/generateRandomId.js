/**
 * Generates a random ID string combining a timestamp and a random number.
 *
 * The generated ID has two parts:
 * 1. A timestamp (current time in milliseconds since epoch) converted to base 36.
 * 2. A random number converted to base 36.
 *
 * These parts are joined with a hyphen to form the final ID.
 *
 * @returns {string} A string representing a random ID in the format "timestamp-randomnumber".
 */
const generateRandomId = () => {
  const randomPart = Math.random().toString(36).slice(2, 11)
  const datePart = Date.now().toString(36)

  return `${datePart}-${randomPart}`
}

export default generateRandomId
