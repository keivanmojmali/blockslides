<script setup lang="ts">
import { SlideEditor } from '@blockslides/vue-3-prebuilts'
</script>

<template>
  <div class="hero-editor-wrapper">
    <SlideEditor 
      class="hero-slide-editor"
    />
  </div>
</template>

<style scoped>
.hero-editor-wrapper {
  width: 100%;
  max-width: 800px;
  height: 80vh;
  max-height: 800px;
}

.hero-slide-editor {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* Make the editor look nice in the hero section */
.hero-slide-editor :deep(.bs-viewport) {
  height: 100%;
  background: transparent;
  padding: 0;
}

.hero-slide-editor :deep(.ProseMirror) {
  height: 100%;
  outline: none;
}

/* Style the slide in the editor */
.hero-slide-editor :deep(.bs-slide) {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin: 0 auto;
}
</style>
