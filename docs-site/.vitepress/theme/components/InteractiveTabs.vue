<script setup lang="ts">
import { ref, computed } from 'vue'

interface Tab {
  id: string
  label: string
  icon?: string
}

const props = defineProps<{
  tabs: Tab[]
}>()

const activeTab = ref(props.tabs[0]?.id || '')

const setActive = (id: string) => {
  activeTab.value = id
}
</script>

<template>
  <div class="interactive-tabs">
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="setActive(tab.id)"
      >
        <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>
    <div class="tabs-content">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-panel', { active: activeTab === tab.id }]"
      >
        <slot :name="tab.id" v-if="activeTab === tab.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.interactive-tabs {
  margin: 1.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.tabs-header {
  display: flex;
  gap: 0;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-button {
  flex: 1;
  min-width: 120px;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: var(--vp-c-brand-1);
  transition: all 0.3s;
  transform: translateX(-50%);
}

.tab-button:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.tab-button.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  font-weight: 600;
}

.tab-button.active::after {
  width: 80%;
}

.tab-icon {
  font-size: 1.1rem;
}

.tabs-content {
  padding: 1.5rem;
  background: var(--vp-c-bg);
}

.tab-panel {
  animation: tabFadeIn 0.3s ease;
}

@keyframes tabFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .tab-button {
    min-width: 100px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}
</style>
