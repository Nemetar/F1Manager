<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 320 640"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Car top view with tire temperatures"
    class="block h-auto max-w-full"
  >
    <!-- Car body -->
    <defs>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.25" />
      </filter>
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b3f46" />
        <stop offset="100%" stop-color="#2a2e34" />
      </linearGradient>
    </defs>

    <g filter="url(#softShadow)">
      <!-- Châssis -->
      <rect
        x="60"
        y="40"
        width="200"
        height="560"
        rx="28"
        fill="url(#bodyGrad)"
        stroke="#111"
        stroke-width="2"
      />
      <!-- Pare-brise / lunette -->
      <rect x="84" y="60" width="152" height="90" rx="12" fill="#1a1f25" />
      <rect x="84" y="490" width="152" height="90" rx="12" fill="#1a1f25" />
      <!-- Capot / coffre (juste pour le relief) -->
      <rect x="72" y="170" width="176" height="120" rx="16" fill="#2e333a" />
      <rect x="72" y="350" width="176" height="120" rx="16" fill="#2e333a" />
      <!-- Liserés -->
      <line
        x1="160"
        y1="40"
        x2="160"
        y2="600"
        stroke="#444"
        stroke-width="2"
        stroke-dasharray="6 10"
      />
    </g>

    <!-- Pneus (rectangles arrondis) -->
    <!-- FL: Front Left -->
    <g>
      <rect
        :fill="flColor"
        x="16"
        y="120"
        rx="12"
        width="40"
        height="100"
        stroke="#0b0b0b"
        stroke-width="2"
      />
      <g v-if="showLegend">
        <text x="36" y="235" text-anchor="middle" fill="#aaa" font-size="14">FL</text>
        <text x="36" y="254" text-anchor="middle" :fill="flColor" font-size="12">{{ fl }}°C</text>
      </g>
    </g>

    <!-- FR: Front Right -->
    <g>
      <rect
        :fill="frColor"
        x="264"
        y="120"
        rx="12"
        width="40"
        height="100"
        stroke="#0b0b0b"
        stroke-width="2"
      />
      <g v-if="showLegend">
        <text x="284" y="235" text-anchor="middle" fill="#aaa" font-size="14">FR</text>
        <text x="284" y="254" text-anchor="middle" :fill="frColor" font-size="12">{{ fr }}°C</text>
      </g>
    </g>

    <!-- RL: Rear Left -->
    <g>
      <rect
        :fill="rlColor"
        x="16"
        y="420"
        rx="12"
        width="40"
        height="100"
        stroke="#0b0b0b"
        stroke-width="2"
      />
      <g v-if="showLegend">
        <text x="36" y="535" text-anchor="middle" fill="#aaa" font-size="14">RL</text>
        <text x="36" y="554" text-anchor="middle" :fill="rlColor" font-size="12">{{ rl }}°C</text>
      </g>
    </g>

    <!-- RR: Rear Right -->
    <g>
      <rect
        :fill="rrColor"
        x="264"
        y="420"
        rx="12"
        width="40"
        height="100"
        stroke="#0b0b0b"
        stroke-width="2"
      />
      <g v-if="showLegend">
        <text x="284" y="535" text-anchor="middle" fill="#aaa" font-size="14">RR</text>
        <text x="284" y="554" text-anchor="middle" :fill="rrColor" font-size="12">{{ rr }}°C</text>
      </g>
    </g>

    <!-- Légende (optionnelle, compacte) -->
    <g transform="translate(80, 610)" v-if="showLegend">
      <rect x="-8" y="-14" width="248" height="24" rx="10" fill="#121418" opacity="0.8" />
      <circle cx="0" r="6" fill="#2997ff" />
      <text x="10" y="4" fill="#9aa4af" font-size="12">Froid</text>
      <circle cx="70" r="6" fill="#22c55e" />
      <text x="80" y="4" fill="#9aa4af" font-size="12">OK</text>
      <circle cx="120" r="6" fill="#8b5cf6" />
      <text x="130" y="4" fill="#9aa4af" font-size="12">Chaud</text>
      <circle cx="180" r="6" fill="#ef4444" />
      <text x="190" y="4" fill="#9aa4af" font-size="12">Très chaud</text>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Props = {
  fl: number;
  fr: number;
  rl: number;
  rr: number; // températures en °C
  width?: number | string; // dimensions optionnelles
  height?: number | string;
  // bornes de classement (tu peux ajuster selon ton modèle de pneus)
  coldMax?: number; // ≤ coldMax => bleu
  okMin?: number; // ≥ okMin && ≤ okMax => vert
  okMax?: number;
  hotMin?: number; // > okMax && < veryHotMin => violet
  veryHotMin?: number; // ≥ veryHotMin => rouge
  showLegend?: boolean; // afficher la légende en bas
};

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: 'auto',
  coldMax: 60,
  okMin: 70,
  okMax: 95,
  hotMin: 96,
  veryHotMin: 105,
  showLegend: true,
});

/** Mapping discret simple → renvoie la couleur hex. */
function tempToColor(t: number) {
  if (t <= props.coldMax) return '#2997ff'; // bleu
  if (t >= props.okMin && t <= props.okMax) return '#22c55e'; // vert
  if (t >= props.veryHotMin) return '#ef4444'; // rouge
  return '#8b5cf6'; // violet (chaud mais pas critique)
}

const flColor = computed(() => tempToColor(props.fl));
const frColor = computed(() => tempToColor(props.fr));
const rlColor = computed(() => tempToColor(props.rl));
const rrColor = computed(() => tempToColor(props.rr));

const width = computed(() => props.width);
const height = computed(() => props.height);
</script>
