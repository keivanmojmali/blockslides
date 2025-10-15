/**
 * Node Schema Tests
 * 
 * Tests all node types in the AutoArtifacts schema to ensure
 * they are defined correctly and accept appropriate content.
 */

import { schema } from '../../index';
import { Node as ProseMirrorNode, DOMParser, DOMSerializer } from 'prosemirror-model';

// Helper to create a DOM element
function createElement(tag: string, attrs?: Record<string, string>, children?: string[]): HTMLElement {
  const el = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  if (children) {
    children.forEach(child => {
      el.appendChild(document.createTextNode(child));
    });
  }
  return el;
}

describe('Node Schema', () => {
  describe('slide node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.slide).toBeDefined();
    });

    it('should create a slide with correct structure', () => {
      const slide = schema.nodes.slide.create(
        { layout: '1' },
        [
          schema.nodes.row.create(
            { layout: '1' },
            [
              schema.nodes.column.create(null, [
                schema.nodes.heading.create({ level: 1 }, [schema.text('Test')]),
                schema.nodes.paragraph.create(null, [schema.text('Content')])
              ])
            ]
          )
        ]
      );

      expect(slide.type.name).toBe('slide');
      expect(slide.attrs.layout).toBe('1');
      expect(slide.childCount).toBe(1);
    });

    it('should accept row children', () => {
      const row = schema.nodes.row.create();
      expect(() => {
        schema.nodes.slide.create(null, [row]);
      }).not.toThrow();
    });

    it('should serialize to DOM correctly', () => {
      const slide = schema.nodes.slide.create({ layout: '2-1' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(slide) as HTMLElement;
      
      expect(dom.getAttribute('data-node-type')).toBe('slide');
      expect(dom.getAttribute('data-layout')).toBe('2-1');
    });

    it('should serialize to DOM with default layout', () => {
      const slide = schema.nodes.slide.create({ layout: '1' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(slide) as HTMLElement;
      
      expect(dom.getAttribute('data-layout')).toBe('1');
    });

    it('should serialize to DOM with empty layout fallback', () => {
      const slide = schema.nodes.slide.create({ layout: '' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(slide) as HTMLElement;
      
      // Test the || "1" branch when layout is empty
      expect(dom.getAttribute('data-layout')).toBe('1');
    });
  });

  describe('row node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.row).toBeDefined();
    });

    it('should accept column children', () => {
      const column = schema.nodes.column.create(null, [
        schema.nodes.paragraph.create()
      ]);
      const row = schema.nodes.row.create({ layout: '1' }, [column]);

      expect(row.type.name).toBe('row');
      expect(row.childCount).toBe(1);
    });

    it('should store layout attribute', () => {
      const row = schema.nodes.row.create({ layout: '2-1' });
      expect(row.attrs.layout).toBe('2-1');
    });

    it('should serialize to DOM with class', () => {
      const row = schema.nodes.row.create({ layout: '1-2', className: 'custom' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(row) as HTMLElement;
      
      expect(dom.classList.contains('row')).toBe(true);
      expect(dom.classList.contains('custom')).toBe(true);
      expect(dom.getAttribute('data-layout')).toBe('1-2');
    });

    it('should serialize to DOM with auto layout when empty', () => {
      const row = schema.nodes.row.create({ layout: '' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(row) as HTMLElement;
      
      expect(dom.getAttribute('data-layout')).toBe('auto');
    });
  });

  describe('column node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.column).toBeDefined();
    });

    it('should accept heading content', () => {
      const column = schema.nodes.column.create(null, [
        schema.nodes.heading.create({ level: 1 }, [schema.text('Heading')])
      ]);
      expect(column.childCount).toBe(1);
      expect(column.child(0).type.name).toBe('heading');
    });

    it('should accept paragraph content', () => {
      const column = schema.nodes.column.create(null, [
        schema.nodes.paragraph.create(null, [schema.text('Text')])
      ]);
      expect(column.childCount).toBe(1);
      expect(column.child(0).type.name).toBe('paragraph');
    });

    it('should accept image content', () => {
      const column = schema.nodes.column.create(null, [
        schema.nodes.image.create({ src: 'test.jpg' })
      ]);
      expect(column.childCount).toBe(1);
      expect(column.child(0).type.name).toBe('image');
    });

    it('should accept video content', () => {
      const column = schema.nodes.column.create(null, [
        schema.nodes.video.create({ src: 'test.mp4' })
      ]);
      expect(column.childCount).toBe(1);
      expect(column.child(0).type.name).toBe('video');
    });

    it('should accept list content', () => {
      const column = schema.nodes.column.create(null, [
        schema.nodes.bulletList.create(null, [
          schema.nodes.listItem.create(null, [
            schema.nodes.paragraph.create(null, [schema.text('Item')])
          ])
        ])
      ]);
      expect(column.childCount).toBe(1);
      expect(column.child(0).type.name).toBe('bulletList');
    });

    it('should serialize to DOM correctly', () => {
      const column = schema.nodes.column.create();
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(column) as HTMLElement;
      
      expect(dom.tagName.toLowerCase()).toBe('div');
      expect(dom.classList.contains('column')).toBe(true);
      expect(dom.getAttribute('data-node-type')).toBe('column');
    });
  });

  describe('heading node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.heading).toBeDefined();
    });

    it('should support levels 1-6', () => {
      for (let level = 1; level <= 6; level++) {
        const heading = schema.nodes.heading.create({ level }, [
          schema.text(`Level ${level}`)
        ]);
        expect(heading.attrs.level).toBe(level);
      }
    });

    it('should accept inline content', () => {
      const heading = schema.nodes.heading.create({ level: 1 }, [
        schema.text('Plain text')
      ]);
      expect(heading.textContent).toBe('Plain text');
    });

    it('should accept marks', () => {
      const boldMark = schema.marks.bold.create();
      const heading = schema.nodes.heading.create({ level: 1 }, [
        schema.text('Bold text', [boldMark])
      ]);
      expect(heading.firstChild?.marks.length).toBe(1);
      expect(heading.firstChild?.marks[0].type.name).toBe('bold');
    });

    it('should serialize to DOM with correct heading level', () => {
      for (let level = 1; level <= 6; level++) {
        const heading = schema.nodes.heading.create({ level });
        const serializer = DOMSerializer.fromSchema(schema);
        const dom = serializer.serializeNode(heading) as HTMLElement;
        
        expect(dom.tagName.toLowerCase()).toBe(`h${level}`);
      }
    });

    it('should serialize to DOM with placeholder attribute', () => {
      const heading = schema.nodes.heading.create({ level: 2, placeholder: 'Enter title' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(heading) as HTMLElement;
      
      expect(dom.getAttribute('data-placeholder')).toBe('Enter title');
    });

    it('should serialize to DOM without placeholder when null', () => {
      const heading = schema.nodes.heading.create({ level: 2, placeholder: null });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(heading) as HTMLElement;
      
      expect(dom.hasAttribute('data-placeholder')).toBe(false);
    });

    it('should have parseDOM rules for h1 through h6', () => {
      const headingSpec = schema.spec.nodes.get('heading');
      expect(headingSpec?.parseDOM).toHaveLength(6);
      
      // Verify each heading level has a parseDOM rule
      const tags = headingSpec?.parseDOM?.map((rule: any) => rule.tag);
      expect(tags).toContain('h1');
      expect(tags).toContain('h2');
      expect(tags).toContain('h3');
      expect(tags).toContain('h4');
      expect(tags).toContain('h5');
      expect(tags).toContain('h6');
    });

    it('should parse DOM attributes correctly via getAttrs for all heading levels', () => {
      const headingSpec = schema.spec.nodes.get('heading');
      
      // Test h1 with placeholder
      const h1Rule = headingSpec?.parseDOM?.find((rule: any) => rule.tag === 'h1');
      expect(h1Rule).toBeDefined();
      let attrs = (h1Rule as any).getAttrs({ getAttribute: (attr: string) => attr === 'data-placeholder' ? 'Test' : null } as any);
      expect(attrs.level).toBe(1);
      expect(attrs.placeholder).toBe('Test');
      
      // Test h1 without placeholder (falsy branch)
      attrs = (h1Rule as any).getAttrs({ getAttribute: (attr: string) => null } as any);
      expect(attrs.level).toBe(1);
      expect(attrs.placeholder).toBeNull();
      
      // Test h1 with empty string placeholder
      attrs = (h1Rule as any).getAttrs({ getAttribute: (attr: string) => '' } as any);
      expect(attrs.level).toBe(1);
      expect(attrs.placeholder).toBeNull();
      
      // Test h2
      const h2Rule = headingSpec?.parseDOM?.find((rule: any) => rule.tag === 'h2');
      expect(h2Rule).toBeDefined();
      attrs = (h2Rule as any).getAttrs({ getAttribute: (attr: string) => null } as any);
      expect(attrs.level).toBe(2);
      expect(attrs.placeholder).toBeNull();
      
      // Test h3 with placeholder
      const h3Rule = headingSpec?.parseDOM?.find((rule: any) => rule.tag === 'h3');
      expect(h3Rule).toBeDefined();
      attrs = (h3Rule as any).getAttrs({ getAttribute: (attr: string) => 'H3 placeholder' } as any);
      expect(attrs.level).toBe(3);
      expect(attrs.placeholder).toBe('H3 placeholder');
      
      // Test h3 without placeholder (falsy branch)
      attrs = (h3Rule as any).getAttrs({ getAttribute: (attr: string) => null } as any);
      expect(attrs.level).toBe(3);
      expect(attrs.placeholder).toBeNull();
      
      // Test h3 with empty string
      attrs = (h3Rule as any).getAttrs({ getAttribute: (attr: string) => '' } as any);
      expect(attrs.level).toBe(3);
      expect(attrs.placeholder).toBeNull();
      
      // Test h4
      const h4Rule = headingSpec?.parseDOM?.find((rule: any) => rule.tag === 'h4');
      expect(h4Rule).toBeDefined();
      attrs = (h4Rule as any).getAttrs({ getAttribute: (attr: string) => null } as any);
      expect(attrs.level).toBe(4);
      expect(attrs.placeholder).toBeNull();
      
      // Test h5
      const h5Rule = headingSpec?.parseDOM?.find((rule: any) => rule.tag === 'h5');
      expect(h5Rule).toBeDefined();
      attrs = (h5Rule as any).getAttrs({ getAttribute: (attr: string) => null } as any);
      expect(attrs.level).toBe(5);
      expect(attrs.placeholder).toBeNull();
      
      // Test h6
      const h6Rule = headingSpec?.parseDOM?.find((rule: any) => rule.tag === 'h6');
      expect(h6Rule).toBeDefined();
      attrs = (h6Rule as any).getAttrs({ getAttribute: (attr: string) => null } as any);
      expect(attrs.level).toBe(6);
      expect(attrs.placeholder).toBeNull();
    });
  });

  describe('paragraph node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.paragraph).toBeDefined();
    });

    it('should accept inline content', () => {
      const para = schema.nodes.paragraph.create(null, [
        schema.text('Text content')
      ]);
      expect(para.textContent).toBe('Text content');
    });

    it('should accept multiple marks', () => {
      const boldMark = schema.marks.bold.create();
      const italicMark = schema.marks.italic.create();
      const para = schema.nodes.paragraph.create(null, [
        schema.text('Formatted text', [boldMark, italicMark])
      ]);
      expect(para.firstChild?.marks.length).toBe(2);
    });

    it('should allow empty paragraphs', () => {
      const para = schema.nodes.paragraph.create();
      expect(para.childCount).toBe(0);
    });

    it('should serialize to DOM as p tag', () => {
      const para = schema.nodes.paragraph.create();
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      expect(dom.tagName.toLowerCase()).toBe('p');
    });

    it('should serialize to DOM with placeholder', () => {
      const para = schema.nodes.paragraph.create({ placeholder: 'Enter text' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      expect(dom.getAttribute('data-placeholder')).toBe('Enter text');
    });

    it('should serialize to DOM without placeholder when null', () => {
      const para = schema.nodes.paragraph.create({ placeholder: null });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(para) as HTMLElement;
      
      expect(dom.hasAttribute('data-placeholder')).toBe(false);
    });

    it('should have parseDOM rule for p tag', () => {
      const paraSpec = schema.spec.nodes.get('paragraph');
      expect(paraSpec?.parseDOM).toHaveLength(1);
      expect(paraSpec?.parseDOM?.[0].tag).toBe('p');
    });

    it('should parse DOM attributes via getAttrs with placeholder', () => {
      const paraSpec = schema.spec.nodes.get('paragraph');
      const pRule = paraSpec?.parseDOM?.[0];
      
      expect(pRule).toBeDefined();
      expect(pRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => attr === 'data-placeholder' ? 'Type here' : null
      } as any;
      
      const attrs = (pRule as any).getAttrs(mockDom);
      expect(attrs.placeholder).toBe('Type here');
    });

    it('should parse DOM attributes via getAttrs without placeholder', () => {
      const paraSpec = schema.spec.nodes.get('paragraph');
      const pRule = paraSpec?.parseDOM?.[0];
      
      expect(pRule).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => null
      } as any;
      
      const attrs = (pRule as any).getAttrs(mockDom);
      expect(attrs.placeholder).toBeNull();
    });
  });

  describe('image node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.image).toBeDefined();
    });

    it('should require src attribute', () => {
      const image = schema.nodes.image.create({ src: 'image.jpg' });
      expect(image.attrs.src).toBe('image.jpg');
    });

    it('should accept optional alt attribute', () => {
      const image = schema.nodes.image.create({
        src: 'image.jpg',
        alt: 'Description'
      });
      expect(image.attrs.alt).toBe('Description');
    });

    it('should accept optional width attribute', () => {
      const image = schema.nodes.image.create({
        src: 'image.jpg',
        width: '500'
      });
      expect(image.attrs.width).toBe('500');
    });

    it('should accept optional display attribute', () => {
      const image = schema.nodes.image.create({
        src: 'image.jpg',
        display: 'cover'
      });
      expect(image.attrs.display).toBe('cover');
    });

    it('should accept optional align attribute', () => {
      const image = schema.nodes.image.create({
        src: 'image.jpg',
        align: 'center'
      });
      expect(image.attrs.align).toBe('center');
    });

    it('should serialize to DOM as img tag', () => {
      const image = schema.nodes.image.create({
        src: 'test.jpg',
        alt: 'Test image',
        width: '500',
        display: 'cover',
        align: 'center'
      });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(image) as HTMLElement;
      
      expect(dom.tagName.toLowerCase()).toBe('img');
      expect(dom.getAttribute('src')).toBe('test.jpg');
      expect(dom.getAttribute('alt')).toBe('Test image');
      expect(dom.getAttribute('width')).toBe('500');
      expect(dom.getAttribute('data-display')).toBe('cover');
      expect(dom.getAttribute('data-align')).toBe('center');
      expect(dom.getAttribute('data-node-type')).toBe('image');
    });

    it('should serialize to DOM without width when null', () => {
      const image = schema.nodes.image.create({ src: 'test.jpg', width: null });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(image) as HTMLElement;
      
      expect(dom.hasAttribute('width')).toBe(false);
    });

    it('should have parseDOM rule for img tag', () => {
      const imageSpec = schema.spec.nodes.get('image');
      expect(imageSpec?.parseDOM).toHaveLength(1);
      expect(imageSpec?.parseDOM?.[0].tag).toBe('img');
    });

    it('should parse DOM attributes via getAttrs with all attributes', () => {
      const imageSpec = schema.spec.nodes.get('image');
      const imgRule = imageSpec?.parseDOM?.[0];
      
      expect(imgRule).toBeDefined();
      expect(imgRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => {
          const attrs: Record<string, string> = {
            'src': 'image.png',
            'alt': 'Alt text',
            'width': '600',
            'data-display': 'contain',
            'data-align': 'right'
          };
          return attrs[attr] || null;
        }
      } as any;
      
      const attrs = (imgRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('image.png');
      expect(attrs.alt).toBe('Alt text');
      expect(attrs.width).toBe('600');
      expect(attrs.display).toBe('contain');
      expect(attrs.align).toBe('right');
    });

    it('should parse DOM attributes via getAttrs with missing attributes', () => {
      const imageSpec = schema.spec.nodes.get('image');
      const imgRule = imageSpec?.parseDOM?.[0];
      
      expect(imgRule).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => {
          // Only src is required, everything else returns null
          return attr === 'src' ? 'test.jpg' : null;
        }
      } as any;
      
      const attrs = (imgRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('test.jpg');
      expect(attrs.alt).toBe('');  // Default to empty string
      expect(attrs.width).toBeNull();  // Default to null
      expect(attrs.display).toBe('default');  // Default value
      expect(attrs.align).toBe('left');  // Default value
    });

    it('should parse DOM attributes via getAttrs with empty src', () => {
      const imageSpec = schema.spec.nodes.get('image');
      const imgRule = imageSpec?.parseDOM?.[0];
      
      expect(imgRule).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => null  // All attributes missing
      } as any;
      
      const attrs = (imgRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('');  // Test || "" branch
      expect(attrs.alt).toBe('');  // Test || "" branch
    });
  });

  describe('video node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.video).toBeDefined();
    });

    it('should require src attribute', () => {
      const video = schema.nodes.video.create({ src: 'video.mp4' });
      expect(video.attrs.src).toBe('video.mp4');
    });

    it('should accept optional provider attribute', () => {
      const video = schema.nodes.video.create({
        src: 'https://youtube.com/watch?v=test',
        provider: 'youtube'
      });
      expect(video.attrs.provider).toBe('youtube');
    });

    it('should accept optional aspectRatio attribute', () => {
      const video = schema.nodes.video.create({
        src: 'video.mp4',
        aspectRatio: '4:3'
      });
      expect(video.attrs.aspectRatio).toBe('4:3');
    });

    it('should accept optional align attribute', () => {
      const video = schema.nodes.video.create({
        src: 'video.mp4',
        align: 'right'
      });
      expect(video.attrs.align).toBe('right');
    });

    it('should serialize to DOM as div with video wrapper', () => {
      const video = schema.nodes.video.create({
        src: 'test.mp4',
        provider: 'youtube',
        aspectRatio: '16:9',
        align: 'center'
      });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(video) as HTMLElement;
      
      expect(dom.tagName.toLowerCase()).toBe('div');
      expect(dom.classList.contains('video-wrapper')).toBe(true);
      expect(dom.getAttribute('data-provider')).toBe('youtube');
      expect(dom.getAttribute('data-aspect-ratio')).toBe('16:9');
      expect(dom.getAttribute('data-align')).toBe('center');
      expect(dom.getAttribute('data-node-type')).toBe('video');
      
      // Check iframe child
      const iframe = dom.querySelector('iframe');
      expect(iframe).toBeDefined();
      expect(iframe?.getAttribute('src')).toBe('test.mp4');
    });

    it('should serialize to DOM with default values', () => {
      const video = schema.nodes.video.create({ src: 'video.mp4' });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(video) as HTMLElement;
      
      expect(dom.getAttribute('data-provider')).toBe('youtube');
      expect(dom.getAttribute('data-aspect-ratio')).toBe('16:9');
      expect(dom.getAttribute('data-align')).toBe('center');
    });

    it('should have parseDOM rules for iframe and video', () => {
      const videoSpec = schema.spec.nodes.get('video');
      expect(videoSpec?.parseDOM).toHaveLength(2);
      
      const tags = videoSpec?.parseDOM?.map((rule: any) => rule.tag);
      expect(tags).toContain('iframe');
      expect(tags).toContain('video');
    });

    it('should parse iframe attributes via getAttrs', () => {
      const videoSpec = schema.spec.nodes.get('video');
      const iframeRule = videoSpec?.parseDOM?.find((rule: any) => rule.tag === 'iframe');
      
      expect(iframeRule).toBeDefined();
      expect(iframeRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => attr === 'src' ? 'video.mp4' : null,
        parentElement: {
          getAttribute: (attr: string) => {
            const attrs: Record<string, string> = {
              'data-provider': 'vimeo',
              'data-aspect-ratio': '4:3',
              'data-align': 'right'
            };
            return attrs[attr] || null;
          }
        }
      } as any;
      
      const attrs = (iframeRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('video.mp4');
      expect(attrs.provider).toBe('vimeo');
      expect(attrs.aspectRatio).toBe('4:3');
      expect(attrs.align).toBe('right');
    });

    it('should parse video tag attributes via getAttrs', () => {
      const videoSpec = schema.spec.nodes.get('video');
      const videoRule = videoSpec?.parseDOM?.find((rule: any) => rule.tag === 'video');
      
      expect(videoRule).toBeDefined();
      expect(videoRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => {
          return attr === 'src' ? 'local-video.mp4' : attr === 'width' ? '800' : null;
        }
      } as any;
      
      const attrs = (videoRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('local-video.mp4');
      expect(attrs.width).toBe('800');
      expect(attrs.provider).toBe('embed');  // Default for video tag
      expect(attrs.aspectRatio).toBe('16:9');  // Default
      expect(attrs.align).toBe('center');  // Default
    });

    it('should parse video tag with missing width', () => {
      const videoSpec = schema.spec.nodes.get('video');
      const videoRule = videoSpec?.parseDOM?.find((rule: any) => rule.tag === 'video');
      
      expect(videoRule).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => attr === 'src' ? 'video.mp4' : null
      } as any;
      
      const attrs = (videoRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('video.mp4');
      expect(attrs.width).toBeNull();  // Test the || null branch
    });

    it('should parse iframe with empty src', () => {
      const videoSpec = schema.spec.nodes.get('video');
      const iframeRule = videoSpec?.parseDOM?.find((rule: any) => rule.tag === 'iframe');
      
      expect(iframeRule).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => null,  // Empty src
        parentElement: {
          getAttribute: (attr: string) => null
        }
      } as any;
      
      const attrs = (iframeRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('');  // Test || "" branch
      expect(attrs.provider).toBe('youtube');  // Default
      expect(attrs.aspectRatio).toBe('16:9');  // Default
      expect(attrs.align).toBe('center');  // Default
    });

    it('should parse video tag with empty src', () => {
      const videoSpec = schema.spec.nodes.get('video');
      const videoRule = videoSpec?.parseDOM?.find((rule: any) => rule.tag === 'video');
      
      expect(videoRule).toBeDefined();
      
      const mockDom = {
        getAttribute: (attr: string) => null  // Empty src and width
      } as any;
      
      const attrs = (videoRule as any).getAttrs(mockDom);
      expect(attrs.src).toBe('');  // Test || "" branch
      expect(attrs.width).toBeNull();
    });

    it('should serialize to DOM with empty width fallback', () => {
      const video = schema.nodes.video.create({ src: 'test.mp4', width: null });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(video) as HTMLElement;
      
      const iframe = dom.querySelector('iframe');
      expect(iframe?.getAttribute('width')).toBe('100%');  // Test || "100%" branch
    });
  });

  describe('bulletList node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.bulletList).toBeDefined();
    });

    it('should accept listItem children', () => {
      const list = schema.nodes.bulletList.create(null, [
        schema.nodes.listItem.create(null, [
          schema.nodes.paragraph.create(null, [schema.text('Item 1')])
        ]),
        schema.nodes.listItem.create(null, [
          schema.nodes.paragraph.create(null, [schema.text('Item 2')])
        ])
      ]);
      expect(list.childCount).toBe(2);
      expect(list.child(0).type.name).toBe('listItem');
    });

    it('should serialize to DOM as ul tag', () => {
      const list = schema.nodes.bulletList.create();
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(list) as HTMLElement;
      
      expect(dom.tagName.toLowerCase()).toBe('ul');
      expect(dom.getAttribute('data-node-type')).toBe('bullet-list');
      expect(dom.classList.contains('bullet-list')).toBe(true);
    });

    it('should have parseDOM rule for ul tag', () => {
      const listSpec = schema.spec.nodes.get('bulletList');
      expect(listSpec?.parseDOM).toHaveLength(1);
      expect(listSpec?.parseDOM?.[0].tag).toBe('ul');
    });

    it('should parse DOM attributes via getAttrs with className', () => {
      const listSpec = schema.spec.nodes.get('bulletList');
      const ulRule = listSpec?.parseDOM?.[0];
      
      expect(ulRule).toBeDefined();
      expect(ulRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        className: 'custom-class'
      } as any;
      
      const attrs = (ulRule as any).getAttrs(mockDom);
      expect(attrs.className).toBe('custom-class');
    });

    it('should parse DOM attributes via getAttrs with empty className', () => {
      const listSpec = schema.spec.nodes.get('bulletList');
      const ulRule = listSpec?.parseDOM?.[0];
      
      expect(ulRule).toBeDefined();
      
      const mockDom = {
        className: ''
      } as any;
      
      const attrs = (ulRule as any).getAttrs(mockDom);
      expect(attrs.className).toBe('');  // Test the || "" branch
    });
  });

  describe('orderedList node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.orderedList).toBeDefined();
    });

    it('should accept listItem children', () => {
      const list = schema.nodes.orderedList.create(null, [
        schema.nodes.listItem.create(null, [
          schema.nodes.paragraph.create(null, [schema.text('Item 1')])
        ]),
        schema.nodes.listItem.create(null, [
          schema.nodes.paragraph.create(null, [schema.text('Item 2')])
        ])
      ]);
      expect(list.childCount).toBe(2);
    });

    it('should serialize to DOM as ol tag', () => {
      const list = schema.nodes.orderedList.create({ start: 1 });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(list) as HTMLElement;
      
      expect(dom.tagName.toLowerCase()).toBe('ol');
      expect(dom.getAttribute('data-node-type')).toBe('ordered-list');
      expect(dom.classList.contains('ordered-list')).toBe(true);
      // Start = 1 doesn't output start attribute (it's the default)
      expect(dom.hasAttribute('start')).toBe(false);
    });

    it('should serialize to DOM with custom start number', () => {
      const list = schema.nodes.orderedList.create({ start: 5 });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(list) as HTMLElement;
      
      expect(dom.getAttribute('start')).toBe('5');
    });

    it('should serialize to DOM without start attribute when start is 1', () => {
      const list = schema.nodes.orderedList.create({ start: 1 });
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(list) as HTMLElement;
      
      // Start attribute is not included when it's 1 (default)
      expect(dom.hasAttribute('start')).toBe(false);
    });

    it('should have parseDOM rule for ol tag', () => {
      const listSpec = schema.spec.nodes.get('orderedList');
      expect(listSpec?.parseDOM).toHaveLength(1);
      expect(listSpec?.parseDOM?.[0].tag).toBe('ol');
    });

    it('should parse DOM attributes via getAttrs with all attributes', () => {
      const listSpec = schema.spec.nodes.get('orderedList');
      const olRule = listSpec?.parseDOM?.[0];
      
      expect(olRule).toBeDefined();
      expect(olRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        className: 'custom-class',
        getAttribute: (attr: string) => attr === 'start' ? '5' : null
      } as any;
      
      const attrs = (olRule as any).getAttrs(mockDom);
      expect(attrs.className).toBe('custom-class');
      expect(attrs.start).toBe(5);
    });

    it('should parse DOM attributes via getAttrs with empty className', () => {
      const listSpec = schema.spec.nodes.get('orderedList');
      const olRule = listSpec?.parseDOM?.[0];
      
      expect(olRule).toBeDefined();
      
      const mockDom = {
        className: '',
        getAttribute: (attr: string) => attr === 'start' ? '3' : null
      } as any;
      
      const attrs = (olRule as any).getAttrs(mockDom);
      expect(attrs.className).toBe('');  // Test the || "" branch
      expect(attrs.start).toBe(3);
    });

    it('should parse DOM attributes via getAttrs with missing start', () => {
      const listSpec = schema.spec.nodes.get('orderedList');
      const olRule = listSpec?.parseDOM?.[0];
      
      expect(olRule).toBeDefined();
      
      const mockDom = {
        className: 'test',
        getAttribute: (attr: string) => null
      } as any;
      
      const attrs = (olRule as any).getAttrs(mockDom);
      expect(attrs.className).toBe('test');
      expect(attrs.start).toBe(1);  // Test default start value
    });
  });

  describe('listItem node', () => {
    it('should exist in schema', () => {
      expect(schema.nodes.listItem).toBeDefined();
    });

    it('should accept paragraph content', () => {
      const item = schema.nodes.listItem.create(null, [
        schema.nodes.paragraph.create(null, [schema.text('Item text')])
      ]);
      expect(item.childCount).toBe(1);
      expect(item.child(0).type.name).toBe('paragraph');
    });

    it('should accept nested lists', () => {
      const item = schema.nodes.listItem.create(null, [
        schema.nodes.paragraph.create(null, [schema.text('Item')]),
        schema.nodes.bulletList.create(null, [
          schema.nodes.listItem.create(null, [
            schema.nodes.paragraph.create(null, [schema.text('Nested')])
          ])
        ])
      ]);
      expect(item.childCount).toBe(2);
      expect(item.child(1).type.name).toBe('bulletList');
    });

    it('should serialize to DOM as li tag', () => {
      const item = schema.nodes.listItem.create();
      const serializer = DOMSerializer.fromSchema(schema);
      const dom = serializer.serializeNode(item) as HTMLElement;
      
      expect(dom.tagName.toLowerCase()).toBe('li');
      expect(dom.getAttribute('data-node-type')).toBe('list-item');
    });

    it('should have parseDOM rule for li tag', () => {
      const itemSpec = schema.spec.nodes.get('listItem');
      expect(itemSpec?.parseDOM).toHaveLength(1);
      expect(itemSpec?.parseDOM?.[0].tag).toBe('li');
    });

    it('should parse DOM attributes via getAttrs with className', () => {
      const itemSpec = schema.spec.nodes.get('listItem');
      const liRule = itemSpec?.parseDOM?.[0];
      
      expect(liRule).toBeDefined();
      expect(liRule?.getAttrs).toBeDefined();
      
      const mockDom = {
        className: 'custom-item'
      } as any;
      
      const attrs = (liRule as any).getAttrs(mockDom);
      expect(attrs.className).toBe('custom-item');
    });

    it('should parse DOM attributes via getAttrs with empty className', () => {
      const itemSpec = schema.spec.nodes.get('listItem');
      const liRule = itemSpec?.parseDOM?.[0];
      
      expect(liRule).toBeDefined();
      
      const mockDom = {
        className: ''
      } as any;
      
      const attrs = (liRule as any).getAttrs(mockDom);
      expect(attrs.className).toBe('');  // Test the || "" branch
    });
  });
});

