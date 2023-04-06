import { COLORS } from "@/constants";

import Echo from "@/services/EchoService.js";
import CacheService from "@/services/CacheService.js";
import ValidateService from "@/services/ValidateService.js";
import LocalRiskService from "@/services/LocalRiskService";

export const fetchAndValidateJA3 = async () => {
  try {
    let bannerColor = COLORS.POSITIVE;

    console.log("Fetching JA3 and updating cache");
    const newEntry = await Echo.retrieveNewJA3();
    await CacheService.addJA3BlockToCache(newEntry);

    const cache = await CacheService.retrieveCache();

    // Evaluate JA3 and UA locally first
    const risk = LocalRiskService.getEntryRisk(newEntry);
    if (risk) {
      await LocalRiskService.catalogRiskyEntry(newEntry);
    }

    // Then check the entry remotely
    const threat = await ValidateService.validateCache(cache);

    if (threat) {
      bannerColor = COLORS.NEGATIVE;
      await CacheService.setBanner(threat);
    } else if (risk) {
      bannerColor = COLORS.WARNING;
      await CacheService.setBanner(risk);
    }

    chrome.action.setBadgeText({ text: String(cache.length) });
    chrome.action.setBadgeBackgroundColor({ color: bannerColor });
  } catch (error) {
    console.error("[ERROR]", error);
  }
};
