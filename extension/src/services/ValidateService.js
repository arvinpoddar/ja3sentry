import CacheControl from "./CacheService";

export default {
  async validateCache() {
    const cache = await CacheControl.retrieveCache();
    //TODO: SEND TO API
    console.log(cache);
    return;
  },
};