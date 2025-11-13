import { NodeSelection } from '@blockslides/pm/state'

export function isNodeSelection(value: unknown): value is NodeSelection {
  return value instanceof NodeSelection
}
