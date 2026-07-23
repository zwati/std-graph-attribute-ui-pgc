// src/utils/apiCache.js — High performance in-memory client cache
const cacheStore = new Map();
const DEFAULT_TTL = 60 * 1000; // 60 seconds TTL

export const apiCache = {
  get(key) {
    const item = cacheStore.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      cacheStore.delete(key);
      return null;
    }
    return item.data;
  },

  set(key, data, ttl = DEFAULT_TTL) {
    cacheStore.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  },

  invalidate(prefix = '') {
    if (!prefix) {
      cacheStore.clear();
      return;
    }
    for (const key of cacheStore.keys()) {
      if (key.startsWith(prefix)) {
        cacheStore.delete(key);
      }
    }
  },
};
