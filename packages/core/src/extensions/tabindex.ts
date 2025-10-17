import { Plugin, PluginKey } from '@autoartifacts/pm/state'

import { Extension } from '../Extension.js'

export const Tabindex = Extension.create({
  name: 'tabindex',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('tabindex'),
        props: {
          attributes: (): { [name: string]: string } => (this.editor.isEditable ? { tabindex: '0' } : {}),
        },
      }),
    ]
  },
})
