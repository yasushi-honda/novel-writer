<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const isOpen = ref(false)
const mermaidContent = ref<string>('')
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const modalContent = ref<HTMLElement | null>(null)

const MIN_SCALE = 0.5
const MAX_SCALE = 3

const openModal = (svg: string) => {
  mermaidContent.value = svg
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

const resetView = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.3, MAX_SCALE)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.3, MIN_SCALE)
}

// Mouse wheel zoom
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value * delta))
}

// Mouse drag
const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.clientX - translateX.value
  startY.value = e.clientY - translateY.value
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  translateX.value = e.clientX - startX.value
  translateY.value = e.clientY - startY.value
}

const handleMouseUp = () => {
  isDragging.value = false
}

// Touch events for mobile
let lastTouchDistance = 0

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging.value = true
    startX.value = e.touches[0].clientX - translateX.value
    startY.value = e.touches[0].clientY - translateY.value
  } else if (e.touches.length === 2) {
    lastTouchDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
  }
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  if (e.touches.length === 1 && isDragging.value) {
    translateX.value = e.touches[0].clientX - startX.value
    translateY.value = e.touches[0].clientY - startY.value
  } else if (e.touches.length === 2) {
    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    const delta = distance / lastTouchDistance
    scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value * delta))
    lastTouchDistance = distance
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
}

// Escape key to close
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

// Setup click handlers for mermaid diagrams
const setupMermaidClickHandlers = () => {
  nextTick(() => {
    const mermaidDivs = document.querySelectorAll('.mermaid')
    mermaidDivs.forEach((div) => {
      // Skip if already has handler
      if (div.hasAttribute('data-zoom-enabled')) return
      div.setAttribute('data-zoom-enabled', 'true')

      // Add click hint overlay
      const wrapper = document.createElement('div')
      wrapper.className = 'mermaid-zoom-wrapper'
      div.parentNode?.insertBefore(wrapper, div)
      wrapper.appendChild(div)

      // Add click hint
      const hint = document.createElement('div')
      hint.className = 'mermaid-zoom-hint'
      hint.innerHTML = '<span>クリックで拡大</span>'
      wrapper.appendChild(hint)

      // Click handler
      wrapper.addEventListener('click', () => {
        const svg = div.innerHTML
        openModal(svg)
      })
    })
  })
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)

  // Initial setup
  setupMermaidClickHandlers()

  // Watch for route changes (VitePress specific)
  const observer = new MutationObserver(() => {
    setupMermaidClickHandlers()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="mermaid-modal-overlay" @click.self="closeModal">
        <div class="mermaid-modal">
          <div class="mermaid-modal-header">
            <div class="mermaid-modal-title">図を拡大表示</div>
            <div class="mermaid-modal-controls">
              <button class="control-btn" @click="zoomOut" title="縮小">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35M8 11h6"/>
                </svg>
              </button>
              <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
              <button class="control-btn" @click="zoomIn" title="拡大">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
                </svg>
              </button>
              <button class="control-btn" @click="resetView" title="リセット">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
              <button class="control-btn close-btn" @click="closeModal" title="閉じる">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div
            class="mermaid-modal-content"
            ref="modalContent"
            @wheel="handleWheel"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <div
              class="mermaid-content"
              :style="{
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }"
              v-html="mermaidContent"
            />
          </div>
          <div class="mermaid-modal-footer">
            <span class="hint-text">マウスホイールでズーム、ドラッグで移動</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mermaid-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.mermaid-modal {
  background: var(--vp-c-bg);
  border-radius: 16px;
  width: 100%;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.mermaid-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.mermaid-modal-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.mermaid-modal-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--vp-c-bg);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.control-btn:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.control-btn svg {
  width: 20px;
  height: 20px;
}

.close-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.dark .close-btn:hover {
  background: rgba(220, 38, 38, 0.2);
}

.zoom-level {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  min-width: 50px;
  text-align: center;
}

.mermaid-modal-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--vp-c-bg);
  touch-action: none;
}

.mermaid-content {
  transform-origin: center center;
  transition: transform 0.1s ease-out;
  padding: 2rem;
}

.mermaid-content :deep(svg) {
  max-width: none !important;
  height: auto !important;
}

.mermaid-modal-footer {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.hint-text {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .mermaid-modal,
.modal-leave-active .mermaid-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from .mermaid-modal,
.modal-leave-to .mermaid-modal {
  transform: scale(0.9);
}

/* Mobile */
@media (max-width: 640px) {
  .mermaid-modal-overlay {
    padding: 0.5rem;
  }

  .mermaid-modal-header {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .mermaid-modal-title {
    font-size: 0.9rem;
  }

  .control-btn {
    width: 32px;
    height: 32px;
  }

  .control-btn svg {
    width: 18px;
    height: 18px;
  }

  .zoom-level {
    font-size: 0.75rem;
  }

  .mermaid-modal-content {
    min-height: 300px;
  }

  .mermaid-modal-footer {
    padding: 0.5rem 1rem;
  }

  .hint-text {
    font-size: 0.7rem;
  }
}
</style>

<style>
/* Global styles for mermaid wrappers */
.mermaid-zoom-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.25s;
}

.mermaid-zoom-wrapper:hover {
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
}

.dark .mermaid-zoom-wrapper:hover {
  box-shadow: 0 4px 20px rgba(196, 181, 253, 0.15);
}

.mermaid-zoom-wrapper .mermaid {
  display: block;
}

.mermaid-zoom-hint {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}

.mermaid-zoom-wrapper:hover .mermaid-zoom-hint {
  opacity: 1;
}

.mermaid-zoom-hint span {
  background: var(--vp-c-brand-1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Mobile: always show hint */
@media (max-width: 640px) {
  .mermaid-zoom-hint {
    opacity: 1;
    background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.7));
    align-items: flex-end;
    padding-bottom: 1rem;
  }

  .mermaid-zoom-hint span {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
