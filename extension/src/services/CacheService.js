import { CACHE } from "@/constants";

export default {
  async retrieveCache() {
    const cache = await chrome.storage.local.get(CACHE.KEY);
    return cache[CACHE.KEY] || [];
  },

  async addJA3BlockToCache(ja3) {
    const cache = await this.retrieveCache();
    console.log(cache)
    if (cache.length + 1 > CACHE.MAX_ENTRIES) {
      cache.pop();
    }
    cache.unshift(ja3);

    await chrome.storage.local.set({ [CACHE.KEY]: cache });
  },

  async wipeCache() {
    await chrome.storage.local.set({ [CACHE.KEY]: [] });
  },
};
