<template>
  <div class="info-banner" :style="bannerStyle">
    <div class="text-lg font-semibold">{{ title }}</div>

    <div class="text-sm font-light text-grey-light">
      {{ content }}
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { COLORS } from "@/constants/index";

export default defineComponent({
  props: {
    type: String,
    title: String,
    content: String,
  },
  setup(props) {
    const bannerColor = computed(() => {
      if (props.type === "warning") {
        return COLORS.WARNING;
      } else if (props.type === "negative") {
        return COLORS.NEGATIVE;
      } else {
        return COLORS.POSITIVE;
      }
    });

    const bannerStyle = computed(() => {
      return {
        border: `1px solid ${bannerColor.value}`,
        borderLeft: `5px solid ${bannerColor.value}`,
      };
    });

    return {
      bannerStyle,
    };
  },
});
</script>

<style>
.info-banner {
  border-radius: 5px;
  background-color: #1d1d1d;
  color: #fafafb;
  padding: 12px;
}
</style>
