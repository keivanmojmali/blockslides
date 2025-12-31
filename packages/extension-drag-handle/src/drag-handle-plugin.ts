import { type ComputePositionConfig, type VirtualElement, computePosition } from '@floating-ui/dom'
import type { Editor } from '@blockslides/core'
import type { Node } from '@blockslides/pm/model'
import { type EditorState, type Transaction, Plugin, PluginKey } from '@blockslides/pm/state'
import type { EditorView } from '@blockslides/pm/view'

import { dragHandler } from './helpers/dragHandler.js'
import { findElementNextToCoords } from './helpers/findNextElementFromCursor.js'
import { getOuterNode, getOuterNodePos } from './helpers/getOuterNode.js'
import { removeNode } from './helpers/removeNode.js'

type PluginState = {
  locked: boolean
}

const getOuterDomNode = (view: EditorView, domNode: HTMLElement) => {
  let tmpDomNode = domNode

  // Traverse to top level node.
  while (tmpDomNode?.parentNode) {
    if (tmpDomNode.parentNode === view.dom) {
      break
    }

    tmpDomNode = tmpDomNode.parentNode as HTMLElement
  }

  return tmpDomNode
}

export interface DragHandlePluginProps {
  pluginKey?: PluginKey | string
  editor: Editor
  element: HTMLElement
  onNodeChange?: (data: { editor: Editor; node: Node | null; pos: number }) => void
  onElementDragStart?: (e: DragEvent) => void
  onElementDragEnd?: (e: DragEvent) => void
  computePositionConfig?: ComputePositionConfig
  getReferencedVirtualElement?: () => VirtualElement | null
}

export const dragHandlePluginDefaultKey = new PluginKey('dragHandle')

export const DragHandlePlugin = ({
  pluginKey = dragHandlePluginDefaultKey,
  element,
  editor,
  computePositionConfig,
  getReferencedVirtualElement,
  onNodeChange,
  onElementDragStart,
  onElementDragEnd,
}: DragHandlePluginProps) => {
  const wrapper = document.createElement('div')
  let locked = false
  let currentNode: Node | null = null
  let currentNodePos = -1
  let rafId: number | null = null
  let pendingMouseCoords: { x: number; y: number } | null = null

  function hideHandle() {
    if (!element) {
      return
    }

    element.style.visibility = 'hidden'
    element.style.pointerEvents = 'none'
  }

  function showHandle() {
    if (!element) {
      return
    }

    if (!editor.isEditable) {
      hideHandle()
      return
    }

    element.style.visibility = ''
    element.style.pointerEvents = 'auto'
  }

  function repositionDragHandle(dom: Element) {
    const virtualElement = getReferencedVirtualElement?.() || {
      getBoundingClientRect: () => dom.getBoundingClientRect(),
    }

    computePosition(virtualElement, element, computePositionConfig).then(val => {
      Object.assign(element.style, {
        position: val.strategy,
        left: `${val.x}px`,
        top: `${val.y}px`,
      })
    })
  }

  function onDragStart(e: DragEvent) {
    onElementDragStart?.(e)
    // Push this to the end of the event cue
    // Fixes bug where incorrect drag pos is returned if drag handle has position: absolute
    // @ts-ignore
    dragHandler(e, editor)

    if (element) {
      element.dataset.dragging = 'true'
    }

    setTimeout(() => {
      if (element) {
        element.style.pointerEvents = 'none'
      }
    }, 0)
  }

  function onDragEnd(e: DragEvent) {
    onElementDragEnd?.(e)
    hideHandle()
    if (element) {
      element.style.pointerEvents = 'auto'
      element.dataset.dragging = 'false'
    }
  }

  element.addEventListener('dragstart', onDragStart)
  element.addEventListener('dragend', onDragEnd)

  wrapper.appendChild(element)

  return {
    unbind() {
      element.removeEventListener('dragstart', onDragStart)
      element.removeEventListener('dragend', onDragEnd)
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
        pendingMouseCoords = null
      }
    },
    plugin: new Plugin({
      key: typeof pluginKey === 'string' ? new PluginKey(pluginKey) : pluginKey,

      state: {
        init() {
          return { locked: false }
        },
        apply(tr: Transaction, value: PluginState, _oldState: EditorState, state: EditorState) {
          const isLocked = tr.getMeta('lockDragHandle')
          const hideDragHandle = tr.getMeta('hideDragHandle')

          if (isLocked !== undefined) {
            locked = isLocked
          }

          if (hideDragHandle) {
            hideHandle()

            locked = false
            currentNode = null
            currentNodePos = -1

            onNodeChange?.({ editor, node: null, pos: -1 })

            return value
          }

          // Something has changed and drag handler is visible…
          if (tr.docChanged && currentNodePos !== -1 && element) {
            const newPos = tr.mapping.map(currentNodePos)

            if (newPos !== currentNodePos) {
              currentNodePos = newPos
              // We will get the outer node with data and position in views update method.
            }
          }

          return value
        },
      },

      view: view => {
        element.draggable = true
        element.style.pointerEvents = 'auto'
        element.dataset.dragging = 'false'

        editor.view.dom.parentElement?.appendChild(wrapper)

        wrapper.style.pointerEvents = 'none'
        wrapper.style.position = 'absolute'
        wrapper.style.top = '0'
        wrapper.style.left = '0'

        return {
          update(_, oldState) {
            if (!element) {
              return
            }

            if (!editor.isEditable) {
              hideHandle()
              return
            }

            // Prevent element being draggend while being open.
            if (locked) {
              element.draggable = false
            } else {
              element.draggable = true
            }

            // Recalculate popup position if doc has changend and drag handler is visible.
            if (view.state.doc.eq(oldState.doc) || currentNodePos === -1) {
              return
            }

            // Get domNode from (new) position.
            let domNode = view.nodeDOM(currentNodePos) as HTMLElement

            // Since old element could have been wrapped, we need to find
            // the outer node and take its position and node data.
            domNode = getOuterDomNode(view, domNode)

            // Skip if domNode is editor dom.
            if (domNode === view.dom) {
              return
            }

            // We only want `Element`.
            if (domNode?.nodeType !== 1) {
              return
            }

            const domNodePos = view.posAtDOM(domNode, 0)
            const outerNode = getOuterNode(editor.state.doc, domNodePos)
            const outerNodePos = getOuterNodePos(editor.state.doc, domNodePos) // TODO: needed?

            currentNode = outerNode
            currentNodePos = outerNodePos

            onNodeChange?.({ editor, node: currentNode, pos: currentNodePos })

            repositionDragHandle(domNode as Element)
          },

          // TODO: Kills even on hot reload
          destroy() {
            if (rafId) {
              cancelAnimationFrame(rafId)
              rafId = null
              pendingMouseCoords = null
            }

            if (element) {
              removeNode(wrapper)
            }
          },
        }
      },

      props: {
        handleDOMEvents: {
          keydown(view) {
            if (!element || locked) {
              return false
            }

            if (view.hasFocus()) {
              hideHandle()
              currentNode = null
              currentNodePos = -1
              onNodeChange?.({ editor, node: null, pos: -1 })

              // We want to still continue with other keydown events.
              return false
            }

            return false
          },
          mouseleave(_view, e) {
            // Do not hide open popup on mouseleave.
            if (locked) {
              return false
            }

            // If e.target is not inside the wrapper, hide.
            if (e.target && !wrapper.contains(e.relatedTarget as HTMLElement)) {
              hideHandle()

              currentNode = null
              currentNodePos = -1

              onNodeChange?.({ editor, node: null, pos: -1 })
            }

            return false
          },

          mousemove(view, e) {
            // Do not continue if popup is not initialized or open.
            if (!element || locked) {
              return false
            }

            // Store latest mouse coords and schedule a single RAF per frame
            pendingMouseCoords = { x: e.clientX, y: e.clientY }

            if (rafId) {
              return false
            }

            rafId = requestAnimationFrame(() => {
              rafId = null

              if (!pendingMouseCoords) {
                return
              }

              const { x, y } = pendingMouseCoords
              pendingMouseCoords = null

              const nodeData = findElementNextToCoords({
                x,
                y,
                direction: 'right',
                editor,
              })

              // Skip if there is no node next to coords
              if (!nodeData.resultElement) {
                return
              }

              let domNode = nodeData.resultElement as HTMLElement

              domNode = getOuterDomNode(view, domNode)

              // Skip if domNode is editor dom.
              if (domNode === view.dom) {
                return
              }

              // We only want `Element`.
              if (domNode?.nodeType !== 1) {
                return
              }

              const domNodePos = view.posAtDOM(domNode, 0)
              const outerNode = getOuterNode(editor.state.doc, domNodePos)

              if (outerNode !== currentNode) {
                const outerNodePos = getOuterNodePos(editor.state.doc, domNodePos)

                currentNode = outerNode
                currentNodePos = outerNodePos

                onNodeChange?.({ editor, node: currentNode, pos: currentNodePos })

                // Set nodes clientRect.
                repositionDragHandle(domNode as Element)

                showHandle()
              }
            })

            return false
          },
        },
      },
    }),
  }
}
