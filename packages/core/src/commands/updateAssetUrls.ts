import type { RawCommands } from '../types.js'

declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    updateAssetUrls: {
      /**
       * Update asset URLs across the entire document in a single transaction.
       * The map keys can be either an `assetId` (preferred for imageBlock nodes)
       * or the current URL (used as a fallback, and for nodes without an assetId
       * such as slide/columnGroup backgrounds and video embeds).
       *
       * @example
       * editor.commands.updateAssetUrls({
       *   'asset-123': 'https://cdn.example.com/fresh-url.jpg',
       *   'https://old.example.com/bg.jpg': 'https://cdn.example.com/fresh-bg.jpg',
       * })
       */
      updateAssetUrls: (urlMap: Record<string, string>) => ReturnType
    }
  }
}

export const updateAssetUrls: RawCommands['updateAssetUrls'] =
  (urlMap) =>
  ({ tr, state, dispatch }) => {
    if (dispatch) {
      state.doc.descendants((node, pos) => {
        // imageBlock: prefer assetId as lookup key, fall back to src URL
        if (node.type.name === 'imageBlock' && node.attrs.src) {
          const key =
            node.attrs.assetId && urlMap[node.attrs.assetId]
              ? node.attrs.assetId
              : node.attrs.src
          const newUrl = urlMap[key]
          if (newUrl) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: newUrl })
          }
        }

        // slide and columnGroup: keyed by the backgroundImage URL
        if (
          (node.type.name === 'slide' || node.type.name === 'columnGroup') &&
          node.attrs.backgroundImage
        ) {
          const newUrl = urlMap[node.attrs.backgroundImage]
          if (newUrl) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              backgroundImage: newUrl,
            })
          }
        }

        // video: keyed by src URL
        if (node.type.name === 'video' && node.attrs.src) {
          const newUrl = urlMap[node.attrs.src]
          if (newUrl) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: newUrl })
          }
        }
      })
    }

    return true
  }
