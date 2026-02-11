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
  max-width: 700px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  background: #1a1a1a;
  border: 1px solid rgba(206, 247, 159, 0.2);
}

.hero-slide-editor {
  width: 100%;
  height: 500px;
  overflow: auto;
}

/* Make the editor look nice in the hero section */
.hero-slide-editor :deep(.bs-viewport) {
  height: 100%;
  background: #1a1a1a;
  padding: 16px;
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
