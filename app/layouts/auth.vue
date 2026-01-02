<script setup lang="ts">
// Auth layout - clean centered design
</script>

<template>
  <div class="min-h-screen bg-dark-950 flex items-center justify-center p-4">
    <div class="noise-overlay" />
    <div class="grid-bg fixed inset-0" />
    
    <div class="relative z-10 w-full max-w-lg">
      <slot />
    </div>
  </div>
</template>
