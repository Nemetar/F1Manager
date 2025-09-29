import { ref } from 'vue';
import { defineStore } from 'pinia';
import { listen } from '@tauri-apps/api/event';

export const useTelemetryStore = defineStore('telemetry', () => {
  // --- State ---
  const speed = ref<number>(0); // en km/h
  const rpm = ref<number>(0); // en tours/minute
  const gear = ref<number>(0); // rapport engagé
  const tyreSurfaceTemps = ref({
    front_left: 0,
    front_right: 0,
    rear_left: 0,
    rear_right: 0,
  }); // Températures des pneus en surface

  // --- Actions ---
  async function startListening() {
    await listen<{
      speed: number;
      engine_rpm: number;
      gear: number;
      tyre_surface_temps: {
        front_left: number;
        front_right: number;
        rear_left: number;
        rear_right: number;
      };
    }>('telemetry:update', (event) => {
      const {
        speed: newSpeed,
        engine_rpm: newRpm,
        gear: newGear,
        tyre_surface_temps: newTyreTemps,
      } = event.payload;

      console.log('event.payload', event.payload);

      speed.value = newSpeed;
      rpm.value = newRpm;
      gear.value = newGear;
      tyreSurfaceTemps.value = newTyreTemps;
    });
  }

  return {
    speed,
    rpm,
    gear,
    tyreSurfaceTemps,
    startListening,
  };
});
