import { EditorView } from "prosemirror-view";
import { createChainableState } from "./helpers/createChainableState";
import type {
  AnyCommands,
  SingleCommands,
  ChainedCommands,
  CanCommands,
  CommandProps,
} from "./types/commands";
import type { SlideEditor } from "./SlideEditor";

/**
 * CommandManager
 * 
 * Orchestrates command execution with three different modes:
 * 
 * 1. **Direct execution** (`.commands`):
 *    - Executes command immediately
 *    - Calls dispatch to update the editor
 *    - Returns boolean indicating success
 * 
 * 2. **Chained execution** (`.chain()`):
 *    - Batches multiple commands into a single transaction
 *    - Commands see changes from previous commands in chain
 *    - Must call `.run()` to execute
 *    - Returns boolean indicating overall success
 * 
 * 3. **Dry-run testing** (`.can()`):
 *    - Tests if a command can execute without applying changes
 *    - Does not call dispatch
 *    - Returns boolean indicating if command would succeed
 * 
 * This architecture is based on Tiptap's battle-tested CommandManager.
 * 
 * @example
 * ```typescript
 * // Direct execution
 * editor.commands.toggleBold();
 * 
 * // Chained execution
 * editor.chain()
 *   .toggleBold()
 *   .toggleItalic()
 *   .run();
 * 
 * // Dry-run testing
 * if (editor.can().toggleBold()) {
 *   // Bold can be toggled
 * }
 * ```
 */
export class CommandManager {
  private editor: SlideEditor;
  private rawCommands: AnyCommands;

  constructor(editor: SlideEditor, rawCommands: AnyCommands) {
    this.editor = editor;
    this.rawCommands = rawCommands;
  }

  /**
   * Get the editor's view
   */
  private get view(): EditorView {
    if (!this.editor.view) {
      throw new Error("Editor view is not available");
    }
    return this.editor.view;
  }

  /**
   * Direct command execution
   * 
   * Returns an object where each command immediately executes when called.
   * Each command returns a boolean indicating success.
   */
  public get commands(): SingleCommands {
    return Object.fromEntries(
      Object.entries(this.rawCommands).map(([name, command]) => {
        return [
          name,
          (...args: any[]) => {
            const state = this.view.state;
            const dispatch = this.view.dispatch.bind(this.view);
            const tr = state.tr;

            const props: CommandProps = {
              editor: this.editor,
              state,
              view: this.view,
              tr,
              dispatch,
              commands: this.commands,
              chain: () => this.chain(),
              can: () => this.can(),
            };

            return command(...args)(props);
          },
        ];
      })
    ) as SingleCommands;
  }

  /**
   * Chained command execution
   * 
   * Returns an object where commands are batched into a single transaction.
   * Commands in the chain see changes from previous commands.
   * Must call `.run()` to execute the entire chain.
   */
  public chain(): ChainedCommands {
    const state = this.view.state;
    const dispatch = this.view.dispatch.bind(this.view);
    let tr = state.tr;
    let hasCommands = false;

    const chain = Object.fromEntries(
      Object.entries(this.rawCommands).map(([name, command]) => {
        return [
          name,
          (...args: any[]) => {
            // Create chainable state that reflects transaction changes
            const chainableState = createChainableState({
              state,
              transaction: tr,
            });

            const props: CommandProps = {
              editor: this.editor,
              state: chainableState,
              view: this.view,
              tr,
              dispatch: undefined, // No dispatch in chain - only on .run()
              commands: this.commands,
              chain: () => this.chain(),
              can: () => this.can(),
            };

            // Execute command - it modifies tr
            const commandResult = command(...args)(props);

            // Track that we have at least one command
            if (commandResult) {
              hasCommands = true;
            }

            // Return the chain for further chaining
            return chain;
          },
        ];
      })
    ) as ChainedCommands;

    // Add the .run() method to execute the chain
    (chain as any).run = () => {
      if (!hasCommands) {
        return false;
      }

      // Dispatch the accumulated transaction
      dispatch(tr);
      return true;
    };

    return chain;
  }

  /**
   * Dry-run command testing
   * 
   * Returns an object where commands can be tested without applying changes.
   * Each command returns a boolean indicating if it would succeed.
   * Does not modify the editor state.
   */
  public can(): CanCommands {
    return Object.fromEntries(
      Object.entries(this.rawCommands).map(([name, command]) => {
        return [
          name,
          (...args: any[]) => {
            const state = this.view.state;
            const tr = state.tr;

            const props: CommandProps = {
              editor: this.editor,
              state,
              view: this.view,
              tr,
              dispatch: undefined, // No dispatch in can() - just testing
              commands: this.commands,
              chain: () => this.chain(),
              can: () => this.can(),
            };

            return command(...args)(props);
          },
        ];
      })
    ) as CanCommands;
  }
}
