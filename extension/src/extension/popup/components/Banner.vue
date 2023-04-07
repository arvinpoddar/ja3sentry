<template>
  <div class="info-banner" :style="bannerStyle">
    <div class="flex justify-between items-center">
      <div class="text-lg font-semibold">{{ title }}</div>
      <strong
        class="text-xl align-center cursor-pointer"
        v-if="clearable"
        @click="emitClear"
      >
        &times;
      </strong>
    </div>

    <div class="text-sm font-light text-grey-light">
      {{ content }}
    </div>

    <div v-if="date" class="mt-2 text-xs font-light text-grey-light">
      Reported: {{ date }}
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { COLORS } from "@/constants/index";

export default defineComponent({
  emits: ["clear"],
  props: {
    type: String,
    title: String,
    content: String,
    date: String,
    clearable: Boolean,
  },
  setup(props, ctx) {
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

    const emitClear = () => {
      ctx.emit("clear");
    };

    return {
      bannerStyle,
      emitClear,
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
  overflow-wrap: break-word;
}
</style>
