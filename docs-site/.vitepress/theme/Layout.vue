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
    width: 240px;
    height: 240px;
    border-radius: 14px;
  }
}

/* モバイル */
@media (max-width: 640px) {
  .hero-video-container {
    margin-top: 16px;
    padding-top: env(safe-area-inset-top, 0);
  }

  .hero-video {
    width: 180px;
    height: 180px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(107, 83, 68, 0.15);
  }
}

/* ダークモード */
.dark .hero-video {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}
</style>
