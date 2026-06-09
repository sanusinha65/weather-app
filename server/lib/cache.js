const store = new Map();

const DEFAULT_TTL_MS = (Number(process.env.CACHE_TTL_SECONDS) || 300) * 1000;

/**
 * Returns the cached value for `key` if present and not expired, otherwise null.
 */
function get(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Stores `value` under `key`. `ttlMs` overrides the default TTL when provided.
 */
function set(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function clear() {
  store.clear();
}

module.exports = { get, set, clear };
