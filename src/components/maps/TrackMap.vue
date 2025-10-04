<script setup lang="ts">
import AustriaMinimap from '../minimaps/AustriaMinimap.vue';

import type { Component } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useLapPositionStore } from '@/stores/laps/lapPosition.store';
import { useSessionStore } from '@/stores/sessions/session.store';

const lapPositionStore = useLapPositionStore();
const sessionStore = useSessionStore();

onMounted(() => {
  sessionStore.startListening();
  lapPositionStore.startListening();
});

const trackPath = ref<SVGPathElement | null>(null);
const trackPathLength = ref(0);

const onTrackReady = ({ path, length }: { path: SVGPathElement; length: number }) => {
  trackPath.value = path;
  trackPathLength.value = length;
};

const playerPosition = computed(() => {
  if (!trackPath.value || trackPathLength.value <= 0 || !sessionStore.trackLength) {
    return null;
  }

  const progression = lapPositionStore.lapDistance / sessionStore.trackLength;

  return trackPath.value.getPointAtLength(trackPathLength.value * progression);
});

const TrackMapComponent = computed<Component | null>(() => {
  const trackComponents: Record<number, Component> = {
    17: AustriaMinimap,
  };
  return sessionStore.trackId ? (trackComponents[sessionStore.trackId] ?? null) : null;
});
</script>

<template>
  <div class="flex h-full w-full items-center justify-center overflow-hidden">
    <component :is="TrackMapComponent" @ready="onTrackReady">
      <template #playerPosition>
        <circle
          v-if="playerPosition"
          :cx="playerPosition.x"
          :cy="playerPosition.y"
          r="8"
          fill="red"
        />
      </template>
    </component>
  </div>
</template>
