/**
 * Layout Parser Tests
 * 
 * Tests for parseLayout and applyAllLayouts functions
 */

import { parseLayout, applyAllLayouts } from '../layoutParser';
import { createMockEditorElement, cleanupMockEditorElement } from '../../__tests__/testUtils';

describe('Layout Parser', () => {
  describe('parseLayout', () => {
    it('should parse simple equal layout', () => {
      const result = parseLayout('1-1', 2);
      expect(result).toEqual([1, 1]);
    });

    it('should parse 2-1 ratio layout', () => {
      const result = parseLayout('2-1', 2);
      expect(result).toEqual([2, 1]);
    });

    it('should parse 1-2 ratio layout', () => {
      const result = parseLayout('1-2', 2);
      expect(result).toEqual([1, 2]);
    });

    it('should parse three column equal layout', () => {
      const result = parseLayout('1-1-1', 3);
      expect(result).toEqual([1, 1, 1]);
    });

    it('should parse complex three column layout', () => {
      const result = parseLayout('5-3-2', 3);
      expect(result).toEqual([5, 3, 2]);
    });

    it('should parse single column layout', () => {
      const result = parseLayout('1', 1);
      expect(result).toEqual([1]);
    });

    it('should handle auto layout with equal distribution', () => {
      const result = parseLayout('auto', 3);
      expect(result).toEqual([1, 1, 1]);
    });

    it('should handle empty string with equal distribution', () => {
      const result = parseLayout('', 2);
      expect(result).toEqual([1, 1]);
    });

    it('should fallback to equal distribution for invalid format', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = parseLayout('invalid', 2);
      
      expect(result).toEqual([1, 1]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid layout format')
      );
      
      consoleSpy.mockRestore();
    });

    it('should fallback for layout with non-numeric values', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = parseLayout('a-b', 2);
      
      expect(result).toEqual([1, 1]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should warn and fallback when column count mismatch', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Layout has 3 parts but we expect 2 columns
      const result = parseLayout('1-1-1', 2);
      
      expect(result).toEqual([1, 1]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Layout \'1-1-1\' expects 3 column(s) but found 2')
      );
      
      consoleSpy.mockRestore();
    });

    it('should handle layouts with spaces gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = parseLayout('1 - 1', 2);
      
      // This is invalid format (spaces)
      expect(result).toEqual([1, 1]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle layouts with leading/trailing dashes', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result1 = parseLayout('-1-1', 2);
      const result2 = parseLayout('1-1-', 2);
      
      expect(result1).toEqual([1, 1]);
      expect(result2).toEqual([1, 1]);
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      
      consoleSpy.mockRestore();
    });

    it('should handle double dashes', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = parseLayout('1--1', 2);
      
      expect(result).toEqual([1, 1]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle zero values', () => {
      const result = parseLayout('0-1', 2);
      
      // 0 is technically valid in the format, but not useful
      expect(result).toEqual([0, 1]);
    });

    it('should handle large numbers', () => {
      const result = parseLayout('100-50', 2);
      expect(result).toEqual([100, 50]);
    });

    it('should handle four column layouts', () => {
      const result = parseLayout('1-2-3-4', 4);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should handle five column layouts', () => {
      const result = parseLayout('1-1-1-1-1', 5);
      expect(result).toEqual([1, 1, 1, 1, 1]);
    });
  });

  describe('applyAllLayouts', () => {
    let editorElement: HTMLElement;

    beforeEach(() => {
      editorElement = createMockEditorElement();
    });

    afterEach(() => {
      cleanupMockEditorElement(editorElement);
    });

    it('should apply layout styles to rows with layout attributes', () => {
      // Create a row with layout attribute
      const slide = document.createElement('div');
      slide.setAttribute('data-node-type', 'slide');
      
      const row = document.createElement('div');
      row.setAttribute('data-node-type', 'row');
      row.setAttribute('data-layout', '2-1');
      
      const col1 = document.createElement('div');
      col1.setAttribute('data-node-type', 'column');
      const col2 = document.createElement('div');
      col2.setAttribute('data-node-type', 'column');
      
      row.appendChild(col1);
      row.appendChild(col2);
      slide.appendChild(row);
      editorElement.appendChild(slide);
      
      applyAllLayouts(editorElement);
      
      // Check that flex styles were applied
      expect(col1.style.flex).toBeTruthy();
      expect(col2.style.flex).toBeTruthy();
    });

    it('should handle elements without layout attributes', () => {
      const slide = document.createElement('div');
      slide.setAttribute('data-node-type', 'slide');
      editorElement.appendChild(slide);
      
      // Should not throw
      expect(() => {
        applyAllLayouts(editorElement);
      }).not.toThrow();
    });

    it('should handle empty editor element', () => {
      expect(() => {
        applyAllLayouts(editorElement);
      }).not.toThrow();
    });

    it('should handle null editor element gracefully', () => {
      // applyAllLayouts will throw if given null - this is expected behavior
      // The function expects a valid HTMLElement
      expect(() => {
        applyAllLayouts(null as any);
      }).toThrow();
    });
  });
});

