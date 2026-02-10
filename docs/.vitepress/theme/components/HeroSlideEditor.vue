<script setup lang="ts">
// Placeholder component for the hero slide editor
// We'll add the actual SlideEditor component later
</script>

<template>
  <div class="hero-editor-placeholder">
    <div class="placeholder-content">
      <p>Slide Editor Previeddw</p>
      <p class="placeholder-text">(Coming soon)</p>
    </div>
  </div>
</template>

<style scoped>
.hero-editor-placeholder {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #cef79f;
}

.placeholder-content p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.placeholder-text {
  font-size: 1rem !important;
  opacity: 0.7;
  margin-top: 8px !important;
}
</style>
