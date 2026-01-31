<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const copied = ref(false)

const copy = async () => {
  if (!page.value?.rawMarkdown) return
  await navigator.clipboard.writeText(page.value.rawMarkdown)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div class="copy-markdown">
    <button class="copy-markdown__button" type="button" @click="copy">
      {{ copied ? 'Copied!' : 'Copy Markdown' }}
    </button>
  </div>
</template>
