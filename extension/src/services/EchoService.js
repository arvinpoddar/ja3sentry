export default {
  async retrieveNewJA3() {
    const echoServerURL = `https://echo.ja3sentry.com`;
    const res = await fetch(echoServerURL);
    return await res.json();
  },
};
