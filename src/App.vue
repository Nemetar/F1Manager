<script setup lang="ts">
import MainLayout from '@/components/layouts/MainLayout.vue';
import TelemetryPanel from '@/components/telemetry/TelemetryPanel.vue';
import TrackMap from '@/components/maps/TrackMap.vue';
</script>

<template>
  <MainLayout>
    <!-- Données voiture -->
    <template #left>
      <TelemetryPanel />
    </template>

    <!-- Carte du circuit -->
    <template #center>
      <div class="flex h-full items-center justify-center overflow-hidden">
        <div class="bg-base-300 h-full w-full overflow-hidden rounded-sm">
          <div class="h-full w-full p-2 sm:p-4">
            <TrackMap />
          </div>
        </div>
      </div>
    </template>

    <!-- Chat ingénieur -->
    <template #right>
      <div class="space-y-2 sm:space-y-3">
        <div class="chat chat-start">
          <div class="chat-bubble max-w-full text-xs break-words sm:text-sm">
            Tu freines trop tard au virage 3 !
          </div>
        </div>
        <div class="chat chat-end">
          <div class="chat-bubble chat-bubble-primary max-w-full text-xs break-words sm:text-sm">
            Reçu, je corrige au prochain tour.
          </div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>
