import { CACHE } from "@/constants";

export default {
  getDateString() {
    return new Date().toLocaleString();
  },

  async retrieveCache() {
    const cache = await browser.storage.local.get(CACHE.KEY);
    return cache[CACHE.KEY] || [];
  },

  async retrieveLastUpdatedDate() {
    const date = await browser.storage.local.get(CACHE.LAST_UPDATED);
    return date[CACHE.LAST_UPDATED] || this.getDateString();
  },

  async setLastUpdatedDate() {
    await browser.storage.local.set({
      [CACHE.LAST_UPDATED]: this.getDateString(),
    });
  },

  async retrieveBanner() {
    const banner = await browser.storage.local.get(CACHE.BANNER);
    return banner[CACHE.BANNER] || null;
  },

  async setBanner(banner) {
    await browser.storage.local.set({
      [CACHE.BANNER]: { ...banner, date: this.getDateString() },
    });
  },

  async clearBanner() {
    await browser.storage.local.set({ [CACHE.BANNER]: null });
  },

  async addJA3BlockToCache(ja3) {
    const cache = await this.retrieveCache();
    if (cache.length + 1 > CACHE.MAX_ENTRIES) {
      cache.pop();
    }
    cache.unshift(ja3);

    await browser.storage.local.set({ [CACHE.KEY]: cache });
    await this.setLastUpdatedDate();
  },

  async retrievePollInterval() {
    const data = await browser.storage.local.get(CACHE.POLL_TIME);
    return data[CACHE.POLL_TIME] || 20000;
  },

  async setPollInterval(ms) {
    await browser.storage.local.set({
      [CACHE.POLL_TIME]: ms,
    });
  },

  async wipeCache() {
    await browser.storage.local.set({ [CACHE.KEY]: [] });
    await browser.storage.local.set({ [CACHE.BANNER]: null });
    await this.setLastUpdatedDate();
  },
};
