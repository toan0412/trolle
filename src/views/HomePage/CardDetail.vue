<template>
  <div class="wrap">
    <v-dialog v-model="dialog" max-width="768px" class="card-detail">
      <v-card height="845px">
        <!-- header -->
        <header>
          <IconButton @click="closeDialog" icon="mdi-close"></IconButton>
          <IconButton icon="mdi-card-account-details-outline"></IconButton>
          <div class="header-content">
            <div class="card-name">{{ cardDetail.header }}</div>
            <div class="d-sm-inline-block">
              <span>trong danh sách</span>&nbsp;
              <span class="list-current">{{ columnDetail.type }}</span>
            </div>
          </div>
        </header>
        <!-- body -->
        <div class="card-detail-body">
          <div class="card-detail-content">
            <!-- card-detail-notifycation -->
            <div class="card-detail-notifycation">
              <div class="font-weight-bold">Thông báo</div>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-eye-outline">Theo dõi</DefaultButton>
            </div>
            <!-- card-detail-desc -->
            <div class="card-detail-desc">
              <DefaultButton class="button-text-bold" prepend-icon="mdi-format-list-bulleted">Mô tả</DefaultButton>
              <DefaultButton @click="toogleDescAreaEditor" v-if="isDescAreaEditor" buttonColor="cardDetailColor"
                class="add-desc-button">
                {{ cardDetail.desc || 'Thêm mô tả chi tiết hơn' }}
              </DefaultButton>
              <div v-else class="mgl-40">
                <v-textarea v-model="cardDetailDesc" rows="5" placeholder="Nhập mô tả ..." variant="outlined" auto-grow
                  shaped hide-details></v-textarea>
                <div class="card-detail-desc-actions">
                  <DefaultButton buttonColor="blue" textColor="white" @click="addDesc">Lưu</DefaultButton>
                  <DefaultButton @click="toogleDescAreaEditor" colorButton="white">Hủy</DefaultButton>
                </div>
              </div>
            </div>
            <!-- card-detail-activity -->
            <div class="card-detail-activity">
              <DefaultButton class="button-text-bold" prepend-icon="mdi-clipboard-list-outline">Hoạt động</DefaultButton>
              <DefaultButton @click="toogleActivityAreaEditor" v-if="isActivityAreaEditor" buttonColor="white"
                class="add-activity-button">
                {{ cardDetail.activity || "Nhập hoạt động ..." }}</DefaultButton>
              <div v-else class="mgl-40">
                <v-textarea v-model="cardDetailActivity" rows="2" placeholder="Nhập hoạt động ..." variant="outlined"
                  auto-grow shaped hide-details></v-textarea>
                <div class="card-detail-desc-actions">
                  <DefaultButton @click="addActivity" buttonColor="blue" textColor="white">Lưu</DefaultButton>
                  <DefaultButton @click="toogleActivityAreaEditor" colorButton="white">Hủy</DefaultButton>
                </div>
              </div>
            </div>
          </div>
          <!-- actions -->
          <div class="card-detail-actions">
            <div class="group-actions">
              <div class="font-weight-bold">Thêm vào thẻ</div>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-account-outline">Thành viên</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-label-multiple-outline">Nhãn</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-checkbox-marked-circle-outline">Việc cần làm
              </DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-clock-outline">Ngày</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-attachment">Đính kèm</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-image-size-select-actual">Ảnh bìa
              </DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-adjust">Trường tùy chỉnh</DefaultButton>
            </div>
            <div class="group-actions">
              <div class="font-weight-bold">Tiện ích bổ sung</div>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-plus">Thêm tiện ích bổ sung</DefaultButton>
            </div>
            <div class="group-actions">
              <div class="font-weight-bold">Tự động hóa</div>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-plus">Thêm nút</DefaultButton>
            </div>
            <div class="group-actions">
              <div class="font-weight-bold">Thao tác</div>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-arrow-right">Di chuyển</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-content-copy">Sao chép</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-plus">Di chuyển</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-account-convert-outline">Tạo mẫu
              </DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-archive-outline">Lưu trữ</DefaultButton>
              <DefaultButton buttonColor="cardDetailColor" prepend-icon="mdi-share-variant-outline">Chia sẻ
              </DefaultButton>
            </div>
          </div>
        </div>
        {{ cardDetail }}
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import IconButton from '@/components/button/IconButton.vue'
import DefaultButton from '@/components/button/DefaultButton.vue'

export default {
  name: 'CardDetail',
  data() {
    return {
      dialog: false,
      isDescAreaEditor: true,
      isActivityAreaEditor: true,
      cardDetailDesc: '',
      cardDetailActivity: '',
    };
  },

  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    toogleDescAreaEditor() {
      this.isDescAreaEditor = !this.isDescAreaEditor
    },
    toogleActivityAreaEditor() {
      this.isActivityAreaEditor = !this.isActivityAreaEditor
    },
    addDesc() {
      if (this.cardDetailDesc.trim() === '') return
      this.cardDetail.desc = this.cardDetailDesc
      this.cardDetailDesc = ''
      this.toogleDescAreaEditor()
    },
    addActivity() {
      if (this.cardDetailActivity.trim() === '') return
      this.cardDetail.activity = this.cardDetailActivity
      this.cardDetailActivity = ''
      this.toogleActivityAreaEditor()
    }
  },

  components: {
    IconButton,
    DefaultButton,
  },

  props: {
    cardDetail: Object,
    columnDetail: Object,
  },

  watch: {
    cardDetail: {
      handler(newValue) {
        if (!newValue) return
        if (newValue.desc != null)
          this.cardDetailDesc = newValue.desc;
        if (newValue.activity != null)
          this.cardDetailActivity = newValue.activity;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
.v-card--density-default {
  border-radius: 8px !important;
}

header {
  display: flex;
  align-items: center;
  position: relative;
  height: 88px;

  .card-name {
    font-size: 20px;
    font-weight: 600;
    color: var(--dynamic-text);
  }

  .d-sm-inline-block {
    color: var(--ds-text-subtle, #44546f);
    font-size: 14px;
    font-weight: 400;

    .list-current {
      text-decoration: underline;
    }
  }

  .icon-button {
    position: absolute !important;
  }

  .icon-button:nth-child(1) {
    right: 6px;
    top: 10px;
  }

  .icon-button:nth-child(2) {
    left: 6px;
    top: 16px;
  }
}

.header-content {
  padding: 8px 52px 8px 56px;
  display: flex;
  flex-direction: column;
}

/* card body */
.card-detail-body {
  display: flex;
}

/* card content */
.card-detail-content {
  width: 576px;
  padding: 0 8px 8px 16px;

  .card-detail-notifycation {
    margin-left: 40px;
  }

  .card-detail-desc__editor {
    height: 275px;
    width: 512px;
    border: 1px solid var(--ds-border-line);
    border-radius: 0 0 4px 4px;

    .ql-editor {
      font-size: 14px;
    }
  }

  .card-detail-activity__editor {
    height: 64px;
    width: 512px;
    border: 1px solid var(--ds-border-line);
  }

  .card-detail-desc,
  .card-detail-activity {
    .card-detail-body {
      display: flex;
      margin-left: 40px;
    }
  }

  .card-detail-desc-actions {
    display: flex;
    margin-top: 8px;

    .v-btn {
      min-width: 48px;
      width: 48px;
    }
  }

  .add-desc-button,
  .add-activity-button {
    width: 512px;
    height: 56px !important;
    margin-left: 40px !important;
  }

  .add-activity-button {
    border: 1px solid #cecece;
    border-radius: 8px;
  }

  .v-textarea {
    .v-field__field {
      textarea {
        font-size: 14px;
      }
    }
  }
}

/* card action */
.card-detail-actions {
  width: 192px;
  padding: 0 16px 8px 8px;

  .group-actions {
    margin-bottom: 16px;
  }
}

/* CSS chung */
.card-detail-actions {
  .v-btn {
    display: flex;
    justify-content: flex-start;
    margin-left: 0 !important;
    margin-bottom: 8px !important;
    width: 168px;

  }
}

.font-weight-bold {
  color: var(--ds-text-subtle, #44546f);
  font-size: 12px;
  margin: 0 8px 4px 0;
}

.mgl-40 {
  margin-left: 40px;
  margin-top: 8px
}
</style>
