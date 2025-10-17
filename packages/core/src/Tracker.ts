/**
 * Tracker for AutoArtifacts Slide Editor
 *
 * Copied from @tiptap/core
 * Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 * https://github.com/ueberdosis/tiptap
 */

import type { Transaction } from "prosemirror-state";

export interface TrackerResult {
  position: number;
  deleted: boolean;
}

/**
 * Tracker
 *
 * Tracks how positions change through transaction steps.
 * Useful for commands that need to maintain accurate positions
 * during document transformations (insertions, deletions, etc.)
 *
 * @example
 * const tracker = new Tracker(tr)
 * const result = tracker.map(initialPosition)
 * if (!result.deleted) {
 *   // Use result.position
 * }
 */
export class Tracker {
  transaction: Transaction;

  currentStep: number;

  constructor(transaction: Transaction) {
    this.transaction = transaction;
    this.currentStep = this.transaction.steps.length;
  }

  /**
   * Map a position through all transaction steps since tracker creation
   *
   * @param position - The position to track
   * @returns Object with mapped position and deletion status
   */
  map(position: number): TrackerResult {
    let deleted = false;

    const mappedPosition = this.transaction.steps
      .slice(this.currentStep)
      .reduce((newPosition, step) => {
        const mapResult = step.getMap().mapResult(newPosition);

        if (mapResult.deleted) {
          deleted = true;
        }

        return mapResult.pos;
      }, position);

    return {
      position: mappedPosition,
      deleted,
    };
  }
}
