<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import MermaidZoom from './components/MermaidZoom.vue'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <!-- ヒーローセクションに動画を配置 -->
    <template #home-hero-image>
      <div class="hero-video-container">
        <video
          class="hero-video"
          autoplay
          loop
          muted
          playsinline
        >
          <source src="/promo-video.mp4" type="video/mp4" />
        </video>
      </div>
    </template>

    <template #layout-bottom>
      <MermaidZoom />
    </template>
  </Layout>
</template>

<style scoped>
.hero-video-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-video {
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(107, 83, 68, 0.2);
}

/* タブレット */
@media (max-width: 960px) {
  .hero-video {
    width: 220px;
    height: 220px;
    border-radius: 14px;
  }
}

/* モバイル */
@media (max-width: 640px) {
  .hero-video {
    width: 160px;
    height: 160px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(107, 83, 68, 0.15);
  }
}

/* ダークモード */
.dark .hero-video {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}
</style>

<style>
/* VitePressのヒーローセクションの余白を調整 */
/* 根本原因: .image-containerが固定サイズ(320px)のため、動画サイズと不一致 */

/* デスクトップ */
.VPHomeHero.has-image .image-container {
  width: 280px !important;
  height: 280px !important;
}

.VPHomeHero.has-image .image {
  margin-top: 0 !important;
}

/* 背景の円を非表示 */
.VPHomeHero .image-bg {
  display: none !important;
}

/* タブレット */
@media (max-width: 960px) {
  .VPHomeHero.has-image .image-container {
    width: 220px !important;
    height: 220px !important;
  }

  .VPHomeHero.has-image .image {
    margin-bottom: 16px !important;
  }
}

/* モバイル */
@media (max-width: 640px) {
  .VPHomeHero.has-image .image-container {
    width: 160px !important;
    height: 160px !important;
  }

  .VPHomeHero.has-image .image {
    margin-bottom: 12px !important;
  }
}
</style>
