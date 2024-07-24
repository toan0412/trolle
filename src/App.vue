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
.header-container {
  padding: 4px;
}
</style>
