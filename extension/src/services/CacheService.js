import { CACHE } from "@/constants";

export default {
  getDateString() {
    return new Date().toLocaleString();
  },

  async retrieveCache() {
    const cache = await chrome.storage.local.get(CACHE.KEY);
    return cache[CACHE.KEY] || [];
  },

  async retrieveLastUpdatedDate() {
    const date = await chrome.storage.local.get(CACHE.LAST_UPDATED);
    return date[CACHE.LAST_UPDATED] || this.getDateString();
  },

  async setLastUpdatedDate() {
    await chrome.storage.local.set({
      [CACHE.LAST_UPDATED]: this.getDateString(),
    });
  },

  async addJA3BlockToCache(ja3) {
    const cache = await this.retrieveCache();
    console.log(cache);
    if (cache.length + 1 > CACHE.MAX_ENTRIES) {
      cache.pop();
    }
    cache.unshift(ja3);

    await chrome.storage.local.set({ [CACHE.KEY]: cache });
    await this.setLastUpdatedDate();
  },

  async wipeCache() {
    await chrome.storage.local.set({ [CACHE.KEY]: [] });
    await this.setLastUpdatedDate();
  },
};
