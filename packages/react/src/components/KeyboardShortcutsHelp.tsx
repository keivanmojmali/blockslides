/**
 * Keyboard Shortcuts Help Component
 * 
 * Displays a modal overlay showing all available keyboard shortcuts
 * grouped by category.
 */

import type { KeyboardShortcut } from '@autoartifacts/core';
import { DEFAULT_SHORTCUTS, getKeyDisplay, isMacOS } from '@autoartifacts/core';

interface KeyboardShortcutsHelpProps {
  shortcuts?: Record<string, KeyboardShortcut>;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ 
  shortcuts = DEFAULT_SHORTCUTS, 
  onClose 
}: KeyboardShortcutsHelpProps) {
  const isMac = isMacOS();
  
  // Group shortcuts by category
  const groupedShortcuts = Object.values(shortcuts).reduce((acc, shortcut) => {
    const category = shortcut.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <div className="keyboard-shortcuts-overlay" onClick={onClose}>
      <div className="keyboard-shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>Keyboard Shortcuts</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close shortcuts help"
          >
            ×
          </button>
        </div>
        
        <div className="shortcuts-content">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="shortcuts-category">
              <h3>{category}</h3>
              <ul>
                {categoryShortcuts.map((shortcut) => (
                  <li key={shortcut.key}>
                    <span className="shortcut-description">
                      {shortcut.description}
                    </span>
                    <kbd className="shortcut-key">
                      {getKeyDisplay(shortcut.key, isMac)}
                    </kbd>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="shortcuts-footer">
          <p>Press <kbd>?</kbd> to toggle this help</p>
        </div>
      </div>
    </div>
  );
}

