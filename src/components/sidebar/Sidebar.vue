<template>
  <v-card id="root">
    <v-layout>
      <div class="sidebar-wrapper" :style="{ width: rail ? '16px' : '260px' }">
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false"
          :style="{ width: rail ? '16px' : '260px' }" class="custom-navigation">
          <v-list>
            <v-list-item class="nav-header-item-bold" prepend-icon="mdi-printer"
              title="không gian làm việc của Nguyễn Trường Toàn" subtitle="Miễn phí" nav>
              <template v-if="!rail" v-slot:append>
                <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
              </template>
              <template v-else v-slot:append>
                <v-btn class="btn-expand-sidebar" icon="mdi-chevron-right" variant="text"
                  @click.stop="rail = !rail"></v-btn>
              </template>
            </v-list-item>
          </v-list>


          <v-list density="compact" nav>
            <router-link class="link" to="/">
              <v-list-item prepend-icon="mdi-table" title="Bảng" value="overview"></v-list-item>
            </router-link>

            <router-link class="link" to="/member">
              <v-list-item prepend-icon="mdi-account-outline" title="Thành viên" value="device"
                append-icon="mdi-plus"></v-list-item>
            </router-link>

            <router-link class="link" to="/">
              <v-list-item class="nav-header-item-semi" prepend-icon="mdi-cog-outline"
                title="Các cài đặt không gian làm việc" append-icon="mdi-chevron-down" value="payment"></v-list-item>
            </router-link>

            <v-list-item class="nav-header-item-bold">Dạng xem không gian làm việc</v-list-item>

            <router-link class="link" to="/">
              <v-list-item prepend-icon="mdi-table-column" title="Bảng" value="table"></v-list-item>
            </router-link>

            <router-link class="link" to="/">
              <v-list-item prepend-icon="mdi-calendar-month-outline" title="Lịch" value="calender"></v-list-item>
            </router-link>

            <v-list-item class="nav-header-item-bold" append-icon="mdi-plus">Các bảng của bạn</v-list-item>

            <router-link class="link" to="/">
              <v-list-item prepend-icon="mdi-home-outline" title="test1" value="system"></v-list-item>
            </router-link>
          </v-list>
        </v-navigation-drawer>
      </div>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      rail: true,
    };
  },
  name: "Sidebar",
};
</script>

<style lang="scss">
#root {
  .custom-navigation {
    min-width: 16px;
    max-width: 260px;
    background-color: var(--dynamic-background-transparent);
    border-right: 0;
    height: calc(100% - 50px) !important;
    top: 50px !important;
    border-right: 1px solid var(--dynamic-text-transparent);
  }

  .v-navigation-drawer__content {
    overflow-y: hidden;
  }

  .v-list--one-line a {
    text-decoration: none;
    color: white;
  }

  .v-list-item {
    padding-right: 0;

    .v-list-item-title {
      font-weight: 400;
    }

    .v-list-item__append {
      width: 21px;
    }
  }

  .nav-header-item-bold {
    padding: 0 4px;
    margin-bottom: 0;

    .v-list-item__content {
      color: var(--dynamic-text);
      font-weight: 700;
    }

    .v-list-item-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--dynamic-text);
    }
  }

  .nav-header-item-semi {
    .v-list-item__content {
      width: 172px;
    }

    .v-list-item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--dynamic-text);
    }
  }

  .v-list-item--density-default {
    color: white;
    cursor: pointer;
    padding: 8px 14px !important;
    border-bottom: 1px solid #cecece;
    padding-top: 0 !important;

    .v-list-item__content {
      width: 160px;

      .v-list-item-title {
        height: 100%;
        word-break: break-word;
        white-space: pre-wrap;
        line-height: 20px;
      }

      .v-list-item-subtitle {
        color: var(--dynamic-text);
        opacity: unset;
      }
    }

    .v-list-item__prepend {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      color: var(--dynamic-text)
    }

    .v-list-item__append {
      color: var(--dynamic-text);
      opacity: 0.6;
    }
  }

  .v-list-item--link {
    color: var(--dynamic-text);

    .v-list-item__prepend {
      width: 16px;
      height: 16px;
      margin-right: 12px;

      i {
        opacity: 0.7 !important;
      }

    }

    .v-list-item-title {
      height: 100%;
      word-break: break-word;
      white-space: pre-wrap;
      line-height: 20px;
    }
  }

  .btn-expand-sidebar {
    position: fixed;
    left: 10px;
    z-index: 99999;

    .v-btn__content {
      border-radius: 50%;
      border: 1px solid #cecece;
      background-color: white
    }
  }
}
</style>