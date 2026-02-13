import type { Editor, Range } from '@blockslides/core'
import type { SlashCommands } from './types.js'

/**
 * Creates a commands helper object with placeholder implementations
 * Phase 1: All commands console.log their intent
 * Phase 2: Implement actual editor commands
 */
export function createSlashCommands(editor: Editor, range: Range): SlashCommands {
  return {
    replaceWithHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
      console.log(' Command: replaceWithHeading', { level, range })
      // Phase 2: editor.chain().focus().deleteRange(range).setNode('heading', { level }).run()
    },

    replaceWithBulletList() {
      console.log(' Command: replaceWithBulletList', { range })
      // Phase 2: editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },

    replaceWithNumberedList() {
      console.log(' Command: replaceWithNumberedList', { range })
      // Phase 2: editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },

    replaceWithParagraph() {
      console.log(' Command: replaceWithParagraph', { range })
      // Phase 2: editor.chain().focus().deleteRange(range).setParagraph().run()
    },

    replaceWithImage(src?: string) {
      console.log(' Command: replaceWithImage', { src, range })
      // Phase 2: editor.chain().focus().deleteRange(range).setImage({ src }).run()
    },

    replaceWithTable(rows = 3, cols = 3) {
      console.log(' Command: replaceWithTable', { rows, cols, range })
      // Phase 2: editor.chain().focus().deleteRange(range).insertTable({ rows, cols }).run()
    },

    insertBlock(type: string, attrs?: Record<string, any>) {
      console.log(' Command: insertBlock', { type, attrs, range })
      // Phase 2: editor.chain().focus().deleteRange(range).setNode(type, attrs).run()
    },

    deleteSlashRange() {
      console.log(' Command: deleteSlashRange', { range })
      // Phase 2: editor.chain().focus().deleteRange(range).run()
    },
  }
}
