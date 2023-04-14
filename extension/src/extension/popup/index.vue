<template>
  <div class="extension-outer">
    <header class="flex items-center p-2 bg-grey-darker">
      <img src="../../static/icons/logo.png" alt="" class="ja3-logo" />
      <h1 class="text-base ml-2 text-grey-light font-semibold">JA3Sentry</h1>
    </header>

    <main class="py-5 px-4">
      <Banner
        v-if="banner"
        :type="banner.type"
        :title="banner.title"
        :content="banner.message"
        :date="banner.date"
        class="mb-2"
        clearable
        @clear="clearBanner"
      />
      <Banner
        v-else
        type="Positive"
        title="All Clear!"
        content="No suspicious JA3 activity detected"
        class="mb-2"
      />

      <div class="mt-2 text-xs font-light text-grey-light">
        Last Updated: {{ lastUpdated }}
      </div>

      <div class="mt-3">
        <header
          class="flex items-center p-2 bg-grey-darker cursor-pointer select-none cache-display-header"
          @click="toggleCacheDisplay"
        >
          <div class="text-base text-white font-semibold flex-1">
            {{ toggleDisplayHeader }}
          </div>
          <h1 class="text-2xl text-white font-semibold">
            {{ toggleDisplayIcon }}
          </h1>
        </header>

        <div class="cache-display" v-if="displayCache">
          <div
            v-for="(entry, index) of cache"
            :key="index"
            class="font-mono text-sm cache-entry"
          >
            {{ formatEntry(entry) }}
          </div>
        </div>
      </div>

      <div class="flex items-center mt-6">
        <input
          v-model.number="pollFrequencySeconds"
          type="range"
          :min="MIN_INTERVAL_SECONDS"
          :max="MAX_INTERVAL_SECONDS"
          @change="setPollFrequency"
        />
        <div class="ml-2 text-white text-xs">
          Poll: {{ pollFrequencySeconds }} secs
        </div>

        <div class="flex-1"></div>

        <Button
          label="Check Now"
          type="primary"
          :disabled="loading"
          @click="manuallyCheckJA3"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { fetchAndValidateJA3 } from "@/services/RootService";
import CacheService from "@/services/CacheService";

import Button from "@/extension/popup/components/Button.vue";
import Banner from "@/extension/popup/components/Banner.vue";
import { onMounted, ref, computed } from "vue";

export default {
  components: {
    Button,
    Banner,
  },

  setup() {
    const banner = ref(null);
    const cache = ref([]);
    const lastUpdated = ref("");
    const loading = ref(false);

    const updateCacheDisplay = async () => {
      banner.value = await CacheService.retrieveBanner();
      cache.value = await CacheService.retrieveCache();
      lastUpdated.value = await CacheService.retrieveLastUpdatedDate();
    };

    const clearBanner = async () => {
      banner.value = null;
      await CacheService.clearBanner();
    };

    const displayCache = ref(false);
    const toggleCacheDisplay = () => {
      displayCache.value = !displayCache.value;
    };

    const toggleDisplayHeader = computed(() => {
      return displayCache.value
        ? "Hide Recent JA3s"
        : `Show Recent JA3s (${cache.value.length})`;
    });

    const toggleDisplayIcon = computed(() => {
      return displayCache.value ? "-" : "+";
    });

    const manuallyCheckJA3 = async () => {
      try {
        loading.value = true;
        await fetchAndValidateJA3();
        await updateCacheDisplay();
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const formatEntry = (entry) => {
      return JSON.stringify(entry, null, 2);
    };

    const MIN_INTERVAL_SECONDS = 3;
    const MAX_INTERVAL_SECONDS = 2 * 60;
    const MIN_INTERVAL_MS = MIN_INTERVAL_SECONDS * 1000;
    const MAX_INTERVAL_MS = MAX_INTERVAL_SECONDS * 1000;

    const pollFrequencySeconds = ref(20);

    const constrainInterval = (ms) => {
      return Math.min(Math.max(ms, MIN_INTERVAL_MS), MAX_INTERVAL_MS);
    };

    const setPollFrequency = async () => {
      const interval = constrainInterval(pollFrequencySeconds.value * 1000);
      await CacheService.setPollInterval(interval);
    };

    onMounted(async () => {
      // Grab poll frequency from cache
      const pollPeriodMs = await CacheService.retrievePollInterval();
      pollFrequencySeconds.value = constrainInterval(pollPeriodMs) / 1000;

      // Update banner contents and JA3 from cache
      updateCacheDisplay();
      setInterval(async () => {
        updateCacheDisplay();
      }, 1000);
    });

    return {
      cache,
      banner,
      lastUpdated,

      displayCache,
      toggleCacheDisplay,
      toggleDisplayHeader,
      toggleDisplayIcon,

      MIN_INTERVAL_SECONDS,
      MAX_INTERVAL_SECONDS,
      pollFrequencySeconds,
      setPollFrequency,

      manuallyCheckJA3,
      formatEntry,
      clearBanner,
    };
  },
};
</script>

<style scoped>
.extension-outer {
  min-width: 480px;
  max-width: 480px;
  width: 480px;
}

.ja3-logo {
  width: 28px;
  height: 28px;
  user-select: none;
}

.cache-display-header {
  background-color: #1d1d1d;
}

.cache-display {
  max-height: 280px;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid #878787;
  border-radius: 5px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.cache-entry {
  width: 100%;
  padding: 8px;
  background-color: #292a2d;
  color: #f1f1fa;
  border-radius: 5px;
  margin-bottom: 12px;
  font-size: 10px;
  overflow-wrap: break-word;
}

.cache-entry:last-of-type {
  margin-bottom: 0px;
}
</style>
