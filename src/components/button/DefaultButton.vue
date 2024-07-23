<template>
  <button class="default-button text-none" :disabled="isDisabled"
    :style="{ backgroundColor: colors[buttonColor], color: colors[textColor] }">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "DefaultButton",
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    buttonColor: {
      type: String,
      default: 'white',
    },
    textColor: {
      type: String,
      default: 'primaryColor'
    }
  },
  data() {
    return {
      colors: {
        primaryColor: '#172B4D',
        white: '#ffffff',
        black: '#3d3f4e',
        gray: "#00000033",
      }
    };
  },
};
</script>

<style lang="scss" scoped>
.default-button {
  font-size: 14px;
  padding: 6px 10px 6px 12px;
  margin: 0 4px;
  height: 32px;
  font-weight: 500 !important;
  border-radius: 4px;
}

.default-button:hover {
  background-color: var(--header-menu-background) !important;
}

.default-button:disabled {
  background-color: var(--ms-disable-background-button) !important;
  color: var(--ms-disable-text-button) !important;
  cursor: not-allowed;
}
</style>
