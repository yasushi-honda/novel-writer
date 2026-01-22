<script setup lang="ts">
import { ref } from 'vue'

const activePanel = ref<string | null>(null)

const panels = [
  {
    id: 'left',
    name: '左パネル',
    subtitle: '設定ライブラリ',
    description: 'キャラクター、世界観、プロットなどの資料を管理',
    color: '#8b5cf6',
    features: ['キャラクター', '世界観', '相関図', 'タイムライン', 'ナレッジベース', 'プロットボード']
  },
  {
    id: 'center',
    name: '中央パネル',
    subtitle: '本文エリア',
    description: '物語の本文を執筆するメインエリア',
    color: '#06b6d4',
    features: ['段落エディタ', 'リッチテキスト編集', 'ピン留め機能', '直接入力エリア']
  },
  {
    id: 'right',
    name: '右パネル',
    subtitle: 'AIアシスタント',
    description: 'AIと対話しながら執筆を進める',
    color: '#f59e0b',
    features: ['相談モード', '執筆モード', '複数提案', '提案の承認/却下']
  }
]

const setActive = (id: string) => {
  activePanel.value = activePanel.value === id ? null : id
}
</script>

<template>
  <div class="screen-layout-container">
    <!-- ヘッダー部分 -->
    <div class="layout-header">
      <!-- デスクトップ用ヘッダー -->
      <div class="header-content desktop-only">
        <div class="header-left">
          <span class="back-btn">← プロジェクト一覧</span>
        </div>
        <div class="header-center">
          <span class="btn">エクスポート</span>
          <span class="btn">検索</span>
          <span class="btn">表示設定</span>
          <span class="btn">モード切替</span>
        </div>
        <div class="header-right">
          <span class="btn">.txt</span>
          <span class="btn">.html</span>
        </div>
      </div>
      <!-- モバイル用ヘッダー -->
      <div class="header-mobile mobile-only">
        <span class="header-mobile-label">ヘッダー（操作ボタン類）</span>
      </div>
      <div class="header-label desktop-only">ヘッダー</div>
    </div>

    <!-- メインパネル部分 -->
    <div class="layout-main">
      <div
        v-for="panel in panels"
        :key="panel.id"
        :class="['panel', `panel-${panel.id}`, { active: activePanel === panel.id }]"
        :style="{ '--panel-color': panel.color }"
        @click="setActive(panel.id)"
      >
        <div class="panel-header">
          <div class="panel-icon">
            <svg v-if="panel.id === 'left'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <svg v-if="panel.id === 'center'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z"/>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
              <path d="M2 2l7.586 7.586"/>
            </svg>
            <svg v-if="panel.id === 'right'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="panel-title">{{ panel.name }}</div>
          <div class="panel-subtitle">{{ panel.subtitle }}</div>
        </div>

        <div class="panel-details" v-show="activePanel === panel.id">
          <p class="panel-description">{{ panel.description }}</p>
          <ul class="panel-features">
            <li v-for="feature in panel.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>

        <div class="panel-hint" v-show="activePanel !== panel.id">
          タップして詳細を見る
        </div>
      </div>
    </div>

    <!-- キャプション -->
    <div class="layout-caption">
      <p>各パネルをタップすると詳細が表示されます</p>
    </div>
  </div>
</template>

<style scoped>
.screen-layout-container {
  margin: 1.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.dark .screen-layout-container {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

/* 表示切り替え */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

/* ヘッダー */
.layout-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 1rem 1.5rem;
  position: relative;
}

.header-content {
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.back-btn,
.btn {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.back-btn:hover,
.btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.5rem;
  font-weight: 700;
  pointer-events: none;
  letter-spacing: 0.5em;
}

.header-mobile {
  text-align: center;
}

.header-mobile-label {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
}

/* メインパネル */
.layout-main {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1px;
  background: var(--vp-c-divider);
  min-height: 300px;
}

.panel {
  background: var(--vp-c-bg);
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--panel-color);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.panel:hover::before,
.panel.active::before {
  transform: scaleX(1);
}

.panel:hover {
  background: var(--vp-c-bg-soft);
}

.panel.active {
  background: var(--vp-c-bg-soft);
}

.panel-header {
  text-align: center;
  margin-bottom: 0.75rem;
}

.panel-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 0.75rem;
  padding: 10px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--panel-color);
  transition: all 0.3s;
}

.panel:hover .panel-icon,
.panel.active .panel-icon {
  background: var(--panel-color);
  color: white;
  transform: scale(1.1);
}

.panel-icon svg {
  width: 100%;
  height: 100%;
}

.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.panel-subtitle {
  font-size: 0.85rem;
  color: var(--panel-color);
  font-weight: 600;
}

.panel-details {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-description {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.panel-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.panel-features li {
  background: var(--vp-c-bg);
  padding: 0.3rem 0.6rem;
  border-radius: 16px;
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.panel-features li:hover {
  border-color: var(--panel-color);
  color: var(--panel-color);
}

.panel-hint {
  margin-top: auto;
  text-align: center;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition: opacity 0.2s;
}

.panel:hover .panel-hint {
  opacity: 1;
}

/* キャプション */
.layout-caption {
  padding: 0.75rem;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.layout-caption p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

/* タブレット */
@media (max-width: 960px) {
  .layout-main {
    grid-template-columns: 1fr 1.5fr 1fr;
    min-height: 280px;
  }
}

/* モバイル */
@media (max-width: 640px) {
  .screen-layout-container {
    margin: 1rem 0;
    border-radius: 10px;
  }

  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }

  .layout-header {
    padding: 0.75rem 1rem;
  }

  .layout-main {
    grid-template-columns: 1fr;
    min-height: auto;
    gap: 1px;
  }

  .panel {
    padding: 1rem;
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
  }

  .panel::before {
    width: 4px;
    height: 100%;
    top: 0;
    left: 0;
    right: auto;
    transform: scaleY(0);
  }

  .panel:hover::before,
  .panel.active::before {
    transform: scaleY(1);
  }

  .panel-header {
    text-align: left;
    margin-bottom: 0;
    flex-shrink: 0;
    width: 80px;
  }

  .panel-icon {
    width: 40px;
    height: 40px;
    margin: 0 0 0.5rem 0;
    padding: 8px;
  }

  .panel-title {
    font-size: 0.9rem;
  }

  .panel-subtitle {
    font-size: 0.75rem;
  }

  .panel-details {
    flex: 1;
    padding-top: 0.25rem;
  }

  .panel-description {
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
  }

  .panel-features {
    gap: 0.3rem;
  }

  .panel-features li {
    padding: 0.25rem 0.5rem;
    font-size: 0.65rem;
  }

  .panel-hint {
    display: none;
  }

  .layout-caption {
    padding: 0.6rem;
  }

  .layout-caption p {
    font-size: 0.75rem;
  }
}
</style>
