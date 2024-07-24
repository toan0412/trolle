<script setup>
import "@/assets/base.css"
import Header from '@/components/header/Header.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
</script>

<template>
  <div class="container">
    <div class="header-container">
      <Header />
    </div>
    <div class="main-container">
      <div class="sidebar-container">
        <Sidebar />
      </div>
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
}

.header-container {
  height: 48px;
  padding: 4px;
}

.main-container {
  display: flex;
  height: calc(100vh - 48px)
}

.content-container {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
