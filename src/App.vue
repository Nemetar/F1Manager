<script setup lang="ts">
import { ref, onMounted } from 'vue';

const speed = ref<number | null>(null);

onMounted(() => {
  window.telemetry?.onSpeed((s: number) => {
    speed.value = s;
  });
});
</script>

<template>
  <div class="bg-base-200 flex h-screen flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">🏎️ F1 Telemetry</h1>
    <p v-if="speed !== null" class="mt-4 text-2xl">
      Speed: <span class="text-primary">{{ speed }} km/h</span>
    </p>
    <p v-else class="mt-4">Waiting for data...</p>
  </div>
</template>
