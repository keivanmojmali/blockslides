/**
 * Default Keyboard Shortcuts
 * 
 * Defines all default keyboard shortcuts for the editor.
 */

import type { KeyboardShortcut } from '../types/index';

/**
 * Default keyboard shortcuts
 */
export const DEFAULT_SHORTCUTS: Record<string, KeyboardShortcut> = {
  // Text formatting
  'Mod-b': {
    key: 'Mod-b',
    command: 'toggleBold',
    description: 'Toggle bold',
    category: 'Formatting'
  },
  'Mod-i': {
    key: 'Mod-i',
    command: 'toggleItalic',
    description: 'Toggle italic',
    category: 'Formatting'
  },
  'Mod-u': {
    key: 'Mod-u',
    command: 'toggleUnderline',
    description: 'Toggle underline',
    category: 'Formatting'
  },
  'Mod-`': {
    key: 'Mod-`',
    command: 'toggleCode',
    description: 'Inline code',
    category: 'Formatting'
  },
  
  // Headings
  'Mod-Alt-1': {
    key: 'Mod-Alt-1',
    command: 'setHeading1',
    description: 'Heading 1',
    category: 'Headings'
  },
  'Mod-Alt-2': {
    key: 'Mod-Alt-2',
    command: 'setHeading2',
    description: 'Heading 2',
    category: 'Headings'
  },
  'Mod-Alt-3': {
    key: 'Mod-Alt-3',
    command: 'setHeading3',
    description: 'Heading 3',
    category: 'Headings'
  },
  'Mod-Alt-0': {
    key: 'Mod-Alt-0',
    command: 'setParagraph',
    description: 'Paragraph',
    category: 'Headings'
  },
  
  // History
  'Mod-z': {
    key: 'Mod-z',
    command: 'undo',
    description: 'Undo',
    category: 'History'
  },
  'Mod-y': {
    key: 'Mod-y',
    command: 'redo',
    description: 'Redo',
    category: 'History'
  },
  'Mod-Shift-z': {
    key: 'Mod-Shift-z',
    command: 'redo',
    description: 'Redo',
    category: 'History'
  },
  
  // Selection
  'Mod-a': {
    key: 'Mod-a',
    command: 'selectAll',
    description: 'Select all',
    category: 'Selection'
  },
  
  // Slides
  'Mod-Enter': {
    key: 'Mod-Enter',
    command: 'addSlide',
    description: 'Add slide',
    category: 'Slides'
  },
};

/**
 * Get human-readable key representation
 * Converts key notation to platform-specific symbols
 */
export function getKeyDisplay(key: string, isMac: boolean = false): string {
  return key
    .replace(/Mod/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Shift/g, isMac ? '⇧' : 'Shift')
    .replace(/Alt/g, isMac ? '⌥' : 'Alt')
    .replace(/Enter/g, '↵')
    .replace(/Space/g, '␣')
    .replace(/ArrowRight/g, '→')
    .replace(/ArrowLeft/g, '←')
    .replace(/ArrowUp/g, '↑')
    .replace(/ArrowDown/g, '↓')
    .replace(/Backspace/g, '⌫')
    .replace(/Delete/g, '⌦')
    .replace(/Escape/g, 'Esc')
    .replace(/Tab/g, '⇥');
}

/**
 * Detect if running on Mac
 */
export function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

