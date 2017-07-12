export function isList(obj) {
  return Array.isArray(obj)
}

export function isDictionary(obj) {
  return typeof obj === 'object' && !Array.isArray(obj)
}
