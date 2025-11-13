import { Plugin, PluginKey } from '@blockslides/pm/state'

import { Extension } from '../Extension.js'

export const Drop = Extension.create({
  name: 'drop',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('BlockSlidesDrop'),

        props: {
          handleDrop: (_, e, slice, moved) => {
            this.editor.emit('drop', {
              editor: this.editor,
              event: e,
              slice,
              moved,
            })
          },
        },
      }),
    ]
  },
})
