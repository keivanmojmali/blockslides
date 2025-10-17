import type { Node as ProseMirrorNode } from '@autoartifacts/pm/model'
import type { Transaction } from '@autoartifacts/pm/state'
import { Transform } from '@autoartifacts/pm/transform'

/**
 * Returns a new `Transform` based on all steps of the passed transactions.
 * @param oldDoc The Prosemirror node to start from
 * @param transactions The transactions to combine
 * @returns A new `Transform` with all steps of the passed transactions
 */
export function combineTransactionSteps(oldDoc: ProseMirrorNode, transactions: Transaction[]): Transform {
  const transform = new Transform(oldDoc)

  transactions.forEach(transaction => {
    transaction.steps.forEach(step => {
      transform.step(step)
    })
  })

  return transform
}
