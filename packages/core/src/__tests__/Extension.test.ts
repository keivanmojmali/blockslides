/**
 * Extension Tests
 *
 * Tests for the base Extension class
 */

import { Extension } from "../Extension";
import { SlideEditor } from "../SlideEditor";
import type { Plugin } from "prosemirror-state";

// Mock SlideEditor for testing
const createMockEditor = (): SlideEditor => {
  return {
    view: null,
    commands: {} as any,
  } as SlideEditor;
};

// Test extensions
class TestExtension extends Extension {
  constructor(options = {}) {
    super(options);
    this.name = "TestExtension";
  }
}

class TestExtensionWithPlugins extends Extension {
  constructor(options = {}) {
    super(options);
    this.name = "TestExtensionWithPlugins";
  }

  plugins(editor: SlideEditor): Plugin[] {
    return [
      // Mock plugin - return a partial mock for testing
      {
        spec: {},
        props: {},
        getState: () => null,
      } as unknown as Plugin,
    ];
  }
}

class TestExtensionWithLifecycle extends Extension {
  public createCalled = false;
  public destroyCalled = false;

  constructor(options = {}) {
    super(options);
    this.name = "TestExtensionWithLifecycle";
  }

  onCreate(editor: SlideEditor): void {
    this.createCalled = true;
  }

  onDestroy(editor: SlideEditor): void {
    this.destroyCalled = true;
  }
}

class TestExtensionWithPriority extends Extension {
  constructor(options: any = {}) {
    super(options);
    this.name = "TestExtensionWithPriority";
    this.priority = options.priority || 100;
  }
}

describe("Extension", () => {
  describe("constructor", () => {
    it("should create an extension with default options", () => {
      const ext = new TestExtension();

      expect(ext.name).toBe("TestExtension");
      expect(ext.options).toEqual({});
      expect(ext.priority).toBe(100);
    });

    it("should create an extension with custom options", () => {
      const options = { foo: "bar", enabled: true };
      const ext = new TestExtension(options);

      expect(ext.options).toEqual(options);
    });

    it("should set default priority to 100", () => {
      const ext = new TestExtension();
      expect(ext.priority).toBe(100);
    });

    it("should allow custom priority", () => {
      const ext = new TestExtensionWithPriority({ priority: 200 });
      expect(ext.priority).toBe(200);
    });

    it("should set name from constructor name", () => {
      const ext = new TestExtension();
      expect(ext.name).toBe("TestExtension");
    });
  });

  describe("plugins", () => {
    it("should return empty array by default", () => {
      const ext = new TestExtension();
      const mockEditor = createMockEditor();

      const plugins = ext.plugins(mockEditor);

      expect(plugins).toEqual([]);
      expect(Array.isArray(plugins)).toBe(true);
    });

    it("should return custom plugins when overridden", () => {
      const ext = new TestExtensionWithPlugins();
      const mockEditor = createMockEditor();

      const plugins = ext.plugins(mockEditor);

      expect(plugins).toHaveLength(1);
      expect(plugins[0]).toHaveProperty("spec");
    });

    it("should receive editor instance", () => {
      const mockEditor = createMockEditor();
      let receivedEditor: SlideEditor | null = null;

      class TestExtensionWithEditorCheck extends Extension {
        plugins(editor: SlideEditor): Plugin[] {
          receivedEditor = editor;
          return [];
        }
      }

      const ext = new TestExtensionWithEditorCheck();
      ext.plugins(mockEditor);

      expect(receivedEditor).toBe(mockEditor);
    });
  });

  describe("lifecycle hooks", () => {
    it("should not define onCreate by default", () => {
      const ext = new TestExtension();
      expect(ext.onCreate).toBeUndefined();
    });

    it("should not define onDestroy by default", () => {
      const ext = new TestExtension();
      expect(ext.onDestroy).toBeUndefined();
    });

    it("should call onCreate when defined", () => {
      const ext = new TestExtensionWithLifecycle();
      const mockEditor = createMockEditor();

      expect(ext.createCalled).toBe(false);

      ext.onCreate!(mockEditor);

      expect(ext.createCalled).toBe(true);
    });

    it("should call onDestroy when defined", () => {
      const ext = new TestExtensionWithLifecycle();
      const mockEditor = createMockEditor();

      expect(ext.destroyCalled).toBe(false);

      ext.onDestroy!(mockEditor);

      expect(ext.destroyCalled).toBe(true);
    });

    it("should receive editor instance in onCreate", () => {
      let receivedEditor: SlideEditor | null = null;

      class TestExtensionWithOnCreate extends Extension {
        onCreate(editor: SlideEditor): void {
          receivedEditor = editor;
        }
      }

      const ext = new TestExtensionWithOnCreate();
      const mockEditor = createMockEditor();

      ext.onCreate!(mockEditor);

      expect(receivedEditor).toBe(mockEditor);
    });

    it("should receive editor instance in onDestroy", () => {
      let receivedEditor: SlideEditor | null = null;

      class TestExtensionWithOnDestroy extends Extension {
        onDestroy(editor: SlideEditor): void {
          receivedEditor = editor;
        }
      }

      const ext = new TestExtensionWithOnDestroy();
      const mockEditor = createMockEditor();

      ext.onDestroy!(mockEditor);

      expect(receivedEditor).toBe(mockEditor);
    });
  });

  describe("configure", () => {
    it("should create a new instance with options", () => {
      const options = { foo: "bar", count: 42 };
      const ext = TestExtension.configure(options);

      expect(ext).toBeInstanceOf(TestExtension);
      expect(ext.options).toEqual(options);
    });

    it("should create a new instance without options", () => {
      const ext = TestExtension.configure();

      expect(ext).toBeInstanceOf(TestExtension);
      expect(ext.options).toEqual({});
    });

    it("should work with different extension classes", () => {
      const ext1 = TestExtension.configure({ type: "test1" });
      const ext2 = TestExtensionWithPlugins.configure({ type: "test2" });

      expect(ext1).toBeInstanceOf(TestExtension);
      expect(ext2).toBeInstanceOf(TestExtensionWithPlugins);
      expect(ext1.options.type).toBe("test1");
      expect(ext2.options.type).toBe("test2");
    });

    it("should create independent instances", () => {
      const ext1 = TestExtension.configure({ value: 1 });
      const ext2 = TestExtension.configure({ value: 2 });

      expect(ext1.options.value).toBe(1);
      expect(ext2.options.value).toBe(2);
      expect(ext1).not.toBe(ext2);
    });

    it("should handle complex options", () => {
      const options = {
        nested: { deep: { value: "test" } },
        array: [1, 2, 3],
        enabled: true,
      };

      const ext = TestExtension.configure(options);

      expect(ext.options).toEqual(options);
      expect(ext.options.nested.deep.value).toBe("test");
      expect(ext.options.array).toEqual([1, 2, 3]);
    });
  });

  describe("type safety", () => {
    it("should handle typed options", () => {
      interface CustomOptions {
        enabled: boolean;
        count: number;
        message?: string;
      }

      class TypedExtension extends Extension<CustomOptions> {
        constructor(options: CustomOptions) {
          super(options);
          this.name = "TypedExtension";
        }
      }

      const ext = new TypedExtension({ enabled: true, count: 5 });

      expect(ext.options.enabled).toBe(true);
      expect(ext.options.count).toBe(5);
      expect(ext.options.message).toBeUndefined();
    });

    it("should provide type-safe options access", () => {
      interface MyOptions {
        color: string;
        size: number;
      }

      class MyExtension extends Extension<MyOptions> {
        getColor(): string {
          return this.options.color;
        }
      }

      const ext = new MyExtension({ color: "red", size: 10 });

      expect(ext.getColor()).toBe("red");
    });
  });

  describe("inheritance", () => {
    it("should support multiple extension classes", () => {
      class ExtensionA extends Extension {
        constructor() {
          super({});
          this.name = "ExtensionA";
          this.priority = 50;
        }
      }

      class ExtensionB extends Extension {
        constructor() {
          super({});
          this.name = "ExtensionB";
          this.priority = 150;
        }
      }

      const extA = new ExtensionA();
      const extB = new ExtensionB();

      expect(extA.priority).toBe(50);
      expect(extB.priority).toBe(150);
    });

    it("should inherit from Extension base class", () => {
      const ext = new TestExtension();

      expect(ext).toBeInstanceOf(Extension);
      expect(ext).toBeInstanceOf(TestExtension);
    });
  });
});
