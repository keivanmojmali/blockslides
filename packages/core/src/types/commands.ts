import type { EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { SlideEditor } from '../SlideEditor';

/**
 * Props passed to every command function
 * Contains all context needed to execute a command
 */
export interface CommandProps {
  /** Reference to the editor instance */
  editor: SlideEditor;
  
  /** Current editor state (possibly chainable state) */
  state: EditorState;
  
  /** The editor view */
  view: EditorView;
  
  /** The transaction being built */
  tr: Transaction;
  
  /** Dispatch function (undefined for dry-run mode) */
  dispatch?: ((tr: Transaction) => void) | undefined;
  
  /** Access to all commands for composition */
  commands: SingleCommands;
  
  /** Create a command chain */
  chain: () => ChainedCommands;
  
  /** Test if commands can be executed */
  can: () => CanCommands;
}

/**
 * A raw command function that receives CommandProps and returns a value
 * This is what extensions return from addCommands()
 * 
 * Most commands return boolean (success/failure), but some return other types:
 * - getSelectedText() returns string
 * - getUndoDepth() returns number
 * - getSlideInfo() returns SlideInfo object
 */
export type RawCommand = (...args: any[]) => (props: CommandProps) => any;

/**
 * Object containing raw command definitions (from extensions)
 * Used in Extension.addCommands() and ExtensionManager.getCommands()
 */
export type AnyCommands = Record<string, RawCommand>;

/**
 * Commands that execute immediately and return a value
 * Most return boolean, but some return other types (string, number, objects)
 * This is what you get from editor.commands.*
 */
export type SingleCommands = Record<string, (...args: any[]) => any>;

/**
 * Commands that can be chained and must call .run() to execute
 * This is what you get from editor.chain().*
 */
export type ChainedCommands = Record<string, (...args: any[]) => ChainedCommands> & {
  /** Execute all chained commands */
  run: () => boolean;
};

/**
 * Commands in dry-run mode that test without executing
 * This is what you get from editor.can().*
 */
export type CanCommands = SingleCommands & {
  /** Create a chain in dry-run mode */
  chain: () => ChainedCommands;
};
