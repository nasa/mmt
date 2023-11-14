import compactDeep from 'compact-object-deep'

// The compactDeep function takes a second argument allowing the caller to override what should be considered a empty value, so in this case, if the "type" of the value is boolean, we are telling it NOT to consider it an empty value, otherwise false would be considered empty with the default implementation."
const removeEmpty = (obj) => compactDeep(obj, (val) => {
  if (typeof val === 'boolean') { return val }

  return undefined
})

export default removeEmpty
