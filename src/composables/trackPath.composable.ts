import { ref, onMounted } from 'vue';

export function useTrackPath(
  emit: (event: 'ready', payload: { path: SVGPathElement; length: number }) => void,
) {
  const trackPath = ref<SVGPathElement | null>(null);

  onMounted(() => {
    if (trackPath.value) {
      emit('ready', {
        path: trackPath.value,
        length: trackPath.value.getTotalLength(),
      });
    }
  });

  return { trackPath };
}
