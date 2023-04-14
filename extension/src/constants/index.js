export const COLORS = {
  BADGE_BACKGROUND_COLOR: "#186200",
  POSITIVE: "#21BA45",
  WARNING: "#F2C037",
  NEGATIVE: "#C10015",
};

export const BANNER = {
  POSITIVE: "positive",
  WARNING: "warning",
  NEGATIVE: "negative",
};

export const CACHE = {
  MAX_ENTRIES: 4,
  KEY: "ja3-sentry-cache",
  LAST_UDPATED: "ja3-sentry-last-updated",
  BANNER: "ja3-banner",
  POLL_TIME: "ja3-poll-time",
};

// For local testing, use http://localhost:4000
const BASE_URL =
  "https://c3bmczes6tkwdfy5jnysnfokqe0recue.lambda-url.us-east-2.on.aws/api";

export const API = {
  ECHO_SERVER: "https://echo.ja3sentry.com",
  POTENTIAL_THREAT_ENDPOINT: `${BASE_URL}/potential-threat`,
  VERIFY_ENDPOINT: `${BASE_URL}/verify`,
};
