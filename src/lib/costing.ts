import type { CostLine, LabourLine, MaterialLine, Product } from '../types.ts'

export interface CostingParts {
  purchasePrice: number
  costLines: Pick<CostLine, 'amount'>[]
  materials: Pick<MaterialLine, 'qty' | 'unitCost'>[]
  labour: Pick<LabourLine, 'amount'>[]
}

export function additionalDirectCost(parts: CostingParts): number {
  const lines = parts.costLines.reduce((sum, line) => sum + line.amount, 0)
  const materials = parts.materials.reduce(
    (sum, line) => sum + line.qty * line.unitCost,
    0,
  )
  const labour = parts.labour.reduce((sum, line) => sum + line.amount, 0)
  return lines + materials + labour
}

/** purchase + transport + loading + materials + labour + other direct */
export function finishedCost(parts: CostingParts): number {
  return parts.purchasePrice + additionalDirectCost(parts)
}

export function productFinishedCost(product: Product): number {
  return finishedCost(product)
}

export function suggestedPrice(cost: number, targetMarginPct: number): number {
  if (targetMarginPct >= 100) return cost
  return cost / (1 - targetMarginPct / 100)
}

export function grossProfit(selling: number, cost: number): number {
  return selling - cost
}

export function grossMarginPct(selling: number, cost: number): number {
  if (selling === 0) return 0
  return ((selling - cost) / selling) * 100
}

export function breakEvenUnits(fixedOpex: number, avgGrossPerPiece: number): number {
  if (avgGrossPerPiece <= 0) return 0
  return Math.ceil(fixedOpex / avgGrossPerPiece)
}
