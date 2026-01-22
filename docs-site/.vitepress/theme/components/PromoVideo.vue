<script setup lang="ts">
</script>

<template>
  <div class="promo-video-container">
    <video
      class="promo-video"
      autoplay
      loop
      muted
      playsinline
    >
      <source src="/promo-video.mp4" type="video/mp4" />
    </video>
  </div>
</template>

<style scoped>
.promo-video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
  max-width: 320px;
}

.promo-video {
  width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(107, 83, 68, 0.15);
}

/* モバイル対応 */
@media (max-width: 640px) {
  .promo-video-container {
    max-width: 240px;
    margin: 1.5rem auto;
  }

  .promo-video {
    border-radius: 12px;
  }
}

/* タブレット */
@media (min-width: 641px) and (max-width: 960px) {
  .promo-video-container {
    max-width: 280px;
  }
}

/* ダークモード対応 */
.dark .promo-video {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
</style>
