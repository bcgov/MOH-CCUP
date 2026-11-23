<template>
  <!-- The live region is always rendered so screen readers announce the error when it appears.
       scrollToError() looks for .text-danger, so it must only exist while an error shows. -->
  <div aria-live="assertive">
    <div
      v-if="show"
      class="text-danger error"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
</script>
