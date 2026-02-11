<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { EditorContent } from '@blockslides/vue-3'
import BubbleMenuPreset from './menus/BubbleMenuPreset.vue'
import { useSlideEditor, type UseSlideEditorProps } from './useSlideEditor'
import type { Editor } from '@blockslides/core'

export interface BubbleMenuPresetProps {
  editor: Editor
  [key: string]: any
}

export interface SlideEditorProps extends UseSlideEditorProps {
  /**
   * Toggle or customize the built-in BubbleMenuPreset.
   * - true (default): render with defaults
   * - false: disable entirely
   * - object: pass through to BubbleMenuPreset
   */
  bubbleMenuPreset?: boolean | BubbleMenuPresetProps
  className?: string
  style?: any
}

const props = withDefaults(defineProps<SlideEditorProps>(), {
  bubbleMenuPreset: true,
})

const {
  bubbleMenuPreset,
  className,
  style,
  ...hookProps
} = props

const { editor } = useSlideEditor(hookProps)

const bubbleMenuProps = computed(() => {
  if (props.bubbleMenuPreset === false) return null
  if (props.bubbleMenuPreset === true) return {}
  return props.bubbleMenuPreset
})

</script>

<template>
  <div v-if="editor" :class="className" :style="style">
    <div class="bs-viewport">
      <EditorContent :editor="editor" />
      <BubbleMenuPreset v-if="bubbleMenuProps" :editor="editor" v-bind="bubbleMenuProps" />
    </div>
  </div>
</template>
 
