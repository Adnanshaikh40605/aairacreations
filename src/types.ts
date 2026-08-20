export type Role = 'owner' | 'staff'

export type ProductStatus =
  | 'purchased'
  | 'received'
  | 'costing'
  | 'under_repair'
  | 'ready_for_sale'
  | 'available'
  | 'reserved'
  | 'sold'
  | 'not_available'

export type CostCategory =
  | 'transport'
  | 'loading'
  | 'unloading'
  | 'repair'
  | 'polishing'
  | 'packaging'
  | 'other'

export type ExpenseGroup =
  | 'showroom'
  | 'staff'
  | 'marketing'
  | 'operations'
  | 'office'
  | 'finance'
  | 'other'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  showroomId: string | null
}

export interface AuthSession {
  token: string
  user: User
}

export interface Showroom {
  id: string
  name: string
  city: string
  address: string
}

export interface CostLine {
  id: string
  productId: string
  label: string
  category: CostCategory
  amount: number
}

export interface MaterialLine {
  id: string
  productId: string
  name: string
  qty: number
  unit: string
  unitCost: number
}

export interface LabourLine {
  id: string
  productId: string
  workType: string
  amount: number
}

export interface Product {
  id: string
  name: string
  code: string
  category: string
  subcategory: string
  brand: string
  material: string
  woodType: string
  color: string
  finish: string
  size: string
  dimensions: string
  condition: string
  purchaseDate: string
  supplier: string
  purchasedFrom: string
  description: string
  imageUrl: string
  showroomId: string
  status: ProductStatus
  quantity: number
  purchasePrice: number
  sellingPrice: number
  costLines: CostLine[]
  materials: MaterialLine[]
  labour: LabourLine[]
}

export interface Sale {
  id: string
  productId: string
  showroomId: string
  soldAt: string
  quantity: number
  unitPrice: number
  deliveryCharge: number
  notes: string
}

export interface Expense {
  id: string
  showroomId: string
  group: ExpenseGroup
  category: string
  amount: number
  month: string
  incurredOn: string
  note: string
}

export interface StaffProfile {
  id: string
  name: string
  designation: string
  showroomId: string
  salary: number
  joiningDate: string
  status: 'active' | 'inactive'
}

export interface MarketingBudget {
  id: string
  showroomId: string
  month: string
  budget: number
}

export interface ProductInput {
  name: string
  code: string
  category: string
  subcategory?: string
  brand?: string
  material?: string
  woodType?: string
  color?: string
  finish?: string
  size?: string
  dimensions?: string
  condition?: string
  purchaseDate?: string
  supplier?: string
  purchasedFrom?: string
  description?: string
  imageUrl?: string
  showroomId: string
  quantity?: number
  purchasePrice: number
  sellingPrice?: number
}

export interface CostingInput {
  purchasePrice: number
  costLines: Array<Omit<CostLine, 'id' | 'productId'>>
  materials: Array<Omit<MaterialLine, 'id' | 'productId'>>
  labour: Array<Omit<LabourLine, 'id' | 'productId'>>
}

export interface SaleInput {
  productId: string
  showroomId: string
  soldAt?: string
  quantity: number
  unitPrice: number
  deliveryCharge?: number
  notes?: string
}

export interface ExpenseInput {
  showroomId: string
  group: ExpenseGroup
  category: string
  amount: number
  incurredOn: string
  note?: string
}

export interface StaffInput {
  name: string
  designation: string
  showroomId: string
  salary: number
  joiningDate: string
  status?: 'active' | 'inactive'
}

export interface InventoryCounts {
  total: number
  available: number
  reserved: number
  underRepair: number
  readyForSale: number
  sold: number
  notAvailable: number
  inventoryCost: number
}

export interface ShowroomHealth {
  showroomId: string
  name: string
  city: string
  revenue: number
  expenses: number
  profit: number
  marginPct: number
  status: 'good' | 'watch'
}

export interface OverviewReport {
  month: string
  showroomId: string | null
  revenue: number
  cogs: number
  grossProfit: number
  opex: number
  netProfit: number
  marginPct: number
  inventory: InventoryCounts
  bestSeller: string
  highestRevenue: string
  highestProfit: string
  slowMoving: string
  expensesByGroup: Record<ExpenseGroup, number>
  showrooms: ShowroomHealth[]
}

export interface PnlReport {
  month: string
  showroomId: string | null
  sales: number
  productCost: number
  grossProfit: number
  operatingExpenses: number
  netOperatingProfit: number
  prevMonth: { month: string; netOperatingProfit: number; sales: number }
  prevYear: { month: string; netOperatingProfit: number; sales: number }
}

export interface BreakEvenReport {
  month: string
  showroomId: string | null
  fixedOpex: number
  avgGrossProfitPerPiece: number
  unitsNeeded: number
  unitsSold: number
}

export interface ProductProfitRow {
  productId: string
  name: string
  code: string
  showroomId: string
  finishedCost: number
  sellingPrice: number
  profit: number
  marginPct: number
  status: ProductStatus
}

export interface MonthQuery {
  month?: string
  showroomId?: string
}
