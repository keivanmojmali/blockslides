/**
 * Node Schema Tests
 * 
 * Tests all node types in the AutoArtifacts schema to ensure
 * they are defined correctly and accept appropriate content.
 */

import { schema } from '../../index';
import { Node as ProseMirrorNode } from 'prosemirror-model';

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
  });
});

