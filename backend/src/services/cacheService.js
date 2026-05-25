/**
 * central cache service supporting high-performance in-memory TTL caching,
 * deep-cloning guards to prevent object mutation leakage, wildcard pattern-based invalidations,
 * and scalable hooks for Redis integrations.
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.cleanupInterval = 30 * 1000; // 30 seconds sweep

    // Run active background garbage collection of expired keys
    this.gcTimer = setInterval(() => {
      this._garbageCollect();
    }, this.cleanupInterval);

    // Ensure Node doesn't keep running just because of this interval
    if (this.gcTimer.unref) {
      this.gcTimer.unref();
    }
  }

  /**
   * Retrieves a deeply-cloned cached value if present and not expired
   * @param {string} key 
   * @returns {any} cached data or null
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Return deep cloned version to block in-memory reference mutations
    return this._deepClone(entry.value);
  }

  /**
   * Caches a value with a specific TTL (Time to Live)
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSeconds TTL in seconds
   * @returns {boolean} success
   */
  set(key, value, ttlSeconds = 300) {
    if (ttlSeconds <= 0) return false;

    const expiresAt = Date.now() + (ttlSeconds * 1000);
    const clonedValue = this._deepClone(value);

    this.cache.set(key, {
      value: clonedValue,
      expiresAt
    });

    return true;
  }

  /**
   * Deletes a specific key from the cache
   * @param {string} key 
   * @returns {boolean} true if deleted
   */
  del(key) {
    return this.cache.delete(key);
  }

  /**
   * Deletes all keys matching a wildcard pattern (e.g. 'products:*' or 'categories:*')
   * @param {string} pattern Wildcard pattern
   * @returns {number} number of cleared keys
   */
  delPattern(pattern) {
    if (!pattern) return 0;

    // Convert glob pattern to regex (e.g. "products:*" -> "^products:.*")
    const escapedPattern = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
                                  .replace(/\*/g, '.*');
    const regex = new RegExp(`^${escapedPattern}$`);
    
    let count = 0;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    if (count > 0) {
      console.log(`[CACHE] Purged ${count} keys matching pattern: "${pattern}"`);
    }
    return count;
  }

  /**
   * Clears the entire cache map
   */
  clear() {
    this.cache.clear();
    console.log('[CACHE] Entire cache cleared.');
  }

  /**
   * Internal garbage collection sweeping expired keys
   */
  _garbageCollect() {
    const now = Date.now();
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        count++;
      }
    }
    if (count > 0) {
      console.log(`[CACHE GC] Cleaned up ${count} expired keys.`);
    }
  }

  /**
   * Safeguard cloning utility for pure JSON objects
   */
  _deepClone(obj) {
    if (obj === undefined || obj === null) return obj;
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      // Fallback in case of non-serializable objects (mongoose documents, functions, dates)
      return obj;
    }
  }
}

module.exports = new CacheService();
