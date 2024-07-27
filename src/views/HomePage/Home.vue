<template>
  <div class="board-header">
    <div class="board-header-item">
      <DefaultButton class="board-name-container">test</DefaultButton>
      <IconButton icon="mdi-star-outline"></IconButton>
      <DefaultButton prepend-icon="mdi-lock-outline">Riêng tư</DefaultButton>
      <DefaultButton textColor="white" buttonColor="brown" prepend-icon="mdi-chart-box-outline"
        >Bảng</DefaultButton
      >
      <IconButton icon="mdi-chevron-down"></IconButton>
    </div>
    <div class="board-header-item">
      <DefaultButton @click="showFakeDataDialog" buttonColor="danger" textColor="white"
        >Fake data</DefaultButton
      >
      <DefaultButton prepend-icon="mdi-rocket-launch-outline">Tiện ích bổ sung</DefaultButton>
      <DefaultButton prepend-icon="mdi-flash-outline">Tự động hóa</DefaultButton>
      <DefaultButton prepend-icon="mdi-filter-variant">Bộ lọc</DefaultButton>
      <DefaultButton textColor="white" buttonColor="brown" prepend-icon="mdi-account-plus-outline"
        >Chia sẻ
      </DefaultButton>
      <IconButton icon="mdi-dots-horizontal"></IconButton>
    </div>
  </div>
  <div class="board-canvas">
    <ol id="board">
      <li v-for="(column, columnIndex) in category" :key="column.ID" class="board-column">
        <div class="card-item">
          <!-- card header -->
          <div class="list-header">
            <p class="list-header-name">{{ column.type }}</p>
            <IconButton
              @click="showColumnDeleteDialog(columnIndex)"
              icon="mdi-dots-horizontal"
            ></IconButton>
          </div>
          <!-- card body -->
          <ol class="list-cards">
            <draggable
              class="list-group"
              :list="column.list"
              group="people"
              @change="onDragChange(columnIndex)"
              itemKey="id"
            >
              <template #item="{ element }">
                <div class="list-group-item">
                  <li>
                    <a @click="showCardDetail(element, column)">{{ element.header }}</a>
                    <IconButton
                      @click="showCardDeleteDialog(column, element)"
                      class="remove-icon"
                      icon="mdi-close"
                    >
                    </IconButton>
                  </li>
                </div>
              </template>
            </draggable>
          </ol>
          <!-- card footer -->
          <div class="list-footer">
            <div v-if="currentFormIndex === columnIndex" class="add-card-form__show">
              <v-textarea
                v-model="newCardName"
                rows="1"
                placeholder="Nhập tên cho thẻ này ..."
                variant="outlined"
                auto-grow
                shaped
                hide-details
              >
              </v-textarea>
              <div class="add-form-actions" style="padding: 4px">
                <DefaultButton @click="addCard(columnIndex)" textColor="white" buttonColor="blue"
                  >Thêm thẻ</DefaultButton
                >
                <IconButton @click="toggleAddForm(-1)" icon="mdi-close"></IconButton>
              </div>
            </div>

            <div v-else class="add-card-form__close">
              <DefaultButton
                @click="toggleAddForm(columnIndex)"
                prepend-icon="mdi-plus"
                buttonColor="cardColor"
                >Thêm thẻ
              </DefaultButton>
              <IconButton icon="mdi-content-copy"></IconButton>
            </div>
          </div>
        </div>
      </li>
      <!-- new column -->
      <li class="board-column">
        <div class="card-item" style="padding-bottom: 0">
          <div class="new-column">
            <!-- check if new column -->
            <div v-if="isNewColumn" class="new-column-close">
              <div class="list-footer">
                <div class="add-card-form__show">
                  <v-textarea
                    v-model="newColumnName"
                    rows="1"
                    placeholder="Nhập tiêu đề danh sách ..."
                    variant="outlined"
                    auto-grow
                    shaped
                    hide-details
                  ></v-textarea>
                  <div class="add-form-actions" style="padding: 4px 8px 12px">
                    <DefaultButton @click="addNewColumn" textColor="white" buttonColor="blue"
                      >Thêm danh sách
                    </DefaultButton>
                    <IconButton @click="toggleNewColumn" icon="mdi-close"></IconButton>
                  </div>
                </div>
              </div>
            </div>
            <!-- check else new column -->
            <div v-else class="new-column-open">
              <DefaultButton
                v-model="newColumnName"
                @click="toggleNewColumn"
                class="new-column-button"
                style="background-color: #7f7f7f; color: white"
                prepend-icon="mdi-plus"
                >Thêm danh sách khác
              </DefaultButton>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </div>
  <div>
    <CardDetail :cardDetail="selectedCard" :columnDetail="selectedColumn" ref="cardDetail" />
    <ConfirmDialog
      ref="deleteCardDialog"
      message="Bạn có chắc chắn muốn xoá thẻ đang chọn không?"
      @response="handleResponseDeleteCardDialog"
    />
    <ConfirmDialog
      ref="fakeDataDialog"
      message="Bạn có chắc chắn muốn tạo dữ liệu ảo không?
      Các dữ liệu hiện có sẽ bị mất"
      @response="handleResponseFakeDataDialog"
    />
    <ConfirmDialog
      ref="deleteColumnDialog"
      message="Bạn có chắc chắn muốn xoá danh sách đang chọn không?"
      @response="handleResponseDeleteColumnDialog"
    />
    <Toast ref="snackbar" />
  </div>
</template>

<script>
import DefaultButton from '@/components/button/DefaultButton.vue'
import IconButton from '@/components/button/IconButton.vue'
import draggable from 'vuedraggable'
import BaseIndexedDB from '@/indexedDB/GridConfigIndexedDB.js'
import CardDetail from './CardDetail.vue'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'HomePage',
  components: {
    DefaultButton,
    IconButton,
    draggable,
    CardDetail,
    ConfirmDialog: defineAsyncComponent(() => import('@/components/dialog/ConfirmDialog.vue')),
    Toast: defineAsyncComponent(() => import('@/components/toast/toast.vue'))
  },
  data() {
    return {
      category: [],
      currentFormIndex: -1,
      newCardName: '',
      isNewColumn: false,
      newColumnName: '',
      selectedCard: {
        header: '',
        createdAt: null,
        desc: '',
        activity: ''
      },
      selectedColumn: null,
      selectedIndexColumn: null
    }
  },
  methods: {
    //Bật, tắt form thêm card
    toggleAddForm(index) {
      if (this.currentFormIndex === index) {
        this.currentFormIndex = -1
      } else {
        this.currentFormIndex = index
      }
    },
    //Bật tắt thêm cột mới
    toggleNewColumn() {
      this.isNewColumn = !this.isNewColumn
    },
    //Hàm lấy dữ liệu từ indexedDB
    async loadData() {
      this.category = (await BaseIndexedDB.getAllData()) || []
    },
    //Hàm thêm dữ liêu vào indexedDB
    async addDataToDB(data) {
      await BaseIndexedDB.addData(data)
      this.loadData()
    },
    async deleteDataFromDB(key) {
      await BaseIndexedDB.deleteData(key)
      this.loadData()
    },
    //Hàm thêm card
    async addCard(columnIndex) {
      if (!this.newCardName.trim()) return

      try {
        const column = this.category[columnIndex]
        const newCard = { header: this.newCardName, createdAt: Date.now() }

        column.list.push(newCard)

        // Cập nhật cột trong IndexedDB
        this.addDataToDB(column)

        // Xóa dữ liệu trong trường nhập liệu sau khi thêm thẻ
        this.resetAddForm()
        this.triggerSnackbar('success', 'Thành công', 'Thêm thẻ mới thành công')
      } catch (error) {
        console.error('Failed to add card:', error)
      }
    },
    //Fake data
    async addFakeData() {
      await this.addDataToDB({
        ID: 1,
        type: 'Cần làm',
        list: [
          { header: 'Ngủ dậy', createdAt: Date.now() },
          { header: 'Ăn sáng', createdAt: Date.now() },
          { header: 'Tắm rửa', createdAt: Date.now() },
          { header: 'Đánh răng', createdAt: Date.now() }
        ]
      })
      await this.addDataToDB({
        ID: 2,
        type: 'Đã xong',
        list: [
          { header: 'Mặc quần áo', createdAt: Date.now() },
          { header: 'Đi học', createdAt: Date.now() },
          { header: 'Làm bài tập', createdAt: Date.now() }
        ]
      })
      await this.addDataToDB({
        ID: 3,
        type: 'Đang làm',
        list: [
          { header: 'Đi vệ sinh', createdAt: Date.now() },
          { header: 'Vệ sinh cá nhân', createdAt: Date.now() },
          { header: 'Rửa mặt', createdAt: Date.now() }
        ]
      })

      this.loadData()
    },
    //Hàm cập nhật indexedDB khi drag and drop card
    async onDragChange(columnIndex) {
      const column = this.category[columnIndex]

      try {
        await this.addDataToDB(column)
      } catch (error) {
        console.error('Failed to update column:', error)
      }
    },
    //handleResponseDeleteDialog
    handleResponseDeleteCardDialog(answer) {
      if (!answer) return
      this.handleDeleteCard(this.selectedColumn, this.selectedCard)
    },
    handleResponseDeleteColumnDialog(answer) {
      if (!answer) return
      this.handleDeleteColumn(this.selectedIndexColumn)
    },
    handleResponseFakeDataDialog(answer) {
      if (!answer) return
      this.addFakeData()
      this.triggerSnackbar('success', 'Thành công', 'Thêm dữ liệu ảo thành công')
    },

    //hiển thị dialog cảnh báo
    showCardDeleteDialog(column, card) {
      this.selectedCard = card
      this.selectedColumn = column
      this.$refs.deleteCardDialog.openDialog()
    },

    showColumnDeleteDialog(columnIndex) {
      this.selectedIndexColumn = columnIndex + 1
      this.$refs.deleteColumnDialog.openDialog()
    },

    showFakeDataDialog() {
      this.$refs.fakeDataDialog.openDialog()
    },

    //Hàm xóa thẻ
    handleDeleteCard(column, card) {
      const index = column.list.indexOf(card)
      if (index > -1) {
        column.list.splice(index, 1)
      }
      this.addDataToDB(column)
      this.triggerSnackbar('success', 'Thành công', 'Xoá thẻ thành công')
    },
    //Hàm xóa danh sách
    handleDeleteColumn(columnIndex) {
      this.deleteDataFromDB(columnIndex)
      this.triggerSnackbar('success', 'Thành công', 'Xoá danh sách thành công')
    },
    //Hàm reset add card form
    resetAddForm() {
      this.newCardName = ''
      this.toggleAddForm(-1)
    },
    //Hàm thêm danh sách mới
    addNewColumn() {
      //Tạo ID cột mới
      const countColumn = this.category.length
      const newColumnID = countColumn + 1
      if (!this.newColumnName.trim()) {
        return
      }
      const newColumn = { ID: newColumnID, type: this.newColumnName, list: [] }
      this.category.push(newColumn)
      this.addDataToDB(newColumn)
      this.toggleNewColumn()
      this.newColumnName = ''
      this.triggerSnackbar('success', 'Thành công', 'Thêm danh sách mới thành công')
    },
    //Hiển thị chi tiết thẻ
    showCardDetail(card, column) {
      this.selectedCard = card
      this.selectedColumn = column
      this.$refs.cardDetail.openDialog()
    },
    //Hàm gọi Toast
    triggerSnackbar(type, title, message) {
      this.$refs.snackbar.showSnackbar(type, title, message)
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style lang="scss">
.board-header {
  display: flex;
  width: 100%;
  height: 56px;
  justify-content: space-between;
  padding: 12px 10px 12px 16px;
  background: #ffffff3d;
}

.board-header-item {
  display: flex;
  align-items: center;

  .board-name-container {
    .btn-body {
      font-size: 18px !important;
      font-weight: bold !important;
    }
  }
}

.board-canvas {
  position: relative;
  width: 100%;
  height: calc(100% - 56px);
  margin-top: 12px;

  #board {
    display: flex;
    flex-direction: row;
    padding: 0 6px;
    list-style: none;
    bottom: 0;
    left: 0;
    margin-bottom: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    padding-top: 2px;
    position: absolute;
    right: 0;
    scrollbar-color: #fff6 #00000026;
    scrollbar-width: auto;
    top: -2px;
    -webkit-user-select: none;
    user-select: none;
    white-space: nowrap;
  }

  .board-column {
    display: block;
    flex-shrink: 0;
    align-self: flex-start;
    padding: 0 6px;
    height: 100%;
    white-space: nowrap;
    width: 272px;
  }

  .card-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 100%;
    padding-bottom: 8px;
    border-radius: 12px;
    background-color: var(--tr-background-list);
    box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
    color: var(--ds-text-subtle, #44546f);
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .list-header-name {
      padding: 6px 8px 6px 12px;
      color: var(--dynamic-text);
      font-size: 14px;
      font-weight: 600;
    }
  }

  .add-card-form__close {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
  }

  .list-cards {
    display: flex;
    z-index: 1;
    flex: 1 1 auto;
    flex-direction: column;
    height: 100%;
    margin: 0 4px;
    padding: 4px;
    overflow-x: hidden;
    overflow-y: auto;
    list-style: none;

    .list-group {
      display: flex;
      flex-direction: column;
      row-gap: 8px;
    }

    li {
      display: flex;
      align-items: center;
      position: relative;
      min-height: 36px;
      border-radius: 8px;
      background-color: var(--ds-surface-raised, #ffffff);
      box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
      color: var(--ds-text, #172b4d);
      cursor: pointer;
      scroll-margin: 8px;

      a {
        display: flex;
        width: 236px;
        height: 24px;
        padding-left: 12px;
      }
    }
  }
}

.add-card-form__show {
  .v-textarea {
    margin: 4px;
    padding: 0 4px;
    display: flex;
    flex-direction: column;

    .v-input__control {
      box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
      background-color: white;
      border-radius: 8px;
      cursor: pointer;

      .v-field__input {
        font-size: 14px;
      }
    }
  }
}

.remove-icon {
  visibility: hidden;
  border-radius: 50% !important;

  i {
    font-size: 14px !important;
  }
}

.list-group-item {
  li:hover {
    .remove-icon {
      visibility: visible;
    }
  }
}

.new-column-button {
  display: flex;
  justify-content: center;
  width: 260px;
  height: 44px !important;
  margin: 0 !important;
  border-radius: 12px !important;
}
</style>