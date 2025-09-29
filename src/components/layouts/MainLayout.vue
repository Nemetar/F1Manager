<template>
  <div class="grid h-screen w-screen grid-cols-4 gap-4 p-4">
    <div class="bg-white-200 rounded-box border border-white p-4">
      <slot name="left"></slot>
    </div>

    <div class="bg-white-300 rounded-box col-span-2 border border-white p-4">
      <slot name="center"></slot>
    </div>

    <div class="bg-white-200 rounded-box border border-white p-4">
      <slot name="right"></slot>
    </div>
  </div>
</template>
