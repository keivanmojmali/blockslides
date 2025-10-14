/**
 * Tests for keyboard shortcuts functionality
 */

import { DEFAULT_SHORTCUTS, getKeyDisplay, isMacOS } from '../defaultShortcuts';

describe('Keyboard Shortcuts', () => {
  describe('DEFAULT_SHORTCUTS', () => {
    it('should define shortcuts for all text formatting commands', () => {
      expect(DEFAULT_SHORTCUTS['Mod-b']).toEqual({
        key: 'Mod-b',
        command: 'toggleBold',
        description: 'Toggle bold',
        category: 'Formatting'
      });

      expect(DEFAULT_SHORTCUTS['Mod-i']).toEqual({
        key: 'Mod-i',
        command: 'toggleItalic',
        description: 'Toggle italic',
        category: 'Formatting'
      });

      expect(DEFAULT_SHORTCUTS['Mod-u']).toEqual({
        key: 'Mod-u',
        command: 'toggleUnderline',
        description: 'Toggle underline',
        category: 'Formatting'
      });

      expect(DEFAULT_SHORTCUTS['Mod-`']).toEqual({
        key: 'Mod-`',
        command: 'toggleCode',
        description: 'Inline code',
        category: 'Formatting'
      });
    });

    it('should define shortcuts for heading commands', () => {
      expect(DEFAULT_SHORTCUTS['Mod-Alt-1']).toEqual({
        key: 'Mod-Alt-1',
        command: 'setHeading1',
        description: 'Heading 1',
        category: 'Headings'
      });

      expect(DEFAULT_SHORTCUTS['Mod-Alt-2']).toEqual({
        key: 'Mod-Alt-2',
        command: 'setHeading2',
        description: 'Heading 2',
        category: 'Headings'
      });

      expect(DEFAULT_SHORTCUTS['Mod-Alt-3']).toEqual({
        key: 'Mod-Alt-3',
        command: 'setHeading3',
        description: 'Heading 3',
        category: 'Headings'
      });

      expect(DEFAULT_SHORTCUTS['Mod-Alt-0']).toEqual({
        key: 'Mod-Alt-0',
        command: 'setParagraph',
        description: 'Paragraph',
        category: 'Headings'
      });
    });

    it('should define shortcuts for history commands', () => {
      expect(DEFAULT_SHORTCUTS['Mod-z']).toEqual({
        key: 'Mod-z',
        command: 'undo',
        description: 'Undo',
        category: 'History'
      });

      expect(DEFAULT_SHORTCUTS['Mod-y']).toEqual({
        key: 'Mod-y',
        command: 'redo',
        description: 'Redo',
        category: 'History'
      });

      expect(DEFAULT_SHORTCUTS['Mod-Shift-z']).toEqual({
        key: 'Mod-Shift-z',
        command: 'redo',
        description: 'Redo',
        category: 'History'
      });
    });

    it('should define shortcuts for selection commands', () => {
      expect(DEFAULT_SHORTCUTS['Mod-a']).toEqual({
        key: 'Mod-a',
        command: 'selectAll',
        description: 'Select all',
        category: 'Selection'
      });
    });

    it('should define shortcuts for slide commands', () => {
      expect(DEFAULT_SHORTCUTS['Mod-Enter']).toEqual({
        key: 'Mod-Enter',
        command: 'addSlide',
        description: 'Add slide',
        category: 'Slides'
      });
    });

    it('should have valid structure for all shortcuts', () => {
      Object.entries(DEFAULT_SHORTCUTS).forEach(([key, shortcut]) => {
        expect(shortcut.key).toBe(key);
        expect(typeof shortcut.command).toBe('string');
        expect(typeof shortcut.description).toBe('string');
        expect(typeof shortcut.category).toBe('string');
        expect(shortcut.command).toBeTruthy();
        expect(shortcut.description).toBeTruthy();
        expect(shortcut.category).toBeTruthy();
      });
    });

    it('should categorize shortcuts properly', () => {
      const categories = new Set(
        Object.values(DEFAULT_SHORTCUTS).map(s => s.category)
      );

      expect(categories).toContain('Formatting');
      expect(categories).toContain('Headings');
      expect(categories).toContain('History');
      expect(categories).toContain('Selection');
      expect(categories).toContain('Slides');
    });

    it('should have unique command keys', () => {
      const keys = Object.keys(DEFAULT_SHORTCUTS);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it('should map all shortcuts to valid commands', () => {
      const validCommands = [
        'toggleBold',
        'toggleItalic',
        'toggleUnderline',
        'toggleCode',
        'setHeading1',
        'setHeading2',
        'setHeading3',
        'setParagraph',
        'undo',
        'redo',
        'selectAll',
        'addSlide'
      ];

      Object.values(DEFAULT_SHORTCUTS).forEach(shortcut => {
        expect(validCommands).toContain(shortcut.command);
      });
    });
  });

  describe('getKeyDisplay', () => {
    describe('Mac platform', () => {
      it('should convert Mod to Command symbol', () => {
        expect(getKeyDisplay('Mod-b', true)).toBe('⌘-b');
        expect(getKeyDisplay('Mod-i', true)).toBe('⌘-i');
      });

      it('should convert Shift to Shift symbol', () => {
        expect(getKeyDisplay('Mod-Shift-z', true)).toBe('⌘-⇧-z');
        expect(getKeyDisplay('Shift-Enter', true)).toBe('⇧-↵');
      });

      it('should convert Alt to Option symbol', () => {
        expect(getKeyDisplay('Mod-Alt-1', true)).toBe('⌘-⌥-1');
        expect(getKeyDisplay('Alt-Enter', true)).toBe('⌥-↵');
      });

      it('should convert Enter to return symbol', () => {
        expect(getKeyDisplay('Mod-Enter', true)).toBe('⌘-↵');
        expect(getKeyDisplay('Enter', true)).toBe('↵');
      });

      it('should convert Space to space symbol', () => {
        expect(getKeyDisplay('Space', true)).toBe('␣');
        expect(getKeyDisplay('Mod-Space', true)).toBe('⌘-␣');
      });

      it('should convert arrow keys to arrow symbols', () => {
        expect(getKeyDisplay('ArrowRight', true)).toBe('→');
        expect(getKeyDisplay('ArrowLeft', true)).toBe('←');
        expect(getKeyDisplay('ArrowUp', true)).toBe('↑');
        expect(getKeyDisplay('ArrowDown', true)).toBe('↓');
      });

      it('should convert delete keys to symbols', () => {
        expect(getKeyDisplay('Backspace', true)).toBe('⌫');
        expect(getKeyDisplay('Delete', true)).toBe('⌦');
      });

      it('should convert Escape to Esc', () => {
        expect(getKeyDisplay('Escape', true)).toBe('Esc');
      });

      it('should convert Tab to tab symbol', () => {
        expect(getKeyDisplay('Tab', true)).toBe('⇥');
        expect(getKeyDisplay('Shift-Tab', true)).toBe('⇧-⇥');
      });

      it('should handle complex key combinations', () => {
        expect(getKeyDisplay('Mod-Shift-Alt-Enter', true)).toBe('⌘-⇧-⌥-↵');
      });
    });

    describe('Windows/Linux platform', () => {
      it('should convert Mod to Ctrl', () => {
        expect(getKeyDisplay('Mod-b', false)).toBe('Ctrl-b');
        expect(getKeyDisplay('Mod-i', false)).toBe('Ctrl-i');
      });

      it('should keep Shift as Shift', () => {
        expect(getKeyDisplay('Mod-Shift-z', false)).toBe('Ctrl-Shift-z');
        expect(getKeyDisplay('Shift-Enter', false)).toBe('Shift-↵');
      });

      it('should keep Alt as Alt', () => {
        expect(getKeyDisplay('Mod-Alt-1', false)).toBe('Ctrl-Alt-1');
        expect(getKeyDisplay('Alt-Enter', false)).toBe('Alt-↵');
      });

      it('should convert special keys to symbols', () => {
        expect(getKeyDisplay('Enter', false)).toBe('↵');
        expect(getKeyDisplay('Space', false)).toBe('␣');
        expect(getKeyDisplay('Tab', false)).toBe('⇥');
        expect(getKeyDisplay('Escape', false)).toBe('Esc');
      });

      it('should convert arrow and delete keys', () => {
        expect(getKeyDisplay('ArrowRight', false)).toBe('→');
        expect(getKeyDisplay('ArrowLeft', false)).toBe('←');
        expect(getKeyDisplay('ArrowUp', false)).toBe('↑');
        expect(getKeyDisplay('ArrowDown', false)).toBe('↓');
        expect(getKeyDisplay('Backspace', false)).toBe('⌫');
        expect(getKeyDisplay('Delete', false)).toBe('⌦');
      });

      it('should handle complex key combinations', () => {
        expect(getKeyDisplay('Mod-Shift-Alt-Enter', false)).toBe('Ctrl-Shift-Alt-↵');
      });
    });

    describe('default behavior (no platform specified)', () => {
      it('should default to non-Mac display', () => {
        expect(getKeyDisplay('Mod-b')).toBe('Ctrl-b');
        expect(getKeyDisplay('Mod-Shift-z')).toBe('Ctrl-Shift-z');
      });
    });

    describe('edge cases', () => {
      it('should handle empty string', () => {
        expect(getKeyDisplay('')).toBe('');
        expect(getKeyDisplay('', true)).toBe('');
      });

      it('should handle single characters', () => {
        expect(getKeyDisplay('a')).toBe('a');
        expect(getKeyDisplay('b', true)).toBe('b');
      });

      it('should handle keys without modifiers', () => {
        expect(getKeyDisplay('Enter')).toBe('↵');
        expect(getKeyDisplay('Space')).toBe('␣');
      });

      it('should not affect unmatched patterns', () => {
        expect(getKeyDisplay('Custom-Key')).toBe('Custom-Key');
        expect(getKeyDisplay('Unknown', true)).toBe('Unknown');
      });
    });

    describe('real shortcut examples', () => {
      it('should format all default shortcuts correctly for Mac', () => {
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-b'].key, true)).toBe('⌘-b');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-i'].key, true)).toBe('⌘-i');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-Alt-1'].key, true)).toBe('⌘-⌥-1');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-Shift-z'].key, true)).toBe('⌘-⇧-z');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-Enter'].key, true)).toBe('⌘-↵');
      });

      it('should format all default shortcuts correctly for Windows/Linux', () => {
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-b'].key, false)).toBe('Ctrl-b');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-i'].key, false)).toBe('Ctrl-i');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-Alt-1'].key, false)).toBe('Ctrl-Alt-1');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-Shift-z'].key, false)).toBe('Ctrl-Shift-z');
        expect(getKeyDisplay(DEFAULT_SHORTCUTS['Mod-Enter'].key, false)).toBe('Ctrl-↵');
      });
    });
  });

  describe('isMacOS', () => {
    const originalPlatform = navigator.platform;

    afterEach(() => {
      // Restore original platform
      Object.defineProperty(navigator, 'platform', {
        value: originalPlatform,
        writable: true,
        configurable: true
      });
    });

    it('should return true for Mac platform', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'MacIntel',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(true);
    });

    it('should return true for iPhone platform', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'iPhone',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(true);
    });

    it('should return true for iPad platform', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'iPad',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(true);
    });

    it('should return true for iPod platform', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'iPod',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(true);
    });

    it('should return false for Windows platform', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(false);
    });

    it('should return false for Linux platform', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'Linux x86_64',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(false);
    });

    it('should return false for Android platform', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'Android',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(false);
    });

    it('should be case sensitive', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'mac',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(false);
    });

    it('should handle partial matches correctly', () => {
      Object.defineProperty(navigator, 'platform', {
        value: 'MacBook Pro',
        writable: true,
        configurable: true
      });
      expect(isMacOS()).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('should display all shortcuts with proper formatting', () => {
      const isMac = isMacOS();
      
      Object.entries(DEFAULT_SHORTCUTS).forEach(([key, shortcut]) => {
        const display = getKeyDisplay(shortcut.key, isMac);
        
        // Display should not be empty
        expect(display).toBeTruthy();
        
        // Display should be different from raw key (unless it's a simple key)
        if (key.includes('Mod') || key.includes('Alt') || key.includes('Enter')) {
          expect(display).not.toBe(key);
        }
      });
    });

    it('should provide consistent shortcuts across categories', () => {
      const formattingShortcuts = Object.values(DEFAULT_SHORTCUTS)
        .filter(s => s.category === 'Formatting');
      
      expect(formattingShortcuts.length).toBeGreaterThan(0);
      
      formattingShortcuts.forEach(shortcut => {
        expect(shortcut.key).toMatch(/^Mod-/);
      });
    });

    it('should have valid command names that match command API', () => {
      // These should match the command names from the commands API
      const commandNames = Object.values(DEFAULT_SHORTCUTS).map(s => s.command);
      
      expect(commandNames).toContain('toggleBold');
      expect(commandNames).toContain('toggleItalic');
      expect(commandNames).toContain('undo');
      expect(commandNames).toContain('redo');
      expect(commandNames).toContain('selectAll');
      expect(commandNames).toContain('addSlide');
    });
  });
});

