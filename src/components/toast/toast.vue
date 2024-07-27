<template>
  <v-snackbar
    v-model="show"
    :color="snackbarType"
    timeout="6000"
    :multi-line="true"
    :class="['toast', snackbarType]"
  >
    <v-icon v-if="snackbarType === 'error'" class="toast-icon mr-2"
      >mdi-alert-circle-outline</v-icon
    >
    <v-icon v-if="snackbarType === 'success'" class="toast-icon mr-2"
      >mdi-check-circle-outline</v-icon
    >
    <v-icon v-if="snackbarType === 'warning'" class="toast-icon mr-2">mdi-alert</v-icon>
    <v-icon v-if="snackbarType === 'notification'" class="toast-icon mr-2">mdi-bell</v-icon>

    <div style="padding-left: 18px; padding-right: 2px">
      <div class="toast-title">{{ title }}</div>
      <div class="toast-message">{{ message }}</div>
    </div>
  </v-snackbar>
</template>
  
  <script>
export default {
  name: 'Snackbar',
  data() {
    return {
      show: false,
      snackbarType: '',
      title: '',
      message: ''
    }
  },
  methods: {
    showSnackbar(type, title, message) {
      this.snackbarType = type
      this.title = title
      this.message = message
      this.show = true
    }
  }
}
</script>
  
  <style lang="scss">
.v-snackbar--multi-line {
  .v-snackbar__wrapper {
    min-height: 80px;
    min-width: 300px;
    position: fixed !important;
    right: 32px !important;
    bottom: 32px !important;
    border-left: 4px solid transparent;
    background-color: white !important;
  }
}

.v-snackbar__content {
  display: flex !important;
  color: black;
  align-items: center !important;

  .toast-icon {
    font-size: 36px;
    padding-left: 2px;
  }

  .toast-title {
    font-size: 16px;
    font-weight: 700 !important;
  }

  .toast-message {
    font-size: 13px;
  }
}

.toast.success {
  .v-snackbar__wrapper {
    border-left-color: #03ae66;

    .toast-icon {
      color: #03ae66 !important;
    }
  }
}

.toast.error {
  .v-snackbar__wrapper {
    border-left-color: #ee6b6e;

    .toast-icon {
      color: #ee6b6e !important;
    }
  }
}
</style>