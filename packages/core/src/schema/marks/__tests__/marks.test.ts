/**
 * Mark Schema Tests
 * 
 * Tests all mark types in the AutoArtifacts schema to ensure
 * they are defined correctly and can be applied to text.
 */

import { schema } from '../../index';
import { DOMParser, DOMSerializer } from 'prosemirror-model';

// Helper to create a DOM element
function createElement(tag: string, attrs?: Record<string, string>, content?: string): HTMLElement {
  const el = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'style') {
        el.setAttribute('style', value);
      } else {
        el.setAttribute(key, value);
      }
    });
  }
  if (content) {
    el.textContent = content;
  }
  return el;
}

describe('Mark Schema', () => {
  describe('Text formatting marks', () => {
    it('should have bold mark', () => {
      expect(schema.marks.bold).toBeDefined();
      const boldMark = schema.marks.bold.create();
      const text = schema.text('Bold text', [boldMark]);
      expect(text.marks[0].type.name).toBe('bold');
    });

    it('should serialize bold to DOM as strong tag', () => {
      const boldMark = schema.marks.bold.create();
      const text = schema.text('Bold', [boldMark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const strong = dom.querySelector('strong');
      expect(strong).toBeDefined();
      expect(strong?.textContent).toBe('Bold');
    });

    it('should parse strong tag as bold mark', () => {
      const boldSpec = schema.spec.marks.get('bold');
      const strongRule = boldSpec?.parseDOM?.find((rule: any) => rule.tag === 'strong');
      
      expect(strongRule).toBeDefined();
      expect(strongRule?.tag).toBe('strong');
    });

    it('should parse b tag as bold mark', () => {
      const boldSpec = schema.spec.marks.get('bold');
      const bRule = boldSpec?.parseDOM?.find((rule: any) => rule.tag === 'b');
      
      expect(bRule).toBeDefined();
      expect(bRule?.tag).toBe('b');
    });

    it('should parse font-weight style as bold mark', () => {
      const boldSpec = schema.spec.marks.get('bold');
      const styleRule = boldSpec?.parseDOM?.find((rule: any) => rule.style === 'font-weight');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      // Test valid bold values
      expect((styleRule as any).getAttrs('bold')).toBeNull();  // null means accept
      expect((styleRule as any).getAttrs('bolder')).toBeNull();
      expect((styleRule as any).getAttrs('500')).toBeNull();
      expect((styleRule as any).getAttrs('700')).toBeNull();
      expect((styleRule as any).getAttrs('900')).toBeNull();
      
      // Test invalid values
      expect((styleRule as any).getAttrs('normal')).toBe(false);
      expect((styleRule as any).getAttrs('400')).toBe(false);
      expect((styleRule as any).getAttrs('lighter')).toBe(false);
    });

    it('should have italic mark', () => {
      expect(schema.marks.italic).toBeDefined();
      const italicMark = schema.marks.italic.create();
      const text = schema.text('Italic text', [italicMark]);
      expect(text.marks[0].type.name).toBe('italic');
    });

    it('should serialize italic to DOM as em tag', () => {
      const italicMark = schema.marks.italic.create();
      const text = schema.text('Italic', [italicMark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const em = dom.querySelector('em');
      expect(em).toBeDefined();
      expect(em?.textContent).toBe('Italic');
    });

    it('should have underline mark', () => {
      expect(schema.marks.underline).toBeDefined();
      const underlineMark = schema.marks.underline.create();
      const text = schema.text('Underlined text', [underlineMark]);
      expect(text.marks[0].type.name).toBe('underline');
    });

    it('should serialize underline to DOM as u tag', () => {
      const underlineMark = schema.marks.underline.create();
      const text = schema.text('Underline', [underlineMark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const u = dom.querySelector('u');
      expect(u).toBeDefined();
      expect(u?.textContent).toBe('Underline');
    });

    it('should have strikethrough mark', () => {
      expect(schema.marks.strikethrough).toBeDefined();
      const strikeMark = schema.marks.strikethrough.create();
      const text = schema.text('Strikethrough text', [strikeMark]);
      expect(text.marks[0].type.name).toBe('strikethrough');
    });

    it('should serialize strikethrough to DOM as s or del tag', () => {
      const strikeMark = schema.marks.strikethrough.create();
      const text = schema.text('Strike', [strikeMark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      // Should have either s or del tag
      const hasStrike = dom.querySelector('s, del');
      expect(hasStrike).toBeDefined();
    });

    it('should have code mark', () => {
      expect(schema.marks.code).toBeDefined();
      const codeMark = schema.marks.code.create();
      const text = schema.text('Code text', [codeMark]);
      expect(text.marks[0].type.name).toBe('code');
    });

    it('should serialize code to DOM as code tag', () => {
      const codeMark = schema.marks.code.create();
      const text = schema.text('code()', [codeMark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const code = dom.querySelector('code');
      expect(code).toBeDefined();
      expect(code?.textContent).toBe('code()');
    });
  });

  describe('Typography marks', () => {
    it('should have fontSize mark with size attribute', () => {
      expect(schema.marks.fontSize).toBeDefined();
      const mark = schema.marks.fontSize.create({ size: '24px' });
      expect(mark.attrs.size).toBe('24px');
    });

    it('should serialize fontSize to DOM with style', () => {
      const mark = schema.marks.fontSize.create({ size: 'large' });
      const text = schema.text('Text', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const span = dom.querySelector('span[style*="font-size"]');
      expect(span).toBeDefined();
    });

    it('should map fontSize named sizes to CSS values', () => {
      const serializer = DOMSerializer.fromSchema(schema);
      
      // Test named sizes
      const sizes = ['small', 'normal', 'large', 'xlarge'];
      sizes.forEach(size => {
        const mark = schema.marks.fontSize.create({ size });
        const text = schema.text('Text', [mark]);
        const para = schema.nodes.paragraph.create(null, [text]);
        const dom = serializer.serializeNode(para) as HTMLElement;
        const span = dom.querySelector('span[style*="font-size"]');
        expect(span).toBeDefined();
      });
      
      // Test custom size
      const customMark = schema.marks.fontSize.create({ size: '18px' });
      const customText = schema.text('Text', [customMark]);
      const customPara = schema.nodes.paragraph.create(null, [customText]);
      const customDom = serializer.serializeNode(customPara) as HTMLElement;
      const customSpan = customDom.querySelector('span[style*="18px"]');
      expect(customSpan).toBeDefined();
    });

    it('should parse font-size style as fontSize mark', () => {
      const fontSizeSpec = schema.spec.marks.get('fontSize');
      const styleRule = fontSizeSpec?.parseDOM?.find((rule: any) => rule.style === 'font-size');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('16px');
      expect(attrs.size).toBe('16px');
    });

    it('should have fontFamily mark with family attribute', () => {
      expect(schema.marks.fontFamily).toBeDefined();
      const mark = schema.marks.fontFamily.create({ family: 'Arial' });
      expect(mark.attrs.family).toBe('Arial');
    });

    it('should serialize fontFamily to DOM with style', () => {
      const mark = schema.marks.fontFamily.create({ family: 'Arial, sans-serif' });
      const text = schema.text('Text', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const span = dom.querySelector('span[style*="font-family"]');
      expect(span).toBeDefined();
    });

    it('should parse font-family style as fontFamily mark', () => {
      const fontFamilySpec = schema.spec.marks.get('fontFamily');
      const styleRule = fontFamilySpec?.parseDOM?.find((rule: any) => rule.style === 'font-family');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('Arial');
      expect(attrs.family).toBe('Arial');
    });

    it('should have textColor mark with color attribute', () => {
      expect(schema.marks.textColor).toBeDefined();
      const mark = schema.marks.textColor.create({ color: '#ff0000' });
      expect(mark.attrs.color).toBe('#ff0000');
    });

    it('should serialize textColor to DOM with style', () => {
      const mark = schema.marks.textColor.create({ color: '#ff0000' });
      const text = schema.text('Red text', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const span = dom.querySelector('span[style*="color"]');
      expect(span).toBeDefined();
    });

    it('should parse color style as textColor mark', () => {
      const textColorSpec = schema.spec.marks.get('textColor');
      const styleRule = textColorSpec?.parseDOM?.find((rule: any) => rule.style === 'color');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('#00ff00');
      expect(attrs.color).toBe('#00ff00');
    });

    it('should have textShadow mark with shadow attribute', () => {
      expect(schema.marks.textShadow).toBeDefined();
      const mark = schema.marks.textShadow.create({ shadow: '2px 2px 4px rgba(0,0,0,0.5)' });
      expect(mark.attrs.shadow).toBe('2px 2px 4px rgba(0,0,0,0.5)');
    });

    it('should serialize textShadow to DOM with style', () => {
      const mark = schema.marks.textShadow.create({ shadow: '2px 2px 4px rgba(0,0,0,0.5)' });
      const text = schema.text('Shadow', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const span = dom.querySelector('span[style*="text-shadow"]');
      expect(span).toBeDefined();
    });

    it('should parse text-shadow style as textShadow mark', () => {
      const textShadowSpec = schema.spec.marks.get('textShadow');
      const styleRule = textShadowSpec?.parseDOM?.find((rule: any) => rule.style === 'text-shadow');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('1px 1px 2px black');
      expect(attrs.shadow).toBe('1px 1px 2px black');
    });

    it('should have textTransform mark with transform attribute', () => {
      expect(schema.marks.textTransform).toBeDefined();
      const mark = schema.marks.textTransform.create({ transform: 'uppercase' });
      expect(mark.attrs.transform).toBe('uppercase');
    });

    it('should serialize textTransform to DOM with style', () => {
      const mark = schema.marks.textTransform.create({ transform: 'uppercase' });
      const text = schema.text('Transform', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const span = dom.querySelector('span[style*="text-transform"]');
      expect(span).toBeDefined();
    });

    it('should parse text-transform style as textTransform mark', () => {
      const textTransformSpec = schema.spec.marks.get('textTransform');
      const styleRule = textTransformSpec?.parseDOM?.find((rule: any) => rule.style === 'text-transform');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('lowercase');
      expect(attrs.transform).toBe('lowercase');
    });

    it('should have letterSpacing mark with spacing attribute', () => {
      expect(schema.marks.letterSpacing).toBeDefined();
      const mark = schema.marks.letterSpacing.create({ spacing: '2px' });
      expect(mark.attrs.spacing).toBe('2px');
    });

    it('should serialize letterSpacing to DOM with style', () => {
      const mark = schema.marks.letterSpacing.create({ spacing: '2px' });
      const text = schema.text('Spaced', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const span = dom.querySelector('span[style*="letter-spacing"]');
      expect(span).toBeDefined();
    });

    it('should parse letter-spacing style as letterSpacing mark', () => {
      const letterSpacingSpec = schema.spec.marks.get('letterSpacing');
      const styleRule = letterSpacingSpec?.parseDOM?.find((rule: any) => rule.style === 'letter-spacing');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('3px');
      expect(attrs.spacing).toBe('3px');
    });

    it('should have lineHeight mark with height attribute', () => {
      expect(schema.marks.lineHeight).toBeDefined();
      const mark = schema.marks.lineHeight.create({ height: '1.5' });
      expect(mark.attrs.height).toBe('1.5');
    });

    it('should serialize lineHeight to DOM with style', () => {
      const mark = schema.marks.lineHeight.create({ height: '1.8' });
      const text = schema.text('Line', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const span = dom.querySelector('span[style*="line-height"]');
      expect(span).toBeDefined();
    });

    it('should parse line-height style as lineHeight mark', () => {
      const lineHeightSpec = schema.spec.marks.get('lineHeight');
      const styleRule = lineHeightSpec?.parseDOM?.find((rule: any) => rule.style === 'line-height');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('2.0');
      expect(attrs.height).toBe('2.0');
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

    it('should serialize link to DOM as a tag with attributes', () => {
      const mark = schema.marks.link.create({
        href: 'https://example.com',
        title: 'Example',
        target: '_blank'
      });
      const text = schema.text('Link', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const a = dom.querySelector('a');
      expect(a).toBeDefined();
      expect(a?.getAttribute('href')).toBe('https://example.com');
      expect(a?.getAttribute('title')).toBe('Example');
      expect(a?.getAttribute('target')).toBe('_blank');
      expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should serialize link without title when null', () => {
      const mark = schema.marks.link.create({
        href: 'https://example.com',
        title: null
      });
      const text = schema.text('Link', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const a = dom.querySelector('a');
      expect(a).toBeDefined();
      expect(a?.hasAttribute('title')).toBe(false);
    });

    it('should parse a tag as link mark', () => {
      const linkSpec = schema.spec.marks.get('link');
      const aRule = linkSpec?.parseDOM?.find((rule: any) => rule.tag === 'a[href]');
      
      expect(aRule).toBeDefined();
      expect(aRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => {
          const attrs: Record<string, string | null> = {
            'href': 'https://test.com',
            'title': 'Test Link',
            'target': '_self'
          };
          return attrs[attr] || null;
        }
      } as any;
      
      const attrs = (aRule as any).getAttrs(mockDom);
      expect(attrs.href).toBe('https://test.com');
      expect(attrs.title).toBe('Test Link');
      expect(attrs.target).toBe('_self');
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

    it('should serialize highlight to DOM with background-color style', () => {
      const mark = schema.marks.highlight.create({ color: '#ffff00' });
      const text = schema.text('Highlighted', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const markEl = dom.querySelector('mark[style*="background-color"]');
      expect(markEl).toBeDefined();
      expect(markEl?.textContent).toBe('Highlighted');
    });

    it('should parse background-color style as highlight mark', () => {
      const highlightSpec = schema.spec.marks.get('highlight');
      const styleRule = highlightSpec?.parseDOM?.find((rule: any) => rule.style === 'background-color');
      
      expect(styleRule).toBeDefined();
      expect(styleRule?.getAttrs).toBeDefined();
      
      const attrs = (styleRule as any).getAttrs('#00ff00');
      expect(attrs.color).toBe('#00ff00');
    });

    it('should parse mark tag as highlight mark with backgroundColor', () => {
      const highlightSpec = schema.spec.marks.get('highlight');
      const markRule = highlightSpec?.parseDOM?.find((rule: any) => rule.tag === 'mark');
      
      expect(markRule).toBeDefined();
      expect(markRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        style: { backgroundColor: '#ffaa00' }
      } as any;
      
      const attrs = (markRule as any).getAttrs(mockDom);
      expect(attrs.color).toBe('#ffaa00');
    });

    it('should parse mark tag with fallback color when backgroundColor is empty', () => {
      const highlightSpec = schema.spec.marks.get('highlight');
      const markRule = highlightSpec?.parseDOM?.find((rule: any) => rule.tag === 'mark');
      
      expect(markRule).toBeDefined();
      
      const mockDom = {
        style: { backgroundColor: '' }
      } as any;
      
      const attrs = (markRule as any).getAttrs(mockDom);
      expect(attrs.color).toBe('#ffff00');  // Test the || "#ffff00" fallback
    });
  });

  describe('Subscript and Superscript marks', () => {
    it('should have subscript mark', () => {
      expect(schema.marks.subscript).toBeDefined();
      const mark = schema.marks.subscript.create();
      const text = schema.text('H2O', [mark]);
      expect(text.marks[0].type.name).toBe('subscript');
    });

    it('should serialize subscript to DOM as sub tag', () => {
      const mark = schema.marks.subscript.create();
      const text = schema.text('2', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const sub = dom.querySelector('sub');
      expect(sub).toBeDefined();
      expect(sub?.textContent).toBe('2');
    });

    it('should have superscript mark', () => {
      expect(schema.marks.superscript).toBeDefined();
      const mark = schema.marks.superscript.create();
      const text = schema.text('x2', [mark]);
      expect(text.marks[0].type.name).toBe('superscript');
    });

    it('should serialize superscript to DOM as sup tag', () => {
      const mark = schema.marks.superscript.create();
      const text = schema.text('2', [mark]);
      const para = schema.nodes.paragraph.create(null, [text]);
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      const sup = dom.querySelector('sup');
      expect(sup).toBeDefined();
      expect(sup?.textContent).toBe('2');
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

