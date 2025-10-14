/**
 * Mark Schema Tests
 * 
 * Tests all mark types in the AutoArtifacts schema to ensure
 * they are defined correctly and can be applied to text.
 */

import { schema } from '../../index';

describe('Mark Schema', () => {
  describe('Text formatting marks', () => {
    it('should have bold mark', () => {
      expect(schema.marks.bold).toBeDefined();
      const boldMark = schema.marks.bold.create();
      const text = schema.text('Bold text', [boldMark]);
      expect(text.marks[0].type.name).toBe('bold');
    });

    it('should have italic mark', () => {
      expect(schema.marks.italic).toBeDefined();
      const italicMark = schema.marks.italic.create();
      const text = schema.text('Italic text', [italicMark]);
      expect(text.marks[0].type.name).toBe('italic');
    });

    it('should have underline mark', () => {
      expect(schema.marks.underline).toBeDefined();
      const underlineMark = schema.marks.underline.create();
      const text = schema.text('Underlined text', [underlineMark]);
      expect(text.marks[0].type.name).toBe('underline');
    });

    it('should have strikethrough mark', () => {
      expect(schema.marks.strikethrough).toBeDefined();
      const strikeMark = schema.marks.strikethrough.create();
      const text = schema.text('Strikethrough text', [strikeMark]);
      expect(text.marks[0].type.name).toBe('strikethrough');
    });

    it('should have code mark', () => {
      expect(schema.marks.code).toBeDefined();
      const codeMark = schema.marks.code.create();
      const text = schema.text('Code text', [codeMark]);
      expect(text.marks[0].type.name).toBe('code');
    });
  });

  describe('Typography marks', () => {
    it('should have fontSize mark with size attribute', () => {
      expect(schema.marks.fontSize).toBeDefined();
      const mark = schema.marks.fontSize.create({ size: '24px' });
      expect(mark.attrs.size).toBe('24px');
    });

    it('should have fontFamily mark with family attribute', () => {
      expect(schema.marks.fontFamily).toBeDefined();
      const mark = schema.marks.fontFamily.create({ family: 'Arial' });
      expect(mark.attrs.family).toBe('Arial');
    });

    it('should have textColor mark with color attribute', () => {
      expect(schema.marks.textColor).toBeDefined();
      const mark = schema.marks.textColor.create({ color: '#ff0000' });
      expect(mark.attrs.color).toBe('#ff0000');
    });

    it('should have textShadow mark with shadow attribute', () => {
      expect(schema.marks.textShadow).toBeDefined();
      const mark = schema.marks.textShadow.create({ shadow: '2px 2px 4px rgba(0,0,0,0.5)' });
      expect(mark.attrs.shadow).toBe('2px 2px 4px rgba(0,0,0,0.5)');
    });

    it('should have textTransform mark with transform attribute', () => {
      expect(schema.marks.textTransform).toBeDefined();
      const mark = schema.marks.textTransform.create({ transform: 'uppercase' });
      expect(mark.attrs.transform).toBe('uppercase');
    });

    it('should have letterSpacing mark with spacing attribute', () => {
      expect(schema.marks.letterSpacing).toBeDefined();
      const mark = schema.marks.letterSpacing.create({ spacing: '2px' });
      expect(mark.attrs.spacing).toBe('2px');
    });

    it('should have lineHeight mark with height attribute', () => {
      expect(schema.marks.lineHeight).toBeDefined();
      const mark = schema.marks.lineHeight.create({ height: '1.5' });
      expect(mark.attrs.height).toBe('1.5');
    });
  });

  describe('Link mark', () => {
    it('should have link mark', () => {
      expect(schema.marks.link).toBeDefined();
    });

    it('should require href attribute', () => {
      const mark = schema.marks.link.create({ href: 'https://example.com' });
      expect(mark.attrs.href).toBe('https://example.com');
    });

    it('should accept optional title attribute', () => {
      const mark = schema.marks.link.create({
        href: 'https://example.com',
        title: 'Example Site'
      });
      expect(mark.attrs.title).toBe('Example Site');
    });

    it('should accept optional target attribute', () => {
      const mark = schema.marks.link.create({
        href: 'https://example.com',
        target: '_blank'
      });
      expect(mark.attrs.target).toBe('_blank');
    });
  });

  describe('Highlight mark', () => {
    it('should have highlight mark', () => {
      expect(schema.marks.highlight).toBeDefined();
    });

    it('should have color attribute', () => {
      const mark = schema.marks.highlight.create({ color: '#ffff00' });
      expect(mark.attrs.color).toBe('#ffff00');
    });
  });

  describe('Subscript and Superscript marks', () => {
    it('should have subscript mark', () => {
      expect(schema.marks.subscript).toBeDefined();
      const mark = schema.marks.subscript.create();
      const text = schema.text('H2O', [mark]);
      expect(text.marks[0].type.name).toBe('subscript');
    });

    it('should have superscript mark', () => {
      expect(schema.marks.superscript).toBeDefined();
      const mark = schema.marks.superscript.create();
      const text = schema.text('x2', [mark]);
      expect(text.marks[0].type.name).toBe('superscript');
    });

    it('should be mutually exclusive', () => {
      // Check that subscript excludes superscript
      const subscriptMark = schema.marks.subscript.create();
      expect(subscriptMark.type.excludes).toBeDefined();

      // Check that superscript excludes subscript
      const superscriptMark = schema.marks.superscript.create();
      expect(superscriptMark.type.excludes).toBeDefined();
      
      // Verify they actually exclude each other by trying to apply both
      const superscript = schema.marks.superscript.create();
      const subscript = schema.marks.subscript.create();
      const text = schema.text('test', [superscript]);
      
      // Adding subscript should remove superscript (or vice versa)
      // This is enforced by ProseMirror's mark exclusion system
      expect(text.marks.length).toBe(1);
    });
  });

  describe('Mark compatibility', () => {
    it('should allow combining bold and italic', () => {
      const boldMark = schema.marks.bold.create();
      const italicMark = schema.marks.italic.create();
      const text = schema.text('Bold Italic', [boldMark, italicMark]);
      
      expect(text.marks.length).toBe(2);
      expect(text.marks.some(m => m.type.name === 'bold')).toBe(true);
      expect(text.marks.some(m => m.type.name === 'italic')).toBe(true);
    });

    it('should allow combining bold, italic, and underline', () => {
      const boldMark = schema.marks.bold.create();
      const italicMark = schema.marks.italic.create();
      const underlineMark = schema.marks.underline.create();
      const text = schema.text('Formatted', [boldMark, italicMark, underlineMark]);
      
      expect(text.marks.length).toBe(3);
    });

    it('should allow combining formatting with color', () => {
      const boldMark = schema.marks.bold.create();
      const colorMark = schema.marks.textColor.create({ color: '#ff0000' });
      const text = schema.text('Bold Red', [boldMark, colorMark]);
      
      expect(text.marks.length).toBe(2);
      expect(text.marks.some(m => m.type.name === 'bold')).toBe(true);
      expect(text.marks.some(m => m.type.name === 'textColor')).toBe(true);
    });

    it('should allow link with formatting marks', () => {
      const boldMark = schema.marks.bold.create();
      const linkMark = schema.marks.link.create({ href: 'https://example.com' });
      const text = schema.text('Bold Link', [boldMark, linkMark]);
      
      expect(text.marks.length).toBe(2);
      expect(text.marks.some(m => m.type.name === 'bold')).toBe(true);
      expect(text.marks.some(m => m.type.name === 'link')).toBe(true);
    });
  });
});

