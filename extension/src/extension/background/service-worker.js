import CacheService from "@/services/CacheService.js";
import { fetchAndValidateJA3 } from "@/services/RootService";
import { CACHE } from "@/constants";

let interval = setInterval(fetchAndValidateJA3, 20000);

browser.runtime.onInstalled.addListener(async () => {
  await CacheService.wipeCache();
  const savedPollInterval = await CacheService.retrievePollInterval();
  updatePollInterval(savedPollInterval);
});

browser.runtime.onStartup.addListener(async () => {
  const savedPollInterval = await CacheService.retrievePollInterval();
  updatePollInterval(savedPollInterval);
});

browser.storage.onChanged.addListener((changes) => {
  if (!changes[CACHE.POLL_TIME]) {
    return;
  }
  const newIntervalPeriod = changes[CACHE.POLL_TIME].newValue;
  updatePollInterval(newIntervalPeriod);
});

const updatePollInterval = (newIntervalMs) => {
  clearInterval(interval);
  interval = setInterval(fetchAndValidateJA3, newIntervalMs);
};
