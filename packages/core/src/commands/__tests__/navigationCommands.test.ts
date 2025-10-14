/**
 * Navigation Commands Tests
 * 
 * Tests for slide navigation commands: nextSlide, prevSlide, goToSlide, etc.
 */

import { createTestEditor, getSlideCount } from '../../__tests__/testUtils';
import { createCommands } from '../index';

describe('Navigation Commands', () => {
  describe('nextSlide', () => {
    it('should call navigation utility', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      // This command returns void, just ensure it doesn't throw
      expect(() => commands.nextSlide()).not.toThrow();
    });

    it('should accept navigation options', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.nextSlide({ circular: true })).not.toThrow();
    });

    it('should handle null view gracefully', () => {
      const commands = createCommands(() => null);
      expect(() => commands.nextSlide()).not.toThrow();
    });
  });

  describe('prevSlide', () => {
    it('should call navigation utility', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.prevSlide()).not.toThrow();
    });

    it('should accept navigation options', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.prevSlide({ circular: false })).not.toThrow();
    });

    it('should handle null view gracefully', () => {
      const commands = createCommands(() => null);
      expect(() => commands.prevSlide()).not.toThrow();
    });
  });

  describe('goToSlide', () => {
    it('should accept slide index', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.goToSlide(1)).not.toThrow();
    });

    it('should accept navigation options', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.goToSlide(2, { transition: 'fade', duration: 300 })).not.toThrow();
    });

    it('should handle null view gracefully', () => {
      const commands = createCommands(() => null);
      expect(() => commands.goToSlide(0)).not.toThrow();
    });
  });

  describe('goToFirstSlide', () => {
    it('should navigate to first slide', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.goToFirstSlide()).not.toThrow();
    });

    it('should accept navigation options', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.goToFirstSlide({ transition: 'none' })).not.toThrow();
    });

    it('should handle null view gracefully', () => {
      const commands = createCommands(() => null);
      expect(() => commands.goToFirstSlide()).not.toThrow();
    });
  });

  describe('goToLastSlide', () => {
    it('should navigate to last slide', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.goToLastSlide()).not.toThrow();
    });

    it('should accept navigation options', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(() => commands.goToLastSlide({ transition: 'slide', duration: 500 })).not.toThrow();
    });

    it('should handle null view gracefully', () => {
      const commands = createCommands(() => null);
      expect(() => commands.goToLastSlide()).not.toThrow();
    });
  });

  describe('canGoNext', () => {
    it('should return boolean', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      const result = commands.canGoNext();
      expect(typeof result).toBe('boolean');
    });

    it('should accept circular parameter', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      const result = commands.canGoNext(true);
      expect(typeof result).toBe('boolean');
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.canGoNext()).toBe(false);
    });
  });

  describe('canGoPrev', () => {
    it('should return boolean', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      const result = commands.canGoPrev();
      expect(typeof result).toBe('boolean');
    });

    it('should accept circular parameter', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      const result = commands.canGoPrev(false);
      expect(typeof result).toBe('boolean');
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.canGoPrev()).toBe(false);
    });
  });

  describe('getSlideInfo', () => {
    it('should return slide info object', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      const info = commands.getSlideInfo();
      
      expect(info).toHaveProperty('index');
      expect(info).toHaveProperty('total');
      expect(info).toHaveProperty('isFirst');
      expect(info).toHaveProperty('isLast');
      expect(info).toHaveProperty('canGoNext');
      expect(info).toHaveProperty('canGoPrev');
    });

    it('should return default info when view is null', () => {
      const commands = createCommands(() => null);
      const info = commands.getSlideInfo();
      
      expect(info).toEqual({
        index: 0,
        total: 0,
        isFirst: true,
        isLast: true,
        canGoNext: false,
        canGoPrev: false
      });
    });

    it('should have correct types', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      const info = commands.getSlideInfo();
      
      expect(typeof info.index).toBe('number');
      expect(typeof info.total).toBe('number');
      expect(typeof info.isFirst).toBe('boolean');
      expect(typeof info.isLast).toBe('boolean');
      expect(typeof info.canGoNext).toBe('boolean');
      expect(typeof info.canGoPrev).toBe('boolean');
    });
  });
});

