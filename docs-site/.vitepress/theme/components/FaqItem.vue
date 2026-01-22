<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  question: string
}>()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div :class="['faq-item', { open: isOpen }]">
    <button class="faq-question" @click="toggle">
      <span class="faq-q-badge">Q</span>
      <span class="faq-q-text">{{ question }}</span>
      <span class="faq-chevron">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </span>
    </button>
    <div class="faq-answer">
      <div class="faq-answer-inner">
        <span class="faq-a-badge">A</span>
        <div class="faq-a-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-item {
  margin: 0.75rem 0;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: all 0.25s;
}

.faq-item:hover {
  border-color: var(--vp-c-brand-soft);
}

.faq-item.open {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
}

.dark .faq-item.open {
  box-shadow: 0 4px 12px rgba(196, 181, 253, 0.1);
}

/* Question */
.faq-question {
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

.faq-question:hover {
  background: var(--vp-c-bg);
}

.faq-q-badge {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 8px;
}

.faq-q-text {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.faq-chevron {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-3);
  transition: transform 0.3s;
}

.faq-chevron svg {
  width: 100%;
  height: 100%;
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
  color: var(--vp-c-brand-1);
}

/* Answer */
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.faq-item.open .faq-answer {
  grid-template-rows: 1fr;
}

.faq-answer-inner {
  overflow: hidden;
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem;
}

.faq-item.open .faq-answer-inner {
  padding: 0 1.25rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1rem;
}

.faq-a-badge {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 8px;
  border: 2px solid var(--vp-c-brand-soft);
}

.faq-a-content {
  flex: 1;
  min-width: 0;
}

/* Slotted content styling */
:deep(p) {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

:deep(p:last-child) {
  margin-bottom: 0;
}

:deep(ol),
:deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}

:deep(li) {
  margin: 0.35rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

:deep(code) {
  background: var(--vp-c-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85em;
}

:deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

:deep(a:hover) {
  text-decoration: underline;
}

/* Mobile */
@media (max-width: 640px) {
  .faq-question {
    padding: 0.875rem 1rem;
    gap: 0.6rem;
  }

  .faq-q-badge,
  .faq-a-badge {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
    border-radius: 6px;
  }

  .faq-q-text {
    font-size: 0.9rem;
  }

  .faq-answer-inner {
    gap: 0.6rem;
  }

  .faq-item.open .faq-answer-inner {
    padding: 0 1rem 1rem;
    padding-top: 0.875rem;
  }

  :deep(p),
  :deep(li) {
    font-size: 0.85rem;
  }
}
</style>
