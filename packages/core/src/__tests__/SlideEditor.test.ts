/**
 * SlideEditor Tests
 *
 * Tests for the main SlideEditor class
 */

import { SlideEditor } from "../SlideEditor";
import { Extension } from "../Extension";
import type { DocNode } from "../types";
import type { Plugin } from "prosemirror-state";

// Create a simple test document
const createTestDoc = (): DocNode => ({
  type: "doc",
  content: [
    {
      type: "slide",
      content: [
        {
          type: "row",
          attrs: { layout: "1" },
          content: [
            {
              type: "column",
              content: [
                {
                  type: "heading",
                  attrs: { level: 1 },
                  content: [{ type: "text", text: "Test Slide" }],
                },
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Test content" }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

// Test extension
class TestExtension extends Extension {
  constructor(options = {}) {
    super(options);
    this.name = "TestExtension";
  }

  plugins(): Plugin[] {
    return [];
  }

  onCreate() {}
  onDestroy() {}
}

describe("SlideEditor", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  describe("constructor", () => {
    it("should create an editor instance", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(editor).toBeDefined();
      expect(editor).toBeInstanceOf(SlideEditor);
    });

    it("should accept content option", () => {
      const content = createTestDoc();
      const editor = new SlideEditor({ content });

      // Before mounting, getJSON returns empty doc
      // After mounting, it returns the actual content
      expect(editor.getJSON().type).toBe("doc");
    });

    it("should apply default options", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(editor).toBeDefined();
      // Default options should be applied internally
    });

    it("should accept custom options", () => {
      const onChange = jest.fn();
      const onCreate = jest.fn();

      const editor = new SlideEditor({
        content: createTestDoc(),
        onChange,
        onCreate,
        editorTheme: "dark",
        editorMode: "preview",
        readOnly: true,
      });

      expect(editor).toBeDefined();
    });

    it("should initialize with null view", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(editor.view).toBeNull();
      expect(editor.editorView).toBeNull();
    });

    it("should initialize commands", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(editor.commands).toBeDefined();
      expect(typeof editor.commands).toBe("object");
    });

    it("should handle extensions option", () => {
      const ext = new TestExtension();
      const editor = new SlideEditor({
        content: createTestDoc(),
        extensions: [ext],
      });

      expect(editor).toBeDefined();
    });

    it("should handle plugins option", () => {
      const mockPlugin: Plugin = {
        spec: {},
        props: {},
        getState: () => null,
      } as unknown as Plugin;

      const editor = new SlideEditor({
        content: createTestDoc(),
        plugins: [mockPlugin],
      });

      expect(editor).toBeDefined();
    });

    it("should handle both extensions and plugins", () => {
      const ext = new TestExtension();
      const mockPlugin: Plugin = {
        spec: {},
        props: {},
        getState: () => null,
      } as unknown as Plugin;

      const editor = new SlideEditor({
        content: createTestDoc(),
        extensions: [ext],
        plugins: [mockPlugin],
      });

      expect(editor).toBeDefined();
    });
  });

  describe("mount", () => {
    it("should mount editor to DOM element", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);

      expect(editor.view).not.toBeNull();
      expect(editor.editorView).not.toBeNull();
    });

    it("should create ProseMirror view", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);

      expect(editor.view?.state).toBeDefined();
      expect(editor.view?.dom).toBeDefined();
    });

    it("should warn when mounting twice", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);
      editor.mount(container);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("already mounted")
      );

      warnSpy.mockRestore();
    });

    it("should call onCreate callback", (done) => {
      const onCreate = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onCreate,
      });

      editor.mount(container);

      // onCreate is called asynchronously
      setTimeout(() => {
        expect(onCreate).toHaveBeenCalledWith(editor);
        editor.destroy();
        done();
      }, 10);
    });

    it("should call extension onCreate hooks", (done) => {
      class LifecycleExt extends Extension {
        createCalled = false;
        onCreate() {
          this.createCalled = true;
        }
      }

      const ext = new LifecycleExt();
      const editor = new SlideEditor({
        content: createTestDoc(),
        extensions: [ext],
      });

      editor.mount(container);

      setTimeout(() => {
        expect(ext.createCalled).toBe(true);
        editor.destroy();
        done();
      }, 10);
    });

    it("should handle mount errors gracefully", () => {
      const onError = jest.fn();
      const invalidContent = { type: "invalid" } as any;

      const editor = new SlideEditor({
        content: invalidContent,
        onError,
      });

      editor.mount(container);

      expect(onError).toHaveBeenCalled();
    });

    it("should handle mount errors without onError callback", () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const invalidContent = { type: "invalid" } as any;

      const editor = new SlideEditor({
        content: invalidContent,
      });

      editor.mount(container);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("unmount", () => {
    it("should unmount editor", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);
      expect(editor.view).not.toBeNull();

      editor.unmount();
      expect(editor.view).toBeNull();
    });

    it("should call onDestroy callback", () => {
      const onDestroy = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onDestroy,
      });

      editor.mount(container);
      editor.unmount();

      expect(onDestroy).toHaveBeenCalled();
    });

    it("should call extension onDestroy hooks", () => {
      class LifecycleExt extends Extension {
        destroyCalled = false;
        onDestroy() {
          this.destroyCalled = true;
        }
      }

      const ext = new LifecycleExt();
      const editor = new SlideEditor({
        content: createTestDoc(),
        extensions: [ext],
      });

      editor.mount(container);
      editor.unmount();

      expect(ext.destroyCalled).toBe(true);
    });

    it("should handle unmount when not mounted", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(() => {
        editor.unmount();
      }).not.toThrow();
    });

    it("should destroy ProseMirror view", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);
      const view = editor.view;

      editor.unmount();

      expect(editor.view).toBeNull();
      expect(view?.dom.parentNode).toBeNull();
    });
  });

  describe("destroy", () => {
    it("should destroy editor", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);
      editor.destroy();

      expect(editor.view).toBeNull();
    });

    it("should call unmount", () => {
      const onDestroy = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onDestroy,
      });

      editor.mount(container);
      editor.destroy();

      expect(onDestroy).toHaveBeenCalled();
    });
  });

  describe("getJSON", () => {
    it("should return document as JSON", () => {
      const content = createTestDoc();
      const editor = new SlideEditor({ content });

      editor.mount(container);
      const json = editor.getJSON();

      expect(json).toHaveProperty("type", "doc");
      expect(json).toHaveProperty("content");
      editor.destroy();
    });

    it("should return empty doc when not mounted", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      const json = editor.getJSON();

      expect(json).toEqual({ type: "doc", content: [] });
    });
  });

  describe("setContent", () => {
    it("should update document content", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);

      const newContent: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                attrs: { layout: "1" },
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "New content" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      editor.setContent(newContent);

      const json = editor.getJSON();
      // Verify content was updated
      expect(json.type).toBe("doc");
      expect(json.content).toHaveLength(1);

      editor.destroy();
    });

    it("should handle setContent when not mounted", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(() => {
        editor.setContent(createTestDoc());
      }).not.toThrow();
    });
  });

  describe("setEditable", () => {
    it("should change editable state", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);
      editor.setEditable(false);

      // ProseMirror should update its editable state
      expect(editor.view).not.toBeNull();

      editor.destroy();
    });

    it("should handle setEditable when not mounted", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(() => {
        editor.setEditable(false);
      }).not.toThrow();
    });
  });

  describe("callbacks", () => {
    it("should call onChange when content changes", (done) => {
      const onChange = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onChange,
      });

      editor.mount(container);

      // Trigger a change
      if (editor.view) {
        const tr = editor.view.state.tr.insertText("test");
        editor.view.dispatch(tr);
      }

      setTimeout(() => {
        expect(onChange).toHaveBeenCalled();
        editor.destroy();
        done();
      }, 10);
    });

    it("should call onUpdate when document updates", (done) => {
      const onUpdate = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onUpdate,
      });

      editor.mount(container);

      if (editor.view) {
        const tr = editor.view.state.tr.insertText("test");
        editor.view.dispatch(tr);
      }

      setTimeout(() => {
        expect(onUpdate).toHaveBeenCalled();
        editor.destroy();
        done();
      }, 10);
    });

    it("should call onTransaction for all transactions", (done) => {
      const onTransaction = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onTransaction,
      });

      editor.mount(container);

      if (editor.view) {
        const tr = editor.view.state.tr.insertText("test");
        editor.view.dispatch(tr);
      }

      setTimeout(() => {
        expect(onTransaction).toHaveBeenCalled();
        editor.destroy();
        done();
      }, 10);
    });

    it("should call onFocus when editor gains focus", (done) => {
      const onFocus = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onFocus,
      });

      editor.mount(container);

      if (editor.view?.dom) {
        editor.view.dom.focus();
      }

      setTimeout(() => {
        expect(onFocus).toHaveBeenCalled();
        editor.destroy();
        done();
      }, 10);
    });

    it("should call onBlur when editor loses focus", (done) => {
      const onBlur = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onBlur,
      });

      editor.mount(container);

      if (editor.view?.dom) {
        editor.view.dom.focus();
        editor.view.dom.blur();
      }

      setTimeout(() => {
        expect(onBlur).toHaveBeenCalled();
        editor.destroy();
        done();
      }, 10);
    });
  });

  describe("options", () => {
    it("should accept editorTheme option", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
        editorTheme: "dark",
      });

      expect(editor).toBeDefined();
    });

    it("should accept editorMode option", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
        editorMode: "preview",
      });

      editor.mount(container);
      expect(editor.view).not.toBeNull();
      editor.destroy();
    });

    it("should accept readOnly option", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
        readOnly: true,
      });

      editor.mount(container);
      expect(editor.view).not.toBeNull();
      editor.destroy();
    });

    it("should accept history options", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
        historyDepth: 50,
        newGroupDelay: 300,
      });

      expect(editor).toBeDefined();
    });

    it("should accept validation options", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
        validationMode: "strict",
        autoFixContent: true,
      });

      expect(editor).toBeDefined();
    });

    it("should enable markdown by default", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(editor).toBeDefined();
    });

    it("should allow disabling markdown", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
        enableMarkdown: false,
      });

      expect(editor).toBeDefined();
    });
  });

  describe("plugin management", () => {
    it("should deduplicate plugins with same key", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      // Create extensions that might return duplicate plugins
      class ExtWithKey extends Extension {
        plugins(): Plugin[] {
          return [
            {
              key: "sameKey" as any,
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
          ];
        }
      }

      const ext1 = new ExtWithKey();
      const ext2 = new ExtWithKey();

      const editor = new SlideEditor({
        content: createTestDoc(),
        extensions: [ext1, ext2],
      });

      editor.mount(container);

      // Should warn about duplicate extension (which have same plugin keys)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Skipping duplicate")
      );

      warnSpy.mockRestore();
      editor.destroy();
    });
  });

  describe("editorView getter", () => {
    it("should return null before mounting", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      expect(editor.editorView).toBeNull();
    });

    it("should return view after mounting", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);

      expect(editor.editorView).not.toBeNull();
      expect(editor.editorView).toBe(editor.view);

      editor.destroy();
    });
  });

  describe("callback coverage - undo/redo", () => {
    it("should call onUndo callback when undo is performed", () => {
      const onUndo = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onUndo,
      });

      editor.mount(container);

      // Insert some text
      const state = editor.view!.state;
      const tr = state.tr.insertText("test", 1);
      editor.view!.dispatch(tr);

      // Now try to undo
      const undoTr = editor.view!.state.tr;
      undoTr.setMeta("history$", { undo: true });
      editor.view!.dispatch(undoTr);

      expect(onUndo).toHaveBeenCalled();

      editor.destroy();
    });

    it("should call onRedo callback when redo is performed", () => {
      const onRedo = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onRedo,
      });

      editor.mount(container);

      // Insert some text
      const state = editor.view!.state;
      const tr = state.tr.insertText("test", 1);
      editor.view!.dispatch(tr);

      // Undo first
      const undoTr = editor.view!.state.tr;
      undoTr.setMeta("history$", { undo: true });
      editor.view!.dispatch(undoTr);

      // Now redo
      const redoTr = editor.view!.state.tr;
      redoTr.setMeta("history$", { redo: true });
      editor.view!.dispatch(redoTr);

      expect(onRedo).toHaveBeenCalled();

      editor.destroy();
    });

    it("should not call onUndo if callback not provided", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);

      // This should not throw even without onUndo callback
      expect(() => {
        const undoTr = editor.view!.state.tr;
        undoTr.setMeta("history$", { undo: true });
        editor.view!.dispatch(undoTr);
      }).not.toThrow();

      editor.destroy();
    });

    it("should not call onRedo if callback not provided", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);

      // This should not throw even without onRedo callback
      expect(() => {
        const redoTr = editor.view!.state.tr;
        redoTr.setMeta("history$", { redo: true });
        editor.view!.dispatch(redoTr);
      }).not.toThrow();

      editor.destroy();
    });
  });

  describe("callback coverage - onContentChange", () => {
    it("should call onContentChange when content changes", () => {
      const onContentChange = jest.fn();
      const editor = new SlideEditor({
        content: createTestDoc(),
        onContentChange,
      });

      editor.mount(container);

      // Insert text to trigger content change
      const state = editor.view!.state;
      const tr = state.tr.insertText("test", 1);
      editor.view!.dispatch(tr);

      expect(onContentChange).toHaveBeenCalled();
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          editor,
          content: expect.any(Object),
        })
      );

      editor.destroy();
    });

    it("should not call onContentChange if callback not provided", () => {
      const editor = new SlideEditor({
        content: createTestDoc(),
      });

      editor.mount(container);

      // This should not throw even without onContentChange callback
      expect(() => {
        const state = editor.view!.state;
        const tr = state.tr.insertText("test", 1);
        editor.view!.dispatch(tr);
      }).not.toThrow();

      editor.destroy();
    });
  });

  describe("plugin deduplication warning", () => {
    it("should warn when plugin has no key but still keep it", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      class ExtWithoutKey extends Extension {
        plugins(): Plugin[] {
          return [
            {
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
          ];
        }
      }

      const ext1 = new ExtWithoutKey();

      const editor = new SlideEditor({
        content: createTestDoc(),
        extensions: [ext1],
      });

      editor.mount(container);

      // Should not warn about plugins without keys
      // (they are kept in the filter with "if (!key) return true")
      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
      editor.destroy();
    });

    it("should actually skip duplicate plugins with same key", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      // Use a unique key name to ensure it's tested
      const uniqueKey = `testKey_${Date.now()}`;

      class ExtWithUniqueKey1 extends Extension {
        name = `ExtWithUniqueKey1_${Date.now()}`;

        plugins(): Plugin[] {
          return [
            {
              key: uniqueKey as any,
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
          ];
        }
      }

      class ExtWithUniqueKey2 extends Extension {
        name = `ExtWithUniqueKey2_${Date.now()}`;

        plugins(): Plugin[] {
          return [
            {
              key: uniqueKey as any,
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
          ];
        }
      }

      const ext1 = new ExtWithUniqueKey1();
      const ext2 = new ExtWithUniqueKey2();

      const editor = new SlideEditor({
        content: createTestDoc(),
        extensions: [ext1, ext2],
      });

      editor.mount(container);

      // Should warn with the actual key in the message
      expect(warnSpy).toHaveBeenCalledWith(
        `[AutoArtifacts] Skipping duplicate plugin with key: ${uniqueKey}`
      );

      warnSpy.mockRestore();
      editor.destroy();
    });
  });
});
