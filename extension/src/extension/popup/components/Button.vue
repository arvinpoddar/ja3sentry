<template>
  <button
    :disabled="disabled"
    :class="[`button--${type}`]"
    class="px-5 py-3 border-none rounded text-[12px] font-semibold cursor-pointer transition-colors active:opacity-90"
  >
    <slot v-if="$slots.default" />

    <span v-else-if="label">
      {{ label }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    label: String,

    disabled: Boolean,

    type: {
      type: String,
      default: "primary",
    },
  },
};
</script>

<style scoped>
.button--primary {
  @apply text-white;
  background-color: #6366f1;
}

.button--primary:disabled {
  @apply bg-grey-darker cursor-default text-grey-medium;
}

.button--ghost {
  @apply bg-transparent w-auto p-0 text-white;
}
</style>
