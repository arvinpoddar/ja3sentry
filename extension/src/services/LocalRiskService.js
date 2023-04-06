import { INSECURE_CIPHER_SUITES } from "../constants/ciphers";
import { BANNER, API } from "../constants/index";

export default {
  isRiskyUserAgentString(userAgentString) {
    if (!userAgentString) {
      return {
        title: "Warning - User Agent",
        message: "Your user agent is missing",
        type: BANNER.WARNING,
      };
    }

    const ua = userAgentString.toLowerCase();

    // Check for common suspicious browser strings
    const suspiciousIndicators = [
      "bot",
      "crawler",
      "spider",
      "curl",
      "wget",
      "python",
    ];

    if (suspiciousIndicators.some((ind) => ua.includes(ind.toLowerCase()))) {
      return {
        title: "Warning - User Agent",
        message: `Your user agent belongs to a suspicious browser: ${userAgentString}`,
        type: BANNER.WARNING,
      };
    }

    // Check for outdated or uncommon devices
    const outdatedDevices = [
      "Android 2.",
      "Android 4.",
      "iOS 6.",
      "iOS 7.",
      "Internet Explorer 6.",
      "Internet Explorer 7.",
      "Internet Explorer 8.",
      "Internet Explorer 9.",
      "Firefox 3.",
      "Firefox 4.",
      "Firefox 5.",
      "Firefox 6.",
      "Firefox 7.",
      "Firefox 8.",
      "Firefox 9.",
      "Firefox 10.",
    ];

    if (outdatedDevices.some((device) => ua.includes(device.toLowerCase()))) {
      return {
        title: "Warning - User Agent",
        message: `Your user agent belongs to an outdated device or OS: ${userAgentString}`,
        type: BANNER.WARNING,
      };
    }

    // If none of the above checks match, assume the user agent is clean
    return false;
  },

  isRiskyJA3(ja3String) {
    const [
      tlsVersion,
      ciphers,
      extensions,
      ellipticCurves,
      ellipticCurvePointFormats,
    ] = ja3String.split(",");

    // Low TLS version
    if (tlsVersion < "702") {
      return {
        title: "Warning - JA3",
        message: "Your JA3 has a deprecated TLS version",
        type: BANNER.WARNING,
      };
    }

    // Check if our JA3 contains any known insecure cipher suites
    const splitCiphers = ciphers.split("-");
    for (const [name, details] of Object.entries(INSECURE_CIPHER_SUITES)) {
      const sanitzedFirstHexByte = details.hex_byte_1.replace("0x", "");
      const sanitzedSecondHexByte = details.hex_byte_2.replace("0x", "");
      const hexBytes = sanitzedFirstHexByte + sanitzedSecondHexByte;
      const decimalValue = parseInt(hexBytes, 16).toString();

      if (splitCiphers.includes(decimalValue)) {
        return {
          title: "Warning - JA3",
          message: `Your JA3 has a deprecated cipher suite (${name}): ${ja3String}`,
          type: BANNER.WARNING,
        };
      }
    }

    // Check if our JA3 is missing extensions
    if (!extensions.length) {
      return {
        title: "Warning - JA3",
        message: `Your JA3 doesn't have any extensions: ${ja3String}`,
        type: BANNER.WARNING,
      };
    }

    return false;
  },

  getEntryRisk(entry) {
    const riskyJA3 = this.isRiskyJA3(entry.ja3);
    const riskyUA = this.isRiskyUserAgentString(entry.user_agent);
    // Risky JA3 warnings take precedence over user agent warnings
    return riskyJA3 || riskyUA;
  },

  async catalogRiskyEntry(entry) {
    const res = await fetch(API.POTENTIAL_THREAT_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ja3: entry.ja3,
        ja3_md5: entry.ja3_md5,
        ja3_sha1: entry.ja3_sha1,
        user_agent: entry.user_agent,
        collected_at: entry.date,
      }),
    });

    return await res.json();
  },
};
