import { Plugin, PluginKey } from '@blockslides/pm/state'

import { Extension } from '../Extension.js'

export const Paste = Extension.create({
  name: 'paste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('BlockSlidesPaste'),

        props: {
          handlePaste: (_view, e, slice) => {
            this.editor.emit('paste', {
              editor: this.editor,
              event: e,
              slice,
            })
          },
        },
      }),
    ]
  },
})
