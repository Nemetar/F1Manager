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
      <div class="stat-title">Vitesse</div>
      <div class="stat-value text-primary">{{ telemetry.speed }} km/h</div>
    </div>

    <!-- RPM + Gear -->
    <div class="stat">
      <div class="stat-title">Régime moteur</div>
      <div class="stat-value text-secondary">{{ telemetry.rpm }} rpm</div>
    </div>

    <div class="stat">
      <div class="stat-title">Rapport</div>
      <div class="stat-value">#{{ telemetry.gear }}</div>
    </div>

    <!-- Pneus -->
    <div class="stat">
      <div class="stat-title">Température des pneus</div>
      <div class="grid grid-cols-2 gap-2 text-xl font-bold">
        <div>FL: {{ telemetry.tyreSurfaceTemps.front_left }} °C</div>
        <div>FR: {{ telemetry.tyreSurfaceTemps.front_right }} °C</div>
        <div>RL: {{ telemetry.tyreSurfaceTemps.rear_left }} °C</div>
        <div>RR: {{ telemetry.tyreSurfaceTemps.rear_right }} °C</div>
      </div>
    </div>

    <!-- Graphique vitesse + freinage -->
    <div class="stat">
      <div class="stat-title">Throttle & Brake</div>
      <div class="stat-value min-w-0">
        <SpeedLineChart />
      </div>
    </div>
  </div>
</template>
