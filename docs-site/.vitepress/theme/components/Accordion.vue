<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  icon?: string
  defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen ?? false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div :class="['accordion', { open: isOpen }]">
    <button class="accordion-header" @click="toggle">
      <span v-if="icon" class="accordion-icon">{{ icon }}</span>
      <span class="accordion-title">{{ title }}</span>
      <span class="accordion-chevron">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </span>
    </button>
    <div class="accordion-content">
      <div class="accordion-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion {
  margin: 0.75rem 0;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: all 0.25s;
}

.accordion:hover {
  border-color: var(--vp-c-brand-soft);
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.accordion-header:hover {
  background: var(--vp-c-bg);
}

.accordion-icon {
  font-size: 1.25rem;
}

.accordion-title {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.accordion-chevron {
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-3);
  transition: transform 0.3s;
}

.accordion-chevron svg {
  width: 100%;
  height: 100%;
}

.accordion.open .accordion-chevron {
  transform: rotate(180deg);
}

.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.accordion.open .accordion-content {
  grid-template-rows: 1fr;
}

.accordion-inner {
  overflow: hidden;
  padding: 0 1.25rem;
}

.accordion.open .accordion-inner {
  padding: 0 1.25rem 1.25rem;
}

/* Slotted content styling */
:deep(p) {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

:deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}

:deep(li) {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>
