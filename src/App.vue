<script setup lang="ts">
import MainLayout from './components/layouts/MainLayout.vue';
</script>

<template>
  <MainLayout>
    <template #left>
      <h1 class="text-2xl font-bold">Left Sidebar</h1>
      <p>This is the left sidebar content.</p>
    </template>

    <template #center>
      <h1 class="text-2xl font-bold">Main Content</h1>
      <p>This is the main content area.</p>
    </template>

    <template #right>
      <h1 class="text-2xl font-bold">Right Sidebar</h1>
      <p>This is the right sidebar content.</p>
    </template>
  </MainLayout>
</template>
