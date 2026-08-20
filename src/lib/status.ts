import type { ProductStatus } from '../types.ts'

export const STATUS_LABEL: Record<ProductStatus, string> = {
  purchased: 'Purchased',
  received: 'Received',
  costing: 'Costing',
  under_repair: 'Under Repair',
  ready_for_sale: 'Ready for Sale',
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  not_available: 'Not Available',
}

export const STATUS_COLOR: Record<ProductStatus, string> = {
  purchased: 'bg-hint',
  received: 'bg-repair',
  costing: 'bg-repair',
  under_repair: 'bg-repair',
  ready_for_sale: 'bg-ready',
  available: 'bg-available',
  reserved: 'bg-reserved',
  sold: 'bg-sold',
  not_available: 'bg-na',
}

export const STATUS_TINT: Record<ProductStatus, string> = {
  purchased: 'bg-na-soft text-na',
  received: 'bg-repair-soft text-repair',
  costing: 'bg-repair-soft text-repair',
  under_repair: 'bg-repair-soft text-repair',
  ready_for_sale: 'bg-ready-soft text-ready',
  available: 'bg-available-soft text-available',
  reserved: 'bg-reserved-soft text-reserved',
  sold: 'bg-sold-soft text-sold',
  not_available: 'bg-na-soft text-na',
}

export const LIFECYCLE: ProductStatus[] = [
  'purchased',
  'received',
  'costing',
  'under_repair',
  'ready_for_sale',
  'available',
  'reserved',
  'sold',
]

export const FLOOR_STATUSES: ProductStatus[] = [
  'available',
  'reserved',
  'under_repair',
  'ready_for_sale',
  'sold',
  'not_available',
]
