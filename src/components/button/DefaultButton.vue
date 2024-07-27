<template>
  <v-btn class="default-button text-none" :disabled="isDisabled"
    :style="{ backgroundColor: colors[buttonColor], color: colors[textColor] }">
    <div class="btn-body">
      <slot></slot>
    </div>
  </v-btn>
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
        brown: '#00000080',
        cardColor: "#f1f2f4",
        blue: "#0C66E4",
        cardDetailColor: '#091e420f'
      }
    };
  },
};
</script>

<style lang="scss" scoped>
.v-btn--elevated:active {
  box-shadow: unset;
}

.v-btn--elevated:focus {
  box-shadow: unset;

}

.v-btn--density-default {
  padding: 6px 10px 6px 12px;
  margin: 0 4px;
  height: 32px !important;
  border-radius: 4px;
  box-shadow: none;
  letter-spacing: unset !important;

  .btn-body {
    font-size: 14px !important;
    font-weight: 500 !important;
  }

}

.v-btn--density-default:hover {
  background-color: var(--header-menu-background) !important;
  box-shadow: none;
}

.v-btn--density-default:disabled {
  background-color: var(--ms-disable-background-button) !important;
  color: var(--ms-disable-text-button) !important;
  cursor: not-allowed;
}
</style>
