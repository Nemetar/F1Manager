<script setup lang="ts">
import { useTrackPath } from '@/composables/trackPath.composable';

const emit = defineEmits<{
  (event: 'ready', payload: { path: SVGPathElement; length: number }): void;
}>();

const { trackPath } = useTrackPath(emit);
</script>

<template>
  <svg version="1.1" id="svg1" viewBox="0 0 682.66669 682.66669" xmlns="http://www.w3.org/2000/svg">
    <path
      ref="trackPath"
      d="m 415.99093,506.62583 -170.81192,49.6749 -22.36822,-28.17816 -69.42866,-102.25476 -45.02695,-90.0539 -75.819576,-74.36709 4.647943,-6.39093 30.792625,-4.64794 59.261278,0.58099 110.38866,18.01078 42.99347,3.48596 59.26128,1.74298 7.55291,6.97192 -1.74298,11.03886 -13.94383,22.07773 -29.63064,17.42979 -27.30667,3.48596 -77.27206,-10.45787 -15.10581,5.22893 -11.03887,17.42979 -1.16198,16.2678 41.25049,67.39518 21.49674,4.64794 18.59178,-8.1339 23.82071,-29.63064 33.11659,-9.87688 186.49873,-6.97191 11.03887,9.29589 22.78484,68.80938 -22.47869,18.54004 -90.36662,28.80536"
      fill="none"
      stroke="white"
      stroke-width="5"
    />

    <slot name="playerPosition"></slot>
  </svg>
</template>
