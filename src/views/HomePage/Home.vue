<template>
  <div class="board-header">
    <div class="board-header-item">
      <DefaultButton class="board-name-container">test</DefaultButton>
      <IconButton icon="mdi-star-outline"></IconButton>
      <DefaultButton prepend-icon="mdi-lock-outline">Riêng tư</DefaultButton>
      <DefaultButton textColor="white" buttonColor="brown" prepend-icon="mdi-chart-box-outline">Bảng</DefaultButton>
      <IconButton icon="mdi-chevron-down"></IconButton>
    </div>
    <div class="board-header-item">
      <DefaultButton prepend-icon="mdi-rocket-launch-outline">Tiện ích bổ sung</DefaultButton>
      <DefaultButton prepend-icon="mdi-flash-outline">Tự động hóa</DefaultButton>
      <DefaultButton prepend-icon="mdi-filter-variant">Bộ lọc</DefaultButton>
      <DefaultButton textColor="white" buttonColor="brown" prepend-icon="mdi-account-plus-outline">Chia sẻ</DefaultButton>
      <IconButton icon="mdi-dots-horizontal"></IconButton>
    </div>
  </div>
  <div class="board-canvas">
    <ol id="board">
      <li v-for="(column, columnIndex) in columns" :key="columnIndex" class="board-column">
        <div class="card-item">
          <div class="list-header">
            <p class="list-header-name">{{ column.name }}</p>
            <IconButton icon="mdi-dots-horizontal"></IconButton>
          </div>
          <ol class="list-cards">
            <draggable class="list-group" :list="column.list" group="people" @change="log" itemKey="name">
              <template #item="{ element, index }">
                <div class="list-group-item">
                  <li>
                    <a>{{ element.name }}</a>
                  </li>
                </div>
              </template>
            </draggable>
          </ol>
          <div class="list-footer">
            <DefaultButton prepend-icon="mdi-plus" buttonColor="cardColor">Thêm thẻ</DefaultButton>
            <IconButton icon="mdi-content-copy"></IconButton>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import { ref } from 'vue';
import DefaultButton from '@/components/button/DefaultButton.vue';
import IconButton from '@/components/button/IconButton.vue';
import draggable from 'vuedraggable';

export default {
  name: 'HomePage',
  components: {
    DefaultButton,
    IconButton,
    draggable
  },
  data() {
    return {
      columns: [
        {
          name: 'Cần làm',
          list: [
            { name: 'Ngủ dậy', id: 1 },
            { name: 'Ăn sáng', id: 2 },
            { name: 'Tắm rửa', id: 3 },
            { name: 'Đánh răng', id: 4 }
          ]
        },
        {
          name: 'Đang làm',
          list: [
            { name: 'Mặc quần áo', id: 5 },
            { name: 'Đi học', id: 6 },
            { name: 'Làm bài tập', id: 7 }
          ]
        },
        {
          name: 'Đã xong',
          list: [
            { name: 'Đi vệ sinh', id: 8 },
            { name: 'Vệ sinh cá nhân', id: 9 },
            { name: 'Rửa mặt', id: 10 }
          ]
        }]
    }
  },
  methods: {
    add() {
      this.columns[0].list.push({ name: 'Juan', id: new Date().getTime() });
    },
    replace() {
      this.columns[0].list = [{ name: 'Edgard', id: new Date().getTime() }];
    },
    clone(el) {
      return {
        name: el.name + ' cloned',
        id: new Date().getTime()
      };
    },
    log(evt) {
      window.console.log(evt);
    }
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

  .list-footer {
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
        padding: 8px 4px 0 12px;
      }
    }
  }
}
</style>