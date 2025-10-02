import { listen } from '@tauri-apps/api/event';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type CarMotionData = {
  world_position_x: number;
  world_position_y: number;
  world_position_z: number;
};

export const useMotionStore = defineStore('motion', () => {
  // --- State ---
  const position = ref<CarMotionData>({
    world_position_x: 0,
    world_position_y: 0,
    world_position_z: 0,
  });

  // --- Actions ---
  const startListening = async () => {
    await listen<CarMotionData>('telemetry:motion', (event) => {
      position.value = event.payload;
    });
  };

  return {
    position,
    startListening,
  };
});
