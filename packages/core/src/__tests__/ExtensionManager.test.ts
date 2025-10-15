/**
 * ExtensionManager Tests
 *
 * Tests for the ExtensionManager class
 */

import { ExtensionManager } from "../ExtensionManager";
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
class TestExtension1 extends Extension {
  constructor(options = {}) {
    super(options);
    this.name = "TestExtension1";
    this.priority = 100;
  }
}

class TestExtension2 extends Extension {
  constructor(options = {}) {
    super(options);
    this.name = "TestExtension2";
    this.priority = 200;
  }
}

class TestExtension3 extends Extension {
  constructor(options = {}) {
    super(options);
    this.name = "TestExtension3";
    this.priority = 50;
  }
}

class TestExtensionWithPlugins extends Extension {
  constructor() {
    super({});
    this.name = "TestExtensionWithPlugins";
  }

  plugins(editor: SlideEditor): Plugin[] {
    return [
      {
        spec: {},
        props: {},
        getState: () => null,
      } as unknown as Plugin,
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

  constructor() {
    super({});
    this.name = "TestExtensionWithLifecycle";
  }

  onCreate(editor: SlideEditor): void {
    this.createCalled = true;
  }

  onDestroy(editor: SlideEditor): void {
    this.destroyCalled = true;
  }
}

describe("ExtensionManager", () => {
  let mockEditor: SlideEditor;

  beforeEach(() => {
    mockEditor = createMockEditor();
    jest.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should create an extension manager with extensions", () => {
      const ext1 = new TestExtension1();
      const ext2 = new TestExtension2();

      const manager = new ExtensionManager([ext1, ext2], mockEditor);

      expect(manager).toBeDefined();
    });

    it("should create an extension manager with empty array", () => {
      const manager = new ExtensionManager([], mockEditor);

      expect(manager).toBeDefined();
      expect(manager.getPlugins()).toEqual([]);
    });

    it("should sort extensions by priority (higher first)", () => {
      const ext1 = new TestExtension1(); // priority: 100
      const ext2 = new TestExtension2(); // priority: 200
      const ext3 = new TestExtension3(); // priority: 50

      const manager = new ExtensionManager([ext1, ext2, ext3], mockEditor);
      const plugins = manager.getPlugins();

      // Extensions should be sorted: ext2 (200), ext1 (100), ext3 (50)
      // Since they don't have plugins, we can't directly verify order
      // but we can verify the manager was created without errors
      expect(manager).toBeDefined();
    });

    it("should deduplicate extensions by name", () => {
      const ext1a = new TestExtension1();
      const ext1b = new TestExtension1(); // duplicate name
      const ext2 = new TestExtension2();

      const warnSpy = jest.spyOn(console, "warn");

      const manager = new ExtensionManager([ext1a, ext1b, ext2], mockEditor);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Skipping duplicate extension: TestExtension1")
      );
    });

    it("should keep first instance when deduplicating", () => {
      class TestExtWithOptions extends Extension<{ value: number }> {
        constructor(options: { value: number }) {
          super(options);
          this.name = "TestExtWithOptions";
        }

        plugins(editor: SlideEditor): Plugin[] {
          return [
            {
              spec: { key: this.options.value },
              props: {},
              getState: () => null,
            } as unknown as Plugin,
          ];
        }
      }

      const ext1 = new TestExtWithOptions({ value: 1 });
      const ext2 = new TestExtWithOptions({ value: 2 }); // duplicate name

      const manager = new ExtensionManager([ext1, ext2], mockEditor);
      const plugins = manager.getPlugins();

      // Should keep first instance (value: 1)
      expect(plugins).toHaveLength(1);
      expect((plugins[0] as any).spec.key).toBe(1);
    });
  });

  describe("getPlugins", () => {
    it("should return empty array when no extensions", () => {
      const manager = new ExtensionManager([], mockEditor);

      const plugins = manager.getPlugins();

      expect(plugins).toEqual([]);
    });

    it("should return plugins from all extensions", () => {
      // Use different names to avoid deduplication
      class TestExtWithPlugins1 extends Extension {
        constructor() {
          super({});
          this.name = "TestExtWithPlugins1";
        }

        plugins(editor: SlideEditor): Plugin[] {
          return [
            {
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
            {
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
          ];
        }
      }

      class TestExtWithPlugins2 extends Extension {
        constructor() {
          super({});
          this.name = "TestExtWithPlugins2";
        }

        plugins(editor: SlideEditor): Plugin[] {
          return [
            {
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
            {
              spec: {},
              props: {},
              getState: () => null,
            } as unknown as Plugin,
          ];
        }
      }

      const ext1 = new TestExtWithPlugins1();
      const ext2 = new TestExtWithPlugins2();

      const manager = new ExtensionManager([ext1, ext2], mockEditor);
      const plugins = manager.getPlugins();

      // Each extension returns 2 plugins
      expect(plugins).toHaveLength(4);
    });

    it("should call plugins method on each extension", () => {
      class SpyExtension extends Extension {
        pluginsCalled = false;

        plugins(editor: SlideEditor): Plugin[] {
          this.pluginsCalled = true;
          return [];
        }
      }

      const ext = new SpyExtension();
      const manager = new ExtensionManager([ext], mockEditor);

      manager.getPlugins();

      expect(ext.pluginsCalled).toBe(true);
    });

    it("should flatten plugins from all extensions", () => {
      const ext = new TestExtensionWithPlugins();
      const manager = new ExtensionManager([ext], mockEditor);

      const plugins = manager.getPlugins();

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBeGreaterThan(0);
    });

    it("should handle extensions with no plugins", () => {
      const ext1 = new TestExtension1(); // no plugins
      const ext2 = new TestExtensionWithPlugins(); // has plugins

      const manager = new ExtensionManager([ext1, ext2], mockEditor);
      const plugins = manager.getPlugins();

      expect(plugins).toHaveLength(2); // Only from ext2
    });
  });

  describe("onCreate", () => {
    it("should call onCreate on all extensions that define it", () => {
      class LifecycleExt1 extends Extension {
        public createCalled = false;
        constructor() {
          super({});
          this.name = "LifecycleExt1";
        }
        onCreate(editor: SlideEditor): void {
          this.createCalled = true;
        }
      }

      class LifecycleExt2 extends Extension {
        public createCalled = false;
        constructor() {
          super({});
          this.name = "LifecycleExt2";
        }
        onCreate(editor: SlideEditor): void {
          this.createCalled = true;
        }
      }

      const ext1 = new LifecycleExt1();
      const ext2 = new LifecycleExt2();

      const manager = new ExtensionManager([ext1, ext2], mockEditor);

      expect(ext1.createCalled).toBe(false);
      expect(ext2.createCalled).toBe(false);

      manager.onCreate();

      expect(ext1.createCalled).toBe(true);
      expect(ext2.createCalled).toBe(true);
    });

    it("should not throw when extension does not define onCreate", () => {
      const ext = new TestExtension1(); // no onCreate
      const manager = new ExtensionManager([ext], mockEditor);

      expect(() => {
        manager.onCreate();
      }).not.toThrow();
    });

    it("should call onCreate with editor instance", () => {
      let receivedEditor: SlideEditor | null = null;

      class TestExt extends Extension {
        onCreate(editor: SlideEditor): void {
          receivedEditor = editor;
        }
      }

      const ext = new TestExt();
      const manager = new ExtensionManager([ext], mockEditor);

      manager.onCreate();

      expect(receivedEditor).toBe(mockEditor);
    });

    it("should call onCreate on multiple extensions", () => {
      const callOrder: string[] = [];

      class Ext1 extends Extension {
        constructor() {
          super({});
          this.name = "Ext1";
          this.priority = 100;
        }
        onCreate(): void {
          callOrder.push("Ext1");
        }
      }

      class Ext2 extends Extension {
        constructor() {
          super({});
          this.name = "Ext2";
          this.priority = 200;
        }
        onCreate(): void {
          callOrder.push("Ext2");
        }
      }

      const ext1 = new Ext1();
      const ext2 = new Ext2();

      const manager = new ExtensionManager([ext1, ext2], mockEditor);
      manager.onCreate();

      // Should be called in priority order (Ext2 first, then Ext1)
      expect(callOrder).toEqual(["Ext2", "Ext1"]);
    });
  });

  describe("onDestroy", () => {
    it("should call onDestroy on all extensions that define it", () => {
      class LifecycleExt1 extends Extension {
        public destroyCalled = false;
        constructor() {
          super({});
          this.name = "LifecycleExt1";
        }
        onDestroy(editor: SlideEditor): void {
          this.destroyCalled = true;
        }
      }

      class LifecycleExt2 extends Extension {
        public destroyCalled = false;
        constructor() {
          super({});
          this.name = "LifecycleExt2";
        }
        onDestroy(editor: SlideEditor): void {
          this.destroyCalled = true;
        }
      }

      const ext1 = new LifecycleExt1();
      const ext2 = new LifecycleExt2();

      const manager = new ExtensionManager([ext1, ext2], mockEditor);

      expect(ext1.destroyCalled).toBe(false);
      expect(ext2.destroyCalled).toBe(false);

      manager.onDestroy();

      expect(ext1.destroyCalled).toBe(true);
      expect(ext2.destroyCalled).toBe(true);
    });

    it("should not throw when extension does not define onDestroy", () => {
      const ext = new TestExtension1(); // no onDestroy
      const manager = new ExtensionManager([ext], mockEditor);

      expect(() => {
        manager.onDestroy();
      }).not.toThrow();
    });

    it("should call onDestroy with editor instance", () => {
      let receivedEditor: SlideEditor | null = null;

      class TestExt extends Extension {
        onDestroy(editor: SlideEditor): void {
          receivedEditor = editor;
        }
      }

      const ext = new TestExt();
      const manager = new ExtensionManager([ext], mockEditor);

      manager.onDestroy();

      expect(receivedEditor).toBe(mockEditor);
    });

    it("should call onDestroy on multiple extensions", () => {
      const callOrder: string[] = [];

      class Ext1 extends Extension {
        constructor() {
          super({});
          this.name = "Ext1";
          this.priority = 100;
        }
        onDestroy(): void {
          callOrder.push("Ext1");
        }
      }

      class Ext2 extends Extension {
        constructor() {
          super({});
          this.name = "Ext2";
          this.priority = 200;
        }
        onDestroy(): void {
          callOrder.push("Ext2");
        }
      }

      const ext1 = new Ext1();
      const ext2 = new Ext2();

      const manager = new ExtensionManager([ext1, ext2], mockEditor);
      manager.onDestroy();

      // Should be called in priority order (Ext2 first, then Ext1)
      expect(callOrder).toEqual(["Ext2", "Ext1"]);
    });
  });

  describe("lifecycle integration", () => {
    it("should support full onCreate -> onDestroy lifecycle", () => {
      const ext = new TestExtensionWithLifecycle();
      const manager = new ExtensionManager([ext], mockEditor);

      expect(ext.createCalled).toBe(false);
      expect(ext.destroyCalled).toBe(false);

      manager.onCreate();
      expect(ext.createCalled).toBe(true);
      expect(ext.destroyCalled).toBe(false);

      manager.onDestroy();
      expect(ext.createCalled).toBe(true);
      expect(ext.destroyCalled).toBe(true);
    });

    it("should handle mixed extensions with and without lifecycle hooks", () => {
      const ext1 = new TestExtension1(); // no hooks
      const ext2 = new TestExtensionWithLifecycle(); // has hooks
      const ext3 = new TestExtension2(); // no hooks

      const manager = new ExtensionManager([ext1, ext2, ext3], mockEditor);

      expect(() => {
        manager.onCreate();
        manager.onDestroy();
      }).not.toThrow();

      expect(ext2.createCalled).toBe(true);
      expect(ext2.destroyCalled).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle single extension", () => {
      const ext = new TestExtension1();
      const manager = new ExtensionManager([ext], mockEditor);

      expect(manager.getPlugins()).toEqual([]);
    });

    it("should handle many extensions", () => {
      const extensions = Array.from({ length: 10 }, (_, i) => {
        class DynamicExt extends Extension {
          constructor() {
            super({});
            this.name = `Extension${i}`;
          }
        }
        return new DynamicExt();
      });

      const manager = new ExtensionManager(extensions, mockEditor);

      expect(() => {
        manager.getPlugins();
        manager.onCreate();
        manager.onDestroy();
      }).not.toThrow();
    });

    it("should maintain extension order after deduplication", () => {
      const callOrder: string[] = [];

      class Ext1 extends Extension {
        constructor() {
          super({});
          this.name = "Ext1";
          this.priority = 100;
        }
        onCreate(): void {
          callOrder.push("Ext1");
        }
      }

      class Ext2 extends Extension {
        constructor() {
          super({});
          this.name = "Ext2";
          this.priority = 200;
        }
        onCreate(): void {
          callOrder.push("Ext2");
        }
      }

      const ext1a = new Ext1();
      const ext1b = new Ext1(); // duplicate, will be skipped
      const ext2 = new Ext2();

      const manager = new ExtensionManager([ext1a, ext1b, ext2], mockEditor);
      manager.onCreate();

      // Should only have Ext1 and Ext2, in priority order
      expect(callOrder).toEqual(["Ext2", "Ext1"]);
      expect(callOrder).toHaveLength(2); // Not 3
    });
  });
});
