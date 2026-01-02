/**
 * Safely parse a JSON field that might already be parsed (from Turso/libsql)
 * or might be a string (from local SQLite)
 */
export function parseJsonField(value: unknown): unknown {
  if (value === null || value === undefined) {
    return []
  }
  
  // Already parsed (object or array)
  if (typeof value === 'object') {
    return value
  }
  
  // String that needs parsing
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return []
    }
  }
  
  return []
}
