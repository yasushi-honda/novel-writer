<script setup lang="ts">
defineProps<{
  columns?: number
}>()
</script>

<template>
  <div class="card-grid" :style="{ '--columns': columns || 2 }">
    <slot />
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
