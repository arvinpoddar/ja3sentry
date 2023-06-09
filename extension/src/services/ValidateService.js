import { BANNER, API } from "../constants/index";

export default {
  async validateCache(entries) {
    const res = await fetch(API.VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ja3Block: entries,
      }),
    });

    // Returns an array of threats with a matching ja3
    const data = await res.json();

    if (!data.length) {
      return false;
    }

    const threat = data[0];
    let message = "A malicious JA3 was detected from your client. ";

    if (threat.reason) {
      message += `This threat is associated with ${threat.reason}.`;
    }

    if (threat.ja3_md5) {
      message += `\nMD5 Hash: ${threat.ja3_md5}`;
    } else if (threat.ja3_sha1) {
      message += `\nSHA1 Hash: ${threat.ja3_sha1}`;
    }

    return {
      type: BANNER.NEGATIVE,
      title: "Malicious JA3",
      message,
    };
  },
};
