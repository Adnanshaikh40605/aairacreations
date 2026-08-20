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
