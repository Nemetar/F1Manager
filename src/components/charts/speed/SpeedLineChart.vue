<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import uPlot, { Options } from 'uplot';
import { useTelemetryHistoryStore } from '@/stores/telemetry/telemetryHistory.store';

const telemetryHistory = useTelemetryHistoryStore();
const chartEl = ref<HTMLDivElement | null>(null);

let chart: uPlot | null = null;
let interval: number | null = null;
let resizeObserver: ResizeObserver | null = null; // ✅ ajout

onMounted(() => {
  const options: Options = {
    width: chartEl.value?.clientWidth || 300,
    height: 150,
    padding: [8, 8, 0, 0], // ✅ supprime l'espace pour les axes
    series: [
      {}, // axe X
      {
        stroke: 'rgb(34, 197, 94)', // green-500
        width: 2,
        fill: 'rgba(34, 197, 94, 0.1)', // ✅ remplissage léger
      },
      {
        stroke: 'rgb(239, 68, 68)', // red-500
        width: 2,
        fill: 'rgba(239, 68, 68, 0.1)',
      },
    ],
    scales: {
      x: { time: false }, // ✅ pas de formatage temporel
      y: { range: [0, 1] }, // ✅ plage fixe pour la stabilité
    },
    axes: [
      { show: false }, // ✅ cache l'axe X
      { show: false }, // ✅ cache l'axe Y
    ],
    legend: { show: false },
    cursor: { show: false },
  };

  chart = new uPlot(options, [[], [], []], chartEl.value!);

  interval = window.setInterval(() => {
    const xData = telemetryHistory.speed.map((_, i) => i);
    const speedData = telemetryHistory.throttle;
    const brakeData = telemetryHistory.brake;
    chart?.setData([xData, speedData, brakeData]);
  }, 10);

  resizeObserver = new ResizeObserver(() => {
    if (chart && chartEl.value) {
      chart.setSize({
        width: chartEl.value.clientWidth,
        height: 150,
      });
    }
  });

  if (chartEl.value) resizeObserver.observe(chartEl.value);
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
  if (resizeObserver) resizeObserver.disconnect(); // ✅ nettoyage
  chart?.destroy();
});
</script>

<template>
  <div ref="chartEl" class="bg-base-200 h-[150px] w-full overflow-hidden rounded-lg"></div>
</template>
