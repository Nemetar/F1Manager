<script setup lang="ts">
import MainLayout from '@/components/layouts/MainLayout.vue';
import TelemetryPanel from '@/components/telemetry/TelemetryPanel.vue';
</script>

<template>
  <MainLayout>
    <!-- Données voiture -->
    <template #left>
      <TelemetryPanel />
    </template>

    <!-- Carte du circuit -->
    <template #center>
      <div class="flex h-full items-center justify-center">
        <div class="mockup-window bg-base-300 h-full w-full">
          <div class="p-4">Track Map (position en temps réel ici)</div>
        </div>
      </div>
    </template>

    <!-- Chat ingénieur -->
    <template #right>
      <div class="chat chat-start">
        <div class="chat-bubble">Tu freines trop tard au virage 3 !</div>
      </div>
      <div class="chat chat-end">
        <div class="chat-bubble chat-bubble-primary">Reçu, je corrige au prochain tour.</div>
      </div>
    </template>
  </MainLayout>
</template>
