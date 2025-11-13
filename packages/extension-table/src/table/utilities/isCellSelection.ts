import { CellSelection } from '@blockslides/pm/tables'

export function isCellSelection(value: unknown): value is CellSelection {
  return value instanceof CellSelection
}
