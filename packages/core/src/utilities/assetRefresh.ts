import type { SlideEditor as Editor } from '../SlideEditor.js'

/**
 * The node types that can carry asset URLs.
 */
export type AssetNodeType = 'imageBlock' | 'slide' | 'columnGroup' | 'video'

/**
 * A reference to an asset found in the document.
 *
 * - `assetId` is the stable identifier set by the application when the asset
 *   was inserted (only available on `imageBlock` nodes). Use it as the key when
 *   building the URL map for `updateAssetUrls` or `refreshAssets`.
 * - `currentUrl` is the URL currently stored in the document. Use it as the
 *   key for nodes that have no `assetId` (slides, columnGroups, videos).
 * - `nodeType` lets you filter by content type if needed.
 */
export interface AssetRef {
  assetId: string | null
  currentUrl: string
  nodeType: AssetNodeType
}

/**
 * A map of lookup key → fresh URL passed to `updateAssetUrls` or returned
 * from an `AssetResolver`. Keys may be either `assetId` values or raw URLs.
 */
export type AssetUrlMap = Record<string, string>

/**
 * An async function that receives the current assets and returns a map of
 * fresh URLs. This is the integration point with your storage provider
 * (S3, Supabase, Cloudflare R2, your own CDN, etc.).
 *
 * @example
 * const resolver: AssetResolver = async (assets) => {
 *   const ids = assets.map(a => a.assetId).filter(Boolean)
 *   const fresh = await myApi.refreshSignedUrls(ids)
 *   return Object.fromEntries(
 *     assets.map(a => [a.assetId ?? a.currentUrl, fresh[a.assetId ?? '']])
 *   )
 * }
 */
export type AssetResolver = (assets: AssetRef[]) => Promise<AssetUrlMap>

/**
 * Collect all asset references from the editor document.
 *
 * Traverses every node and returns one `AssetRef` per URL-bearing node:
 * - `imageBlock` nodes (src + optional assetId)
 * - `slide` nodes with a backgroundImage
 * - `columnGroup` nodes with a backgroundImage
 * - `video` nodes (src)
 *
 * @example
 * const assets = getEditorAssets(editor)
 * // → [{ assetId: 'abc', currentUrl: 'https://...', nodeType: 'imageBlock' }, ...]
 */
export function getEditorAssets(editor: Editor): AssetRef[] {
  const assets: AssetRef[] = []

  editor.state.doc.descendants((node) => {
    if (node.type.name === 'imageBlock' && node.attrs.src) {
      assets.push({
        assetId: node.attrs.assetId ?? null,
        currentUrl: node.attrs.src,
        nodeType: 'imageBlock',
      })
    }

    if (node.type.name === 'slide' && node.attrs.backgroundImage) {
      assets.push({
        assetId: null,
        currentUrl: node.attrs.backgroundImage,
        nodeType: 'slide',
      })
    }

    if (node.type.name === 'columnGroup' && node.attrs.backgroundImage) {
      assets.push({
        assetId: null,
        currentUrl: node.attrs.backgroundImage,
        nodeType: 'columnGroup',
      })
    }

    if (node.type.name === 'video' && node.attrs.src) {
      assets.push({
        assetId: null,
        currentUrl: node.attrs.src,
        nodeType: 'video',
      })
    }
  })

  return assets
}

/**
 * Refresh all asset URLs in the editor document.
 *
 * Collects every asset reference, passes the list to your `resolver` function,
 * then applies the returned URL map in a single ProseMirror transaction.
 *
 * The resolver is where you integrate with your storage provider — fetch
 * presigned URLs from S3, generate Supabase tokens, call your own API, etc.
 * Blockslides only handles the document traversal and patching.
 *
 * @param editor - The SlideEditor instance.
 * @param resolver - Async function that receives the asset list and returns
 *   a map of `{ assetId | currentUrl → freshUrl }`.
 *
 * @example
 * import { refreshAssets } from '@blockslides/core'
 *
 * await refreshAssets(editor, async (assets) => {
 *   const ids = assets.map(a => a.assetId).filter(Boolean)
 *   const fresh = await myStorage.getSignedUrls(ids)
 *   return Object.fromEntries(
 *     assets.map(a => [a.assetId ?? a.currentUrl, fresh[a.assetId ?? '']])
 *   )
 * })
 */
export async function refreshAssets(
  editor: Editor,
  resolver: AssetResolver,
): Promise<void> {
  const assets = getEditorAssets(editor)
  if (assets.length === 0) return

  const urlMap = await resolver(assets)
  editor.commands.updateAssetUrls(urlMap)
}
