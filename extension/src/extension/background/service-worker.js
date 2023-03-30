import CacheService from "@/services/CacheService.js";
import { fetchAndValidateJA3 } from "@/services/RootService";

import StorageUtil from "@/utils/storage.js";

chrome.runtime.onInstalled.addListener(async () => {
  await CacheService.wipeCache();
  await fetchAndValidateJA3();
});

chrome.runtime.onStartup.addListener(async () => {
  /*
  chrome.action.setBadgeBackgroundColor({
    color: COLORS.BADGE_BACKGROUND_COLOR,
  });
  */

  await fetchAndValidateJA3();
});

chrome.storage.onChanged.addListener(
  StorageUtil.getChangedStorageListener({
    quotation: () => console.log("cache changed"),
  })
);

setInterval(fetchAndValidateJA3, 20000);
