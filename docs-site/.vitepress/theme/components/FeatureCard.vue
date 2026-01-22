<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
  color?: string
}>()
</script>

<template>
  <div class="feature-card" :style="{ '--card-color': color || '#8b5cf6' }">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-content">
      <h4 class="card-title">{{ title }}</h4>
      <p v-if="description" class="card-description">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--card-color);
  transform: scaleY(0);
  transition: transform 0.25s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: var(--card-color);
}

.dark .feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.feature-card:hover::before {
  transform: scaleY(1);
}

.card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: var(--vp-c-bg);
  border-radius: 10px;
  transition: all 0.25s;
}

.feature-card:hover .card-icon {
  background: var(--card-color);
  transform: scale(1.1);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* Slotted content styling */
:deep(ul) {
  margin: 0.5rem 0 0;
  padding-left: 1rem;
}

:deep(li) {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0.25rem 0;
}
</style>
