import { defineStore } from 'pinia';
import { ref } from 'vue';

const MAX_POINTS = 200; // ✅ limite d'historique

export const useTelemetryHistoryStore = defineStore('telemetryHistory', () => {
  // --- State ---
  const speed = ref<number[]>([]); // en km/h
  const throttle = ref<number[]>([]); // en % (0-1)
  const brake = ref<number[]>([]); // en % (0-1)
  const rpm = ref<number[]>([]); // en tours/minute
  const gear = ref<number[]>([]); // rapport engagé
  const tyreSurfaceTemps = ref<
    {
      front_left: number;
      front_right: number;
      rear_left: number;
      rear_right: number;
    }[]
  >([]); // Températures des pneus en surface

  // --- Actions ---
  const addEntry = (
    newSpeed: number,
    newThrottle: number,
    newBrake: number,
    newRpm: number,
    newGear: number,
    newTyreTemps: {
      front_left: number;
      front_right: number;
      rear_left: number;
      rear_right: number;
    },
  ) => {
    // ✅ Ajoute les nouvelles valeurs
    speed.value.push(newSpeed);
    throttle.value.push(newThrottle);
    brake.value.push(newBrake);
    rpm.value.push(newRpm);
    gear.value.push(newGear);
    tyreSurfaceTemps.value.push(newTyreTemps);

    // ✅ Supprime le plus ancien si on dépasse la limite
    if (speed.value.length > MAX_POINTS) {
      speed.value.shift();
      throttle.value.shift();
      brake.value.shift();
      rpm.value.shift();
      gear.value.shift();
      tyreSurfaceTemps.value.shift();
    }
  };

  const clearHistory = () => {
    speed.value = [];
    throttle.value = [];
    brake.value = [];
    rpm.value = [];
    gear.value = [];
    tyreSurfaceTemps.value = [];
  };

  return {
    speed,
    throttle,
    brake,
    rpm,
    gear,
    tyreSurfaceTemps,
    addEntry,
    clearHistory,
  };
});
