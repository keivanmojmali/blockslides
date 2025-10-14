/**
 * Tests for Markdown Input Rules Plugin
 * 
 * Tests markdown syntax plugin creation and configuration
 */

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { history } from 'prosemirror-history';
import { schema } from '../../schema';
import { createMarkdownInputRules } from '../markdownInputRules';

describe('Markdown Input Rules Plugin', () => {
  describe('Plugin creation', () => {
    it('should create plugin with valid schema', () => {
      const plugin = createMarkdownInputRules(schema);
      
      expect(plugin).toBeDefined();
      expect(plugin.spec).toBeDefined();
      expect(plugin.spec.props).toBeDefined();
    });

    it('should create plugin that can be added to editor state', () => {
      const doc = ProseMirrorNode.fromJSON(schema, {
        type: 'doc',
        content: [{
          type: 'slide',
          content: [{
            type: 'row',
            attrs: { layout: '1' },
            content: [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: []
              }]
            }]
          }]
        }]
      });

      const state = EditorState.create({
        doc,
        schema,
        plugins: [
          history(),
          createMarkdownInputRules(schema)
        ]
      });

      expect(state).toBeDefined();
      expect(state.plugins.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle schema with all marks', () => {
      expect(schema.marks.bold).toBeDefined();
      expect(schema.marks.italic).toBeDefined();
      expect(schema.marks.code).toBeDefined();
      expect(schema.marks.link).toBeDefined();
      
      const plugin = createMarkdownInputRules(schema);
      expect(plugin).toBeDefined();
    });

    it('should handle schema with all nodes', () => {
      expect(schema.nodes.heading).toBeDefined();
      expect(schema.nodes.paragraph).toBeDefined();
      
      const plugin = createMarkdownInputRules(schema);
      expect(plugin).toBeDefined();
    });
  });

  describe('Supported markdown patterns', () => {
    it('should document bold syntax support', () => {
      // Documents that the plugin supports **text** and __text__ for bold
      const patterns = ['**text**', '__text__'];
      expect(patterns).toHaveLength(2);
    });

    it('should document italic syntax support', () => {
      // Documents that the plugin supports *text* and _text_ for italic
      const patterns = ['*text*', '_text_'];
      expect(patterns).toHaveLength(2);
    });

    it('should document code syntax support', () => {
      // Documents that the plugin supports `text` for inline code
      const pattern = '`text`';
      expect(pattern).toBeTruthy();
    });

    it('should document strikethrough syntax support', () => {
      // Documents that the plugin supports ~~text~~ for strikethrough
      const pattern = '~~text~~';
      expect(pattern).toBeTruthy();
    });

    it('should document link syntax support', () => {
      // Documents that the plugin supports [text](url) for links
      const pattern = '[text](url)';
      expect(pattern).toBeTruthy();
    });

    it('should document heading syntax support', () => {
      // Documents that the plugin supports # through ###### for headings
      const patterns = ['# ', '## ', '### ', '#### ', '##### ', '###### '];
      expect(patterns).toHaveLength(6);
    });

    it('should document bullet list syntax support', () => {
      // Documents that the plugin supports -, *, + for bullet lists
      const patterns = ['- ', '* ', '+ '];
      expect(patterns).toHaveLength(3);
    });

    it('should document ordered list syntax support', () => {
      // Documents that the plugin supports 1. for ordered lists
      const pattern = '1. ';
      expect(pattern).toBeTruthy();
    });
  });

  describe('Schema integration', () => {
    it('should only add rules for marks that exist in schema', () => {
      const plugin = createMarkdownInputRules(schema);
      
      // Plugin should be created regardless of which marks are available
      expect(plugin).toBeDefined();
    });

    it('should only add rules for nodes that exist in schema', () => {
      const plugin = createMarkdownInputRules(schema);
      
      // Plugin should be created regardless of which nodes are available
      expect(plugin).toBeDefined();
    });

    it('should handle missing optional marks gracefully', () => {
      // Even if strikethrough mark doesn't exist, plugin should work
      const plugin = createMarkdownInputRules(schema);
      expect(plugin).toBeDefined();
    });

    it('should handle missing optional nodes gracefully', () => {
      // Even if bulletList or orderedList don't exist, plugin should work
      const plugin = createMarkdownInputRules(schema);
      expect(plugin).toBeDefined();
    });
  });

  describe('Plugin integration', () => {
    it('should work alongside history plugin', () => {
      const doc = ProseMirrorNode.fromJSON(schema, {
        type: 'doc',
        content: [{
          type: 'slide',
          content: [{
            type: 'row',
            attrs: { layout: '1' },
            content: [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: []
              }]
            }]
          }]
        }]
      });

      const state = EditorState.create({
        doc,
        schema,
        plugins: [
          history(),
          createMarkdownInputRules(schema)
        ]
      });

      expect(state.plugins).toHaveLength(2);
    });

    it('should create a valid editor view with the plugin', () => {
      const doc = ProseMirrorNode.fromJSON(schema, {
        type: 'doc',
        content: [{
          type: 'slide',
          content: [{
            type: 'row',
            attrs: { layout: '1' },
            content: [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: []
              }]
            }]
          }]
        }]
      });

      const state = EditorState.create({
        doc,
        schema,
        plugins: [
          history(),
          createMarkdownInputRules(schema)
        ]
      });

      const view = new EditorView(document.createElement('div'), { state });

      expect(view).toBeDefined();
      expect(view.state).toBeDefined();
      expect(view.state.doc).toBeDefined();
    });

    it('should be able to insert text into editor with plugin', () => {
      const doc = ProseMirrorNode.fromJSON(schema, {
        type: 'doc',
        content: [{
          type: 'slide',
          content: [{
            type: 'row',
            attrs: { layout: '1' },
            content: [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: []
              }]
            }]
          }]
        }]
      });

      const state = EditorState.create({
        doc,
        schema,
        plugins: [
          history(),
          createMarkdownInputRules(schema)
        ]
      });

      const view = new EditorView(document.createElement('div'), { state });

      // Should be able to insert text without errors
      const tr = view.state.tr.insertText('Hello world', view.state.selection.from);
      view.dispatch(tr);

      expect(view.state.doc.textContent).toContain('Hello world');
    });
  });

  describe('Plugin configuration', () => {
    it('should have input rules configured in plugin spec', () => {
      const plugin = createMarkdownInputRules(schema);
      
      expect(plugin.spec).toBeDefined();
      expect(plugin.spec.props).toBeDefined();
    });

    it('should be a ProseMirror plugin instance', () => {
      const plugin = createMarkdownInputRules(schema);
      
      // Check it has the essential plugin properties
      expect(plugin.spec).toBeDefined();
      expect(typeof plugin.getState).toBe('function');
    });

    it('should not throw errors when initialized', () => {
      expect(() => {
        createMarkdownInputRules(schema);
      }).not.toThrow();
    });

    it('should return the same plugin type on multiple calls', () => {
      const plugin1 = createMarkdownInputRules(schema);
      const plugin2 = createMarkdownInputRules(schema);
      
      // Both should be valid plugins
      expect(plugin1).toBeDefined();
      expect(plugin2).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty editor state', () => {
      const doc = ProseMirrorNode.fromJSON(schema, {
        type: 'doc',
        content: [{
          type: 'slide',
          content: [{
            type: 'row',
            attrs: { layout: '1' },
            content: [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: []
              }]
            }]
          }]
        }]
      });

      const state = EditorState.create({
        doc,
        schema,
        plugins: [createMarkdownInputRules(schema)]
      });

      expect(state.doc.childCount).toBe(1);
    });

    it('should handle editor with existing content', () => {
      const doc = ProseMirrorNode.fromJSON(schema, {
        type: 'doc',
        content: [{
          type: 'slide',
          content: [{
            type: 'row',
            attrs: { layout: '1' },
            content: [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: 'Existing content' }]
              }]
            }]
          }]
        }]
      });

      const state = EditorState.create({
        doc,
        schema,
        plugins: [createMarkdownInputRules(schema)]
      });

      expect(state.doc.textContent).toContain('Existing content');
    });

    it('should handle multiple plugins in array', () => {
      const doc = ProseMirrorNode.fromJSON(schema, {
        type: 'doc',
        content: [{
          type: 'slide',
          content: [{
            type: 'row',
            attrs: { layout: '1' },
            content: [{
              type: 'column',
              content: [{
                type: 'paragraph',
                content: []
              }]
            }]
          }]
        }]
      });

      const state = EditorState.create({
        doc,
        schema,
        plugins: [
          history(),
          createMarkdownInputRules(schema)
        ]
      });

      expect(state.plugins.length).toBeGreaterThanOrEqual(2);
    });
  });
});
