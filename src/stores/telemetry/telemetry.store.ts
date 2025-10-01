import { ref } from 'vue';
import { defineStore } from 'pinia';
import { listen } from '@tauri-apps/api/event';
import { useTelemetryHistoryStore } from './telemetryHistory.store';

export const useTelemetryStore = defineStore('telemetry', () => {
  // --- State ---
  const speed = ref<number>(0); // en km/h
  const throttle = ref<number>(0); // en % (0-1)
  const brake = ref<number>(0); // en % (0-1)
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
    const telemetryHistory = useTelemetryHistoryStore();
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
      brake: number;
      throttle: number;
    }>('telemetry:update', (event) => {
      const {
        speed: newSpeed,
        engine_rpm: newRpm,
        gear: newGear,
        tyre_surface_temps: newTyreTemps,
        brake: newBrake,
        throttle: newThrottle,
      } = event.payload;

      // --- valeurs actuelles
      speed.value = newSpeed;
      rpm.value = newRpm;
      gear.value = newGear;
      tyreSurfaceTemps.value = newTyreTemps;
      brake.value = newBrake;
      throttle.value = newThrottle;

      // --- ajouter à l'historique
      telemetryHistory.addEntry(newSpeed, newThrottle, newBrake, newRpm, newGear, newTyreTemps);
    });
  }

  return {
    speed,
    brake,
    rpm,
    gear,
    tyreSurfaceTemps,

    startListening,
  };
});
