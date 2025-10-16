import { EditorState, Transaction } from "prosemirror-state";

/**
 * Creates a proxy EditorState that tracks transaction changes during command chaining.
 * 
 * When chaining commands with `.chain()`, each command needs to see the state changes
 * from previous commands in the chain. This helper creates a proxy that intercepts
 * access to `doc`, `selection`, and `storedMarks` properties and returns the current
 * values from the transaction instead of the original state.
 * 
 * This enables commands in a chain to work correctly even though `dispatch` is not
 * called until `.run()` is invoked at the end of the chain.
 * 
 * @example
 * ```typescript
 * const chainableState = createChainableState(state, tr);
 * // Commands can now access tr.doc, tr.selection, tr.storedMarks
 * // through the state proxy
 * ```
 * 
 * @param config - Configuration object
 * @param config.state - The original editor state
 * @param config.transaction - The transaction tracking changes
 * @returns A proxy EditorState that reflects transaction changes
 */
export function createChainableState(config: {
  state: EditorState;
  transaction: Transaction;
}): EditorState {
  const { state, transaction } = config;

  return new Proxy(state, {
    get(target, prop) {
      // Intercept doc access - return the document from the transaction
      if (prop === "doc") {
        return transaction.doc;
      }

      // Intercept selection access - return the selection from the transaction
      if (prop === "selection") {
        return transaction.selection;
      }

      // Intercept storedMarks access - return stored marks from the transaction
      if (prop === "storedMarks") {
        return transaction.storedMarks;
      }

      // For all other properties, return from the original state
      return (target as any)[prop];
    },
  });
}
