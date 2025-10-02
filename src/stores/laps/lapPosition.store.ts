import { defineStore } from 'pinia';
import { ref } from 'vue';
import { listen } from '@tauri-apps/api/event';

type LapEvent = {
  lap_distance: number;
  track_length: number;
  track_id?: number; // optionnel : pour charger le bon circuit
};

export const useLapPositionStore = defineStore('lapPosition', () => {
  // --- State ---
  const lapDistance = ref(0); // en mètres
  const trackLength = ref(1); // en mètres (éviter div/0)
  const trackId = ref<number | null>(null); // identifiant du circuit

  // --- Getters ---
  const progress = () => {
    return trackLength.value > 0 ? lapDistance.value / trackLength.value : 0;
  };

  // --- Actions ---
  async function startListening() {
    await listen<LapEvent>('telemetry:lap', (event) => {
      const { lap_distance, track_length, track_id } = event.payload;
      lapDistance.value = lap_distance;
      trackLength.value = track_length;
      if (track_id !== undefined) {
        trackId.value = track_id;
      }
    });
  }

  return {
    lapDistance,
    trackLength,
    trackId,
    progress,

    startListening,
  };
});
