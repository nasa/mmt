/**
 * Determines the version name based on the provided version object.
 *
 * @param {Object} version - The version object containing version information.
 * @param {string} version.version - The actual version string.
 * @param {string} version.version_type - The type of the version (e.g., 'published').
 * @returns {string} The determined version name.
 */
export const getVersionName = (version) => {
  if (!version) return null

  return version.version_type === 'published' ? 'published' : version.version
}
