<script setup lang="ts">
import { onMounted } from 'vue';
import { useTelemetryStore } from '@/stores/telemetry/telemetry.store';
import SpeedLineChart from '@/components/charts/speed/SpeedLineChart.vue';

const telemetry = useTelemetryStore();

onMounted(() => {
  telemetry.startListening();
});
</script>

<template>
  <div class="stats stats-vertical w-full">
    <!-- Vitesse -->
    <div class="stat">
      <div class="stat-title text-xs sm:text-sm">Vitesse</div>
      <div class="stat-value text-primary text-lg sm:text-xl md:text-2xl">
        {{ telemetry.speed }} km/h
      </div>
    </div>

    <!-- RPM + Gear -->
    <div class="stat">
      <div class="stat-title text-xs sm:text-sm">Régime moteur</div>
      <div class="stat-value text-secondary text-lg sm:text-xl md:text-2xl">
        {{ telemetry.rpm }} rpm
      </div>
    </div>

    <div class="stat">
      <div class="stat-title text-xs sm:text-sm">Rapport</div>
      <div class="stat-value text-lg sm:text-xl md:text-2xl">#{{ telemetry.gear }}</div>
    </div>

    <!-- Pneus -->
    <div class="stat">
      <div class="stat-title text-xs sm:text-sm">Température des pneus</div>
      <div class="grid grid-cols-2 gap-1 text-sm font-bold sm:gap-2 sm:text-base md:text-lg">
        <div class="truncate">FL: {{ telemetry.tyreSurfaceTemps.front_left }}°C</div>
        <div class="truncate">FR: {{ telemetry.tyreSurfaceTemps.front_right }}°C</div>
        <div class="truncate">RL: {{ telemetry.tyreSurfaceTemps.rear_left }}°C</div>
        <div class="truncate">RR: {{ telemetry.tyreSurfaceTemps.rear_right }}°C</div>
      </div>
    </div>

    <!-- Graphique vitesse + freinage -->
    <div class="stat">
      <div class="stat-title text-xs sm:text-sm">Throttle & Brake</div>
      <div class="stat-value min-w-0 overflow-hidden">
        <SpeedLineChart />
      </div>
    </div>
  </div>
</template>
