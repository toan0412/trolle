<template>
  <button :disabled="disabled" class="icon-button" :color="disabled ? 'e0e0e0' : 'ffffff'"
    :style="{ color: disabled ? 'a6a6a6' : '#3d3f4e' }">
    <v-icon v-if="icon" :size="iconSize" :color="disabled ? 'a6a6a6' : '#3d3f4e'">
      {{ icon }}
    </v-icon>
    <slot />
  </button>
</template>

<script>
export default {
  name: 'IconButton',
  props: {
    icon: {
      type: String,
      default: null
    },
    iconSize: {
      type: String,
      default: '22px'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.icon-button {
  font-size: 14px;
  height: 32px;
  width: 32px;
  padding: 4;
  margin: 0 6px;
  border-radius: 4px;
  color: var(--dynamic-text);
}

.icon-button:disabled {
  background-color: var(--ms-disable-background-button) !important;
  color: var(--ms-disable-text-button) !important;
  cursor: not-allowed;
}

.icon-button:hover {
  background-color: var(--header-menu-background);
}
</style>