<script setup lang="ts">
import { onMounted } from 'vue';
import { useTelemetryStore } from '@/stores/telemetry/telemetry.store';

import SpeedLineChart from '@/components/charts/speed/SpeedLineChart.vue';
import TyreTempCar from '@/components/telemetry/tires/TireTempCar.vue';

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
      <TyreTempCar
        class="mx-auto max-h-[200px] max-w-[200px]"
        :fl="telemetry.tyreSurfaceTemps.front_left"
        :fr="telemetry.tyreSurfaceTemps.front_right"
        :rl="telemetry.tyreSurfaceTemps.rear_left"
        :rr="telemetry.tyreSurfaceTemps.rear_right"
        :show-legend="false"
      />
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
