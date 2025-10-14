/**
 * Media Commands Tests
 * 
 * Tests for media and link commands: insertImage, insertVideo, setLink, toggleBulletList, etc.
 */

import { createTestEditor, typeText, hasMarkInRange } from '../../__tests__/testUtils';
import { createCommands } from '../index';
import { TextSelection } from 'prosemirror-state';

describe('Media Commands', () => {
  describe('Link Commands', () => {
    describe('setLink', () => {
      it('should add link to selection', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Click here');
        
        // Select the text
        const from = 6;
        const to = from + 10;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = commands.setLink('https://example.com');
        
        expect(result).toBe(true);
        expect(hasMarkInRange(view.state.doc, from, to, 'link')).toBe(true);
      });

      it('should add link with title', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Link text');
        
        const from = 6;
        const to = from + 9;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = commands.setLink('https://example.com', 'Example Site');
        
        expect(result).toBe(true);
        expect(hasMarkInRange(view.state.doc, from, to, 'link')).toBe(true);
      });

      it('should return false when nothing is selected', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        // No selection (cursor at same position)
        const pos = 6;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, pos));
        view.dispatch(tr);
        
        const result = commands.setLink('https://example.com');
        
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const commands = createCommands(() => null);
        expect(commands.setLink('https://example.com')).toBe(false);
      });
    });

    describe('updateLink', () => {
      it('should update existing link', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Link');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        // Add initial link
        commands.setLink('https://old.com');
        
        // Update link
        const result = commands.updateLink('https://new.com');
        
        expect(result).toBe(true);
        expect(hasMarkInRange(view.state.doc, from, to, 'link')).toBe(true);
      });

      it('should work same as setLink', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = commands.updateLink('https://example.com', 'Title');
        
        expect(result).toBe(true);
      });
    });

    describe('removeLink', () => {
      it('should remove link from selection', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Link');
        
        const from = 6;
        const to = from + 4;
        let tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        // Add link
        commands.setLink('https://example.com');
        expect(hasMarkInRange(view.state.doc, from, to, 'link')).toBe(true);
        
        // Select text again (needed after link insertion)
        tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        // Remove link
        const result = commands.removeLink();
        
        expect(result).toBe(true);
        expect(hasMarkInRange(view.state.doc, from, to, 'link')).toBe(false);
      });

      it('should work even when no link exists', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = commands.removeLink();
        
        expect(result).toBe(true);
      });

      it('should return false when view is null', () => {
        const commands = createCommands(() => null);
        expect(commands.removeLink()).toBe(false);
      });
    });
  });

  describe('List Commands', () => {
    describe('toggleBulletList', () => {
      it('should return false as not implemented', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        const result = commands.toggleBulletList();
        
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const commands = createCommands(() => null);
        expect(commands.toggleBulletList()).toBe(false);
      });
    });

    describe('toggleOrderedList', () => {
      it('should return false as not implemented', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        const result = commands.toggleOrderedList();
        
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const commands = createCommands(() => null);
        expect(commands.toggleOrderedList()).toBe(false);
      });
    });
  });

  describe('Image Commands', () => {
    describe('insertImage', () => {
      it('should insert image node', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        const imageAttrs = {
          src: 'https://example.com/image.jpg',
          alt: 'Test image'
        };
        
        const result = commands.insertImage(imageAttrs);
        
        expect(result).toBe(true);
        // Check that document now contains an image
        let hasImage = false;
        view.state.doc.descendants(node => {
          if (node.type.name === 'image') {
            hasImage = true;
            return false;
          }
        });
        expect(hasImage).toBe(true);
      });

      it('should insert image with various attributes', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        const imageAttrs = {
          src: 'https://example.com/image.jpg',
          alt: 'Description',
          title: 'Image Title',
          width: 500,
          height: 300
        };
        
        const result = commands.insertImage(imageAttrs);
        
        expect(result).toBe(true);
      });

      it('should replace selection with image', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Replace me');
        
        // Select text
        const from = 6;
        const to = from + 10;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = commands.insertImage({ src: 'image.jpg' });
        
        expect(result).toBe(true);
        // Text should be replaced
        expect(view.state.doc.textContent).not.toContain('Replace me');
      });

      it('should return false when view is null', () => {
        const commands = createCommands(() => null);
        expect(commands.insertImage({ src: 'image.jpg' })).toBe(false);
      });
    });
  });

  describe('Video Commands', () => {
    describe('insertVideo', () => {
      it('should insert video node', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        const videoAttrs = {
          src: 'https://example.com/video.mp4'
        };
        
        const result = commands.insertVideo(videoAttrs);
        
        expect(result).toBe(true);
        // Check that document now contains a video
        let hasVideo = false;
        view.state.doc.descendants(node => {
          if (node.type.name === 'video') {
            hasVideo = true;
            return false;
          }
        });
        expect(hasVideo).toBe(true);
      });

      it('should insert video with various attributes', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        const videoAttrs = {
          src: 'https://example.com/video.mp4',
          poster: 'https://example.com/poster.jpg',
          width: 640,
          height: 480
        };
        
        const result = commands.insertVideo(videoAttrs);
        
        expect(result).toBe(true);
      });

      it('should replace selection with video', () => {
        const { view } = createTestEditor();
        const commands = createCommands(() => view);
        
        typeText(view, 'Replace me');
        
        const from = 6;
        const to = from + 10;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = commands.insertVideo({ src: 'video.mp4' });
        
        expect(result).toBe(true);
        expect(view.state.doc.textContent).not.toContain('Replace me');
      });

      it('should return false when view is null', () => {
        const commands = createCommands(() => null);
        expect(commands.insertVideo({ src: 'video.mp4' })).toBe(false);
      });
    });
  });

  describe('Media integration', () => {
    it('should allow inserting multiple media types', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Insert image
      expect(commands.insertImage({ src: 'image1.jpg' })).toBe(true);
      
      // Insert video
      expect(commands.insertVideo({ src: 'video1.mp4' })).toBe(true);
      
      // Verify both exist
      let imageCount = 0;
      let videoCount = 0;
      
      view.state.doc.descendants(node => {
        if (node.type.name === 'image') imageCount++;
        if (node.type.name === 'video') videoCount++;
      });
      
      expect(imageCount).toBeGreaterThan(0);
      expect(videoCount).toBeGreaterThan(0);
    });
  });
});

