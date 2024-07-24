<template>
  <div class="header-wrapper">
    <div class="header-item">
      <v-icon icon="mdi-table-large" />
      <img src="https://1000logos.net/wp-content/uploads/2021/05/Trello-logo.png"
        style="width: 85px; height: 45px; padding-left:12px" alt="logo">
      </img>
      <DefaultButton append-icon="mdi-chevron-down">Các không gian làm việc</DefaultButton>
      <DefaultButton append-icon="mdi-chevron-down">Gần đây</DefaultButton>
      <DefaultButton append-icon="mdi-chevron-down">Đã đánh dấu sao</DefaultButton>
      <DefaultButton append-icon="mdi-chevron-down">Mẫu</DefaultButton>
      <DefaultButton buttonColor="gray">Tạo mới</DefaultButton>

    </div>
    <div class="header-item">
      <v-text-field prepend-inner-icon="mdi-magnify" density="compact" width="200" max-height="32" label="Tìm kiếm"
        variant="outlined" hide-details></v-text-field>
      <IconButton style="border-radius: 50%" icon="mdi-bell-outline"></IconButton>
      <IconButton style="border-radius: 50%" icon="mdi-help-circle-outline"></IconButton>
      <v-avatar size="26" image="https://avatar.iran.liara.run/public/97"></v-avatar>
    </div>

  </div>
</template>

<script>
import DefaultButton from '@/components/button/DefaultButton.vue'
import IconButton from '@/components/button/IconButton.vue'
export default {
  name: 'Header',
  components: {
    DefaultButton,
    IconButton
  }
}
</script>

<style lang="scss">
.header-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  max-height: 50px;
  border-bottom: 1px solid #cecece;

  .header-item {
    display: flex;
    align-items: center;
  }

  .v-field {
    height: 28px;

    .v-field__prepend-inner {
      font-size: 12px !important;
      height: 28px;
    }

    .v-field__field {
      height: 32px;

      input {
        padding-top: 0;
        font-size: 14px;
      }

      label {
        font-size: 14px;
      }
    }
  }
}
</style>