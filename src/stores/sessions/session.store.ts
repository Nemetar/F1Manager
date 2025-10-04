import { defineStore } from 'pinia';
import { ref } from 'vue';
import { listen } from '@tauri-apps/api/event';

type SessionEvent = {
  track: number;
  track_length: number;
  total_laps?: number;
  weather?: number;
  track_temperature?: number;
  air_temperature?: number;
};

export const useSessionStore = defineStore('session', () => {
  // --- State ---
  const trackId = ref<number | null>(null);
  const trackLength = ref<number>(0);
  const totalLaps = ref<number | null>(null);
  const weather = ref<number | null>(null);
  const trackTemperature = ref<number | null>(null);
  const airTemperature = ref<number | null>(null);

  // --- Actions ---
  const startListening = async () => {
    await listen<SessionEvent>('telemetry:session', (event) => {
      const {
        track,
        track_length,
        total_laps,
        weather: w,
        track_temperature,
        air_temperature,
      } = event.payload;

      trackId.value = track;
      trackLength.value = track_length;
      totalLaps.value = total_laps ?? null;
      weather.value = w ?? null;
      trackTemperature.value = track_temperature ?? null;
      airTemperature.value = air_temperature ?? null;
    });
  };

  return {
    trackId,
    trackLength,
    totalLaps,
    weather,
    trackTemperature,
    airTemperature,

    startListening,
  };
});
