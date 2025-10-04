<template>
  <div class="flex h-screen w-full flex-col overflow-hidden md:flex-row">
    <!-- Left Panel - Télémétrie -->
    <aside class="bg-base-200 order-1 w-full overflow-y-auto p-2 md:order-1 md:w-1/4 md:p-4">
      <slot name="left"></slot>
    </aside>

    <!-- Center - Carte du circuit -->
    <main class="order-3 w-full overflow-hidden p-2 md:order-2 md:w-2/4">
      <slot name="center"></slot>
    </main>

    <!-- Right Panel - Chat -->
    <aside class="bg-base-200 order-2 w-full overflow-y-auto p-2 md:order-3 md:w-1/4 md:p-4">
      <slot name="right"></slot>
    </aside>
  </div>
</template>
