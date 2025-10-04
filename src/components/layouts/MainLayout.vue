<template>
  <div class="grid h-screen grid-cols-1 md:grid-cols-12">
    <!-- Left Panel -->
    <aside class="bg-base-200 order-1 overflow-y-auto p-4 md:order-1 md:col-span-3">
      <slot name="left"></slot>
    </aside>

    <!-- Center (Track map, main content) -->
    <main class="order-3 overflow-y-auto p-2 md:order-2 md:col-span-6">
      <slot name="center"></slot>
    </main>

    <!-- Right Panel (Chat) -->
    <aside class="bg-base-200 order-2 overflow-y-auto p-4 md:order-3 md:col-span-3">
      <slot name="right"></slot>
    </aside>
  </div>
</template>
