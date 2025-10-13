/**
 * Layout Picker Plugin
 * 
 * Displays a visual template selector on empty/new slides.
 * Users can click a template to apply a specific column layout.
 * Framework-agnostic using ProseMirror widgets.
 */

import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { LayoutTemplate, DEFAULT_LAYOUTS } from './layoutPickerDefaults';
import { isSlideEmpty, extractContentBlocks, redistributeContent } from '../utils/contentRedistribution';
import { parseLayout, applyAllLayouts } from '../utils/layoutParser';

export interface LayoutPickerOptions {
  layouts?: LayoutTemplate[];          // Layout templates to show (default: DEFAULT_LAYOUTS)
  title?: string;                      // Title text (default: 'Untitled card')
  subtitle?: string;                   // Subtitle text (default: 'Or start with a template')
  className?: string;                  // Custom class for picker container
  style?: Record<string, string>;      // Custom inline styles for picker
  templateClassName?: string;          // Custom class for template cards
  templateStyle?: Record<string, string>; // Custom inline styles for templates
  iconMaxWidth?: string;               // Max width for icons (default: '100px')
  onLayoutSelect?: (layoutId: string, slideElement: HTMLElement) => void; // Custom handler
}

/**
 * Creates a layout picker plugin
 * 
 * @param options - Configuration options
 * @returns ProseMirror plugin
 */
export function createLayoutPickerPlugin(options: LayoutPickerOptions = {}): Plugin {
  const {
    layouts = DEFAULT_LAYOUTS,
    title = 'Untitled card',
    subtitle = 'Or start with a template',
    className = '',
    style = {},
    templateClassName = '',
    templateStyle = {},
    iconMaxWidth = '100px',
    onLayoutSelect
  } = options;

  return new Plugin({
    props: {
      decorations(state) {
        const decorations: Decoration[] = [];
        
        // Find all empty slides
        state.doc.forEach((node, offset) => {
          if (node.type.name === 'slide' && isSlideEmpty(node)) {
            // Create widget at the start of the slide
            const widget = Decoration.widget(offset + 1, () => {
              return createLayoutPickerWidget(
                layouts,
                title,
                subtitle,
                className,
                style,
                templateClassName,
                templateStyle,
                iconMaxWidth,
                onLayoutSelect,
                offset
              );
            }, {
              side: 1,
              ignoreSelection: true
            });
            
            decorations.push(widget);
          }
        });
        
        return DecorationSet.create(state.doc, decorations);
      }
    }
  });
}

/**
 * Creates the layout picker widget DOM element
 */
function createLayoutPickerWidget(
  layouts: LayoutTemplate[],
  title: string,
  subtitle: string,
  className: string,
  style: Record<string, string>,
  templateClassName: string,
  templateStyle: Record<string, string>,
  iconMaxWidth: string,
  onLayoutSelect: ((layoutId: string, slideElement: HTMLElement) => void) | undefined,
  slideOffset: number
): HTMLElement {
  // Create main container
  const container = document.createElement('div');
  container.className = `layout-picker ${className}`.trim();
  container.contentEditable = 'false';
  
  // Apply custom styles
  Object.entries(style).forEach(([key, value]) => {
    container.style[key as any] = value;
  });
  
  // Create title
  const titleEl = document.createElement('h2');
  titleEl.className = 'layout-picker-title';
  titleEl.textContent = title;
  container.appendChild(titleEl);
  
  // Create subtitle
  const subtitleEl = document.createElement('p');
  subtitleEl.className = 'layout-picker-subtitle';
  subtitleEl.textContent = subtitle;
  container.appendChild(subtitleEl);
  
  // Create templates container
  const templatesContainer = document.createElement('div');
  templatesContainer.className = 'layout-picker-templates';
  container.appendChild(templatesContainer);
  
  // Create template cards
  layouts.forEach((layout) => {
    const card = document.createElement('div');
    card.className = `layout-template ${templateClassName}`.trim();
    card.setAttribute('data-layout-id', layout.id);
    
    // Apply custom template styles
    Object.entries(templateStyle).forEach(([key, value]) => {
      card.style[key as any] = value;
    });
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'layout-template-icon';
    iconContainer.style.maxWidth = iconMaxWidth;
    iconContainer.innerHTML = layout.icon;
    card.appendChild(iconContainer);
    
    // Create label
    const label = document.createElement('span');
    label.className = 'layout-template-label';
    label.textContent = layout.label;
    card.appendChild(label);
    
    // Add click handler
    card.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Get the editor view and slide element
      const editorView = getEditorViewFromEvent(event);
      if (!editorView) {
        console.warn('[AutoArtifacts] Could not find editor view');
        return;
      }
      
      const slideElement = card.closest('[data-node-type="slide"]') as HTMLElement;
      
      if (onLayoutSelect) {
        // Use custom handler
        onLayoutSelect(layout.id, slideElement);
      } else {
        // Default behavior: apply the layout using setSlideLayout command
        // Find the slide position and set cursor there
        const slidePos = findSlidePosition(editorView, slideOffset);
        if (slidePos !== null) {
          // Set selection inside the slide
          const tr = editorView.state.tr.setSelection(
            editorView.state.selection.constructor.near(
              editorView.state.doc.resolve(slidePos + 2)
            ) as any
          );
          editorView.dispatch(tr);
          
          // Apply the layout
          // Get commands from editor - we need to access it via a global or ref
          // For now, we'll dispatch a transaction to apply the layout directly
          applySlideLayoutDirect(editorView, slideOffset, layout.id);
        }
      }
    });
    
    templatesContainer.appendChild(card);
  });
  
  return container;
}

/**
 * Gets the EditorView from a DOM event
 */
function getEditorViewFromEvent(event: Event): any {
  let target = event.target as HTMLElement | null;
  while (target) {
    if ((target as any).pmView) {
      return (target as any).pmView;
    }
    if (target.classList?.contains('ProseMirror')) {
      // Found the ProseMirror element, check parent
      if ((target.parentElement as any)?.pmViewDesc?.view) {
        return (target.parentElement as any).pmViewDesc.view;
      }
    }
    target = target.parentElement;
  }
  return null;
}

/**
 * Finds the position of a slide by its offset
 */
function findSlidePosition(view: any, slideOffset: number): number | null {
  try {
    return slideOffset;
  } catch (e) {
    return null;
  }
}

/**
 * Applies slide layout directly using transaction
 * This is called when no custom handler is provided
 */
function applySlideLayoutDirect(view: any, slideOffset: number, layout: string): void {
  try {
    const state = view.state;
    const $pos = state.doc.resolve(slideOffset + 1);
    
    // Find the slide node
    let slideDepth = -1;
    for (let d = $pos.depth; d >= 0; d--) {
      if ($pos.node(d).type.name === 'slide') {
        slideDepth = d;
        break;
      }
    }
    
    if (slideDepth === -1) {
      console.warn('[AutoArtifacts] Slide not found');
      return;
    }
    
    const slideNode = $pos.node(slideDepth);
    const slidePos = $pos.before(slideDepth);
    
    // Parse layout
    const columnCount = layout.split('-').length;
    const ratios = parseLayout(layout, columnCount);
    
    if (!ratios || ratios.length === 0) {
      console.warn('[AutoArtifacts] Invalid layout format');
      return;
    }
    
    // Extract and redistribute content
    const existingBlocks = extractContentBlocks(slideNode);
    const newColumns = redistributeContent(existingBlocks, columnCount, state.schema);
    
    if (newColumns.length === 0) {
      console.error('[AutoArtifacts] Failed to create columns');
      return;
    }
    
    // Create new row and slide
    const rowType = state.schema.nodes.row;
    const slideType = state.schema.nodes.slide;
    
    if (!rowType || !slideType) {
      console.error('[AutoArtifacts] Missing node types');
      return;
    }
    
    const newRow = rowType.create({ layout }, newColumns);
    const newSlide = slideType.create({ ...slideNode.attrs, layout }, [newRow]);
    
    // Replace the slide
    const tr = state.tr.replaceRangeWith(
      slidePos,
      slidePos + slideNode.nodeSize,
      newSlide
    );
    
    view.dispatch(tr);
    
    // Apply layout styles
    setTimeout(() => {
      applyAllLayouts(view.dom);
    }, 0);
  } catch (error) {
    console.error('[AutoArtifacts] Error applying layout:', error);
  }
}

