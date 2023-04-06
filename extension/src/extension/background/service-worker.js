import CacheService from "@/services/CacheService.js";
import { fetchAndValidateJA3 } from "@/services/RootService";

browser.runtime.onInstalled.addListener(async () => {
  await CacheService.wipeCache();
  await fetchAndValidateJA3();
});

browser.runtime.onStartup.addListener(async () => {
  await fetchAndValidateJA3();
});

setInterval(fetchAndValidateJA3, 20000);
