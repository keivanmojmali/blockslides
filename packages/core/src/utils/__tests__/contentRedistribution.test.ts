/**
 * Content Redistribution Tests
 */

import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { schema } from '../../schema';
import {
  extractContentBlocks,
  redistributeContent,
  createEmptyColumn,
  createPlaceholderContent,
  isSlideEmpty
} from '../contentRedistribution';

describe('Content Redistribution', () => {
  const testSchema = schema;

  describe('extractContentBlocks', () => {
    it('should extract blocks from all columns', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('heading', { level: 1 }, [testSchema.text('Title')]),
            testSchema.node('paragraph', null, [testSchema.text('Content')])
          ]),
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [testSchema.text('More content')])
          ])
        ])
      ]);

      const blocks = extractContentBlocks(slideNode);

      expect(blocks.length).toBe(3);
      expect(blocks[0].type.name).toBe('heading');
      expect(blocks[1].type.name).toBe('paragraph');
      expect(blocks[2].type.name).toBe('paragraph');
    });

    it('should skip empty paragraphs', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, []), // Empty
            testSchema.node('paragraph', null, [testSchema.text('Content')])
          ])
        ])
      ]);

      const blocks = extractContentBlocks(slideNode);

      expect(blocks.length).toBe(1);
      expect(blocks[0].textContent).toBe('Content');
    });

    it('should handle multiple rows', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [testSchema.text('Row 1')])
          ])
        ]),
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [testSchema.text('Row 2')])
          ])
        ])
      ]);

      const blocks = extractContentBlocks(slideNode);

      expect(blocks.length).toBe(2);
    });

    it('should return empty array for slide with no content', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, []) // Empty paragraph
          ])
        ])
      ]);

      const blocks = extractContentBlocks(slideNode);

      expect(blocks).toEqual([]);
    });
  });

  describe('redistributeContent', () => {
    it('should redistribute blocks evenly', () => {
      const blocks = [
        testSchema.node('paragraph', null, [testSchema.text('Block 1')]),
        testSchema.node('paragraph', null, [testSchema.text('Block 2')]),
        testSchema.node('paragraph', null, [testSchema.text('Block 3')]),
        testSchema.node('paragraph', null, [testSchema.text('Block 4')])
      ];

      const columns = redistributeContent(blocks, 2, testSchema);

      expect(columns.length).toBe(2);
      expect(columns[0].childCount).toBe(2);
      expect(columns[1].childCount).toBe(2);
    });

    it('should handle uneven distribution', () => {
      const blocks = [
        testSchema.node('paragraph', null, [testSchema.text('Block 1')]),
        testSchema.node('paragraph', null, [testSchema.text('Block 2')]),
        testSchema.node('paragraph', null, [testSchema.text('Block 3')])
      ];

      const columns = redistributeContent(blocks, 2, testSchema);

      expect(columns.length).toBe(2);
      expect(columns[0].childCount).toBe(2);
      expect(columns[1].childCount).toBe(1);
    });

    it('should create empty columns when no blocks', () => {
      const columns = redistributeContent([], 3, testSchema);

      expect(columns.length).toBe(3);
      columns.forEach(column => {
        expect(column.childCount).toBe(1); // Empty paragraph
        expect(column.firstChild?.type.name).toBe('paragraph');
      });
    });

    it('should add empty paragraph to empty columns', () => {
      const blocks = [
        testSchema.node('paragraph', null, [testSchema.text('Block 1')])
      ];

      const columns = redistributeContent(blocks, 3, testSchema);

      expect(columns.length).toBe(3);
      expect(columns[0].childCount).toBe(1);
      expect(columns[1].childCount).toBe(1); // Empty paragraph
      expect(columns[2].childCount).toBe(1); // Empty paragraph
    });

    it('should handle single column', () => {
      const blocks = [
        testSchema.node('paragraph', null, [testSchema.text('Block 1')]),
        testSchema.node('paragraph', null, [testSchema.text('Block 2')])
      ];

      const columns = redistributeContent(blocks, 1, testSchema);

      expect(columns.length).toBe(1);
      expect(columns[0].childCount).toBe(2);
    });

    it('should return empty array when schema is missing types', () => {
      const warnSpy = jest.spyOn(console, 'error').mockImplementation();

      // Create a minimal schema without column/paragraph types
      const minimalSchema = new Schema({
        nodes: {
          doc: { content: 'text*' },
          text: {}
        }
      });

      const blocks: ProseMirrorNode[] = [];
      const columns = redistributeContent(blocks, 2, minimalSchema);

      expect(columns).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing column or paragraph node type')
      );

      warnSpy.mockRestore();
    });
  });

  describe('createEmptyColumn', () => {
    it('should create column with empty paragraph', () => {
      const column = createEmptyColumn(testSchema);

      expect(column).not.toBeNull();
      expect(column?.type.name).toBe('column');
      expect(column?.childCount).toBe(1);
      expect(column?.firstChild?.type.name).toBe('paragraph');
      expect(column?.firstChild?.content.size).toBe(0);
    });

    it('should return null when schema is missing types', () => {
      const warnSpy = jest.spyOn(console, 'error').mockImplementation();

      const minimalSchema = new Schema({
        nodes: {
          doc: { content: 'text*' },
          text: {}
        }
      });

      const column = createEmptyColumn(minimalSchema);

      expect(column).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing column or paragraph node type')
      );

      warnSpy.mockRestore();
    });
  });

  describe('createPlaceholderContent', () => {
    it('should create single column layout', () => {
      const columns = createPlaceholderContent('1', testSchema);

      expect(columns.length).toBe(1);
      expect(columns[0].childCount).toBe(2); // heading + paragraph

      const heading = columns[0].firstChild;
      expect(heading?.type.name).toBe('heading');
      expect(heading?.attrs.level).toBe(1);
      expect(heading?.attrs.placeholder).toBe('Add a heading');
    });

    it('should create two column layout', () => {
      const columns = createPlaceholderContent('1-1', testSchema);

      expect(columns.length).toBe(2);

      columns.forEach((column, i) => {
        expect(column.childCount).toBe(2); // heading + paragraph

        const heading = column.firstChild;
        expect(heading?.type.name).toBe('heading');
        expect(heading?.attrs.level).toBe(2);
        expect(heading?.attrs.placeholder).toBe(`Column ${i + 1} heading`);
      });
    });

    it('should create 2-1 sidebar layout', () => {
      const columns = createPlaceholderContent('2-1', testSchema);

      expect(columns.length).toBe(2);
      expect(columns[0].childCount).toBe(2); // Main column
      expect(columns[1].childCount).toBe(2); // Sidebar

      const mainHeading = columns[0].firstChild;
      expect(mainHeading?.attrs.placeholder).toBe('Main heading');

      const sidebarHeading = columns[1].firstChild;
      expect(sidebarHeading?.attrs.placeholder).toBe('Sidebar heading');
    });

    it('should create 1-2 sidebar layout', () => {
      const columns = createPlaceholderContent('1-2', testSchema);

      expect(columns.length).toBe(2);

      const sidebarHeading = columns[0].firstChild;
      expect(sidebarHeading?.attrs.placeholder).toBe('Sidebar heading');

      const mainHeading = columns[1].firstChild;
      expect(mainHeading?.attrs.placeholder).toBe('Main heading');
    });

    it('should create three column layout', () => {
      const columns = createPlaceholderContent('1-1-1', testSchema);

      expect(columns.length).toBe(3);

      columns.forEach(column => {
        expect(column.childCount).toBeGreaterThan(0);
      });
    });

    it('should handle custom layouts with equal distribution', () => {
      const columns = createPlaceholderContent('1-2-1', testSchema);

      expect(columns.length).toBe(3);

      columns.forEach(column => {
        expect(column.type.name).toBe('column');
      });
    });

    it('should return empty array when schema is missing types', () => {
      const warnSpy = jest.spyOn(console, 'error').mockImplementation();

      const minimalSchema = new Schema({
        nodes: {
          doc: { content: 'text*' },
          text: {}
        }
      });

      const columns = createPlaceholderContent('1-1', minimalSchema);

      expect(columns).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required node types')
      );

      warnSpy.mockRestore();
    });
  });

  describe('isSlideEmpty', () => {
    it('should return true for slide with only empty paragraphs', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(true);
    });

    it('should return false for slide with text content', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [testSchema.text('Content')])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return false for slide with heading', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('heading', { level: 1 }, [testSchema.text('Title')])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return false for slide with image', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('image', {
              src: 'test.jpg',
              alt: '',
              width: null,
              display: 'default',
              align: 'left'
            })
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return false for slide with list', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('bulletList', null, [
              testSchema.node('listItem', null, [
                testSchema.node('paragraph', null, [testSchema.text('Item')])
              ])
            ])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return false for slide with multiple columns', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [])
          ]),
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [])
          ])
        ])
      ]);

      // isSlideEmpty requires exactly 1 column, so multiple columns = not empty
      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return true for slide with empty paragraph', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(true);
    });

    it('should return true for slide with empty heading and paragraph', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('heading', { level: 1 }, []),
            testSchema.node('paragraph', null, [])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(true);
    });

    it('should return false for slide with non-default layout', () => {
      const slideNode = testSchema.node('slide', { layout: '1-1' }, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return false for slide with multiple rows', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [])
          ])
        ]),
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return false for column with 3 or more children', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, []),
            testSchema.node('paragraph', null, []),
            testSchema.node('paragraph', null, [])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });

    it('should return false for column with heading and non-paragraph', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('heading', { level: 1 }, []),
            testSchema.node('heading', { level: 2 }, [])
          ])
        ])
      ]);

      expect(isSlideEmpty(slideNode)).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should redistribute content from 1 column to 2 columns', () => {
      // Extract blocks from single column layout
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('heading', { level: 1 }, [testSchema.text('Title')]),
            testSchema.node('paragraph', null, [testSchema.text('P1')]),
            testSchema.node('paragraph', null, [testSchema.text('P2')]),
            testSchema.node('paragraph', null, [testSchema.text('P3')])
          ])
        ])
      ]);

      const blocks = extractContentBlocks(slideNode);
      const newColumns = redistributeContent(blocks, 2, testSchema);

      expect(newColumns.length).toBe(2);
      expect(newColumns[0].childCount).toBe(2); // heading + p1
      expect(newColumns[1].childCount).toBe(2); // p2 + p3
    });

    it('should handle layout change from 2 columns to 1 column', () => {
      const slideNode = testSchema.node('slide', null, [
        testSchema.node('row', null, [
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [testSchema.text('Col1')])
          ]),
          testSchema.node('column', null, [
            testSchema.node('paragraph', null, [testSchema.text('Col2')])
          ])
        ])
      ]);

      const blocks = extractContentBlocks(slideNode);
      const newColumns = redistributeContent(blocks, 1, testSchema);

      expect(newColumns.length).toBe(1);
      expect(newColumns[0].childCount).toBe(2); // Both paragraphs
    });
  });
});

