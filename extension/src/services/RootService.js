import { COLORS } from "@/constants";

import Echo from "@/services/EchoService.js";
import CacheService from "@/services/CacheService.js";
import ValidateService from "@/services/ValidateService.js";
import LocalRiskService from "@/services/LocalRiskService";

export const fetchAndValidateJA3 = async () => {
  try {
    console.log("Fetching JA3 and updating cache");
    const newEntry = await Echo.retrieveNewJA3();
    await CacheService.addJA3BlockToCache(newEntry);

    // Evaluate JA3 and UA locally first
    const risk = LocalRiskService.getEntryRisk(newEntry);
    if (risk) {
      await CacheService.setBanner(risk)
      await LocalRiskService.catalogRiskyEntry(newEntry)
    }

    const cache = await CacheService.retrieveCache();

    chrome.action.setBadgeText({ text: String(cache.length) });
    chrome.action.setBadgeBackgroundColor({ color: COLORS.POSITIVE });
  } catch (error) {
    console.error("[ERROR]", error);
  }
};
