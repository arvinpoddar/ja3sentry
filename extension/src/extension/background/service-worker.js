import CacheService from "@/services/CacheService.js";
import { fetchAndValidateJA3 } from "@/services/RootService";

chrome.runtime.onInstalled.addListener(async () => {
  await CacheService.wipeCache();
  await fetchAndValidateJA3();
});

chrome.runtime.onStartup.addListener(async () => {
  await fetchAndValidateJA3();
});

setInterval(fetchAndValidateJA3, 20000);
