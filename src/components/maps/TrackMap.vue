<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useLapPositionStore } from '@/stores/laps/lapPosition.store';
import { useSessionStore } from '@/stores/sessions/session.store';

// SVG du circuit
import AustriaMinimap from '@/components/minimaps/AustriaMinimap.vue';

const lapStore = useLapPositionStore();
const sessionStore = useSessionStore();

const playerPos = ref({ x: 0, y: 0 });

let path: SVGPathElement | null = null;
let pathLength = 0;

onMounted(() => {
  lapStore.startListening();
  sessionStore.startListening();

  path = document.querySelector('#trackPath') as SVGPathElement;
  if (path) {
    pathLength = path.getTotalLength();
    console.log('SVG path length (pixels):', pathLength);
  }
});

watch(
  () => lapStore.lapDistance,
  (lapDistance) => {
    if (!path || pathLength === 0) return;
    if (!sessionStore.trackLength || sessionStore.trackLength <= 0) return;
    if (!lapDistance || lapDistance < 0) return;

    const ratio = lapDistance / sessionStore.trackLength;
    const distanceOnPath = (pathLength - ratio * pathLength) % pathLength;

    const point = path.getPointAtLength(distanceOnPath);
    playerPos.value = { x: point.x, y: point.y };
  },
);

watch(
  () => lapStore.lapDistance,
  (lapDistance) => {
    console.log(
      'lapDistance',
      lapDistance,
      'trackLength',
      sessionStore.trackLength,
      'progress %',
      (lapDistance / sessionStore.trackLength) * 100,
    );
  },
);
</script>

<template>
  <div class="relative h-[400px] w-[400px]">
    <!-- Circuit -->
    <AustriaMinimap />

    <!-- Joueur -->
    <svg
      viewBox="0 0 682.66669 682.66669"
      class="pointer-events-none absolute inset-0 h-full w-full"
    >
      <circle :cx="playerPos.x" :cy="playerPos.y" r="6" fill="red" />
    </svg>
  </div>
</template>
