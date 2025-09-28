<template>
  <div class="relative">
    <div
      class="max-w-md mx-auto rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-900/30 border border-white/10 px-10 py-12 text-center"
    >
      <p class="uppercase tracking-[0.35em] text-xs text-indigo-300 mb-6">Live Speed</p>
      <transition name="speed-change" mode="out-in">
        <p
          :key="displaySpeed"
          class="text-7xl md:text-8xl font-semibold text-white drop-shadow-[0_20px_30px_rgba(79,70,229,0.45)]"
        >
          <span>{{ displaySpeed }}</span>
          <span class="ml-2 text-2xl text-indigo-200">km/h</span>
        </p>
      </transition>
      <div class="mt-8 flex items-center justify-center space-x-2 text-sm text-indigo-200/80">
        <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Telemetry streaming from F1 25</span>
      </div>
    </div>
    <div class="absolute -inset-6 -z-10 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-sky-500/40 blur-3xl opacity-60"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const speed = ref<number | null>(null);

const formatSpeed = (value: number | null) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value).toString().padStart(3, '0');
  }
  return '---';
};

const displaySpeed = ref(formatSpeed(speed.value));

let unsubscribe: (() => void) | undefined;

onMounted(() => {
  if (window.electronAPI?.onSpeedUpdate) {
    unsubscribe = window.electronAPI.onSpeedUpdate((incomingSpeed) => {
      speed.value = incomingSpeed;
      displaySpeed.value = formatSpeed(incomingSpeed);
    });
  }
});

onBeforeUnmount(() => {
  unsubscribe?.();
});
</script>

<style scoped>
.speed-change-enter-active,
.speed-change-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.speed-change-enter-from,
.speed-change-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
