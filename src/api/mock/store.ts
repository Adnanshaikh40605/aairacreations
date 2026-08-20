import { breakEvenUnits, productFinishedCost } from '../../lib/costing.ts'
import { currentMonth, monthKeyFromDate, shiftMonth } from '../../lib/money.ts'
import type {
  BreakEvenReport,
  CostLine,
  CostingInput,
  Expense,
  ExpenseGroup,
  ExpenseInput,
  InventoryCounts,
  LabourLine,
  MarketingBudget,
  MaterialLine,
  MonthQuery,
  OverviewReport,
  PnlReport,
  Product,
  ProductInput,
  ProductProfitRow,
  ProductStatus,
  Role,
  Sale,
  SaleInput,
  Showroom,
  ShowroomHealth,
  StaffInput,
  StaffProfile,
  User,
} from '../../types.ts'

const MONTH = '2026-08'
const PREV = '2026-07'
const YEAR_AGO = '2025-08'

let seq = 100
function nid(prefix: string): string {
  seq += 1
  return `${prefix}_${seq}`
}

const showrooms: Showroom[] = [
  {
    id: 'sr_mumbai',
    name: 'Mumbai Showroom',
    city: 'Mumbai',
    address: '14 Turner Road, Bandra West',
  },
  {
    id: 'sr_pune',
    name: 'Pune Showroom',
    city: 'Pune',
    address: 'North Main Road, Koregaon Park',
  },
  {
    id: 'sr_lonavala',
    name: 'Lonavala Showroom',
    city: 'Lonavala',
    address: 'Old Mumbai-Pune Highway',
  },
]

interface DbUser extends User {
  password: string
}

const users: DbUser[] = [
  {
    id: 'user_owner',
    email: 'nandini@aaira.in',
    name: 'Nandini Rao',
    role: 'owner',
    showroomId: null,
    password: 'aaira123',
  },
  {
    id: 'user_staff',
    email: 'rahul@aaira.in',
    name: 'Rahul Deshmukh',
    role: 'staff',
    showroomId: 'sr_lonavala',
    password: 'aaira123',
  },
]

const staff: StaffProfile[] = [
  {
    id: 'st_rahul',
    name: 'Rahul Deshmukh',
    designation: 'Sales Executive',
    showroomId: 'sr_lonavala',
    salary: 25000,
    joiningDate: '2024-03-12',
    status: 'active',
  },
  {
    id: 'st_amit',
    name: 'Amit Kamble',
    designation: 'Carpenter',
    showroomId: 'sr_lonavala',
    salary: 30000,
    joiningDate: '2023-11-02',
    status: 'active',
  },
  {
    id: 'st_meera',
    name: 'Meera Joshi',
    designation: 'Sales Executive',
    showroomId: 'sr_lonavala',
    salary: 28000,
    joiningDate: '2025-01-08',
    status: 'active',
  },
  {
    id: 'st_vikram',
    name: 'Vikram Pawar',
    designation: 'Floor Helper',
    showroomId: 'sr_lonavala',
    salary: 22000,
    joiningDate: '2025-06-01',
    status: 'active',
  },
  {
    id: 'st_sneha',
    name: 'Sneha Patil',
    designation: 'Reception',
    showroomId: 'sr_lonavala',
    salary: 15000,
    joiningDate: '2025-04-18',
    status: 'active',
  },
  {
    id: 'st_sameer',
    name: 'Sameer Kulkarni',
    designation: 'Manager',
    showroomId: 'sr_pune',
    salary: 40000,
    joiningDate: '2022-08-01',
    status: 'active',
  },
  {
    id: 'st_isha',
    name: 'Isha Banerjee',
    designation: 'Sales Lead',
    showroomId: 'sr_mumbai',
    salary: 45000,
    joiningDate: '2023-02-14',
    status: 'active',
  },
  {
    id: 'st_farhan',
    name: 'Farhan Qureshi',
    designation: 'Carpenter',
    showroomId: 'sr_mumbai',
    salary: 32000,
    joiningDate: '2024-07-09',
    status: 'active',
  },
]

function img(seed: string): string {
  return `https://picsum.photos/seed/${seed}/800/600`
}

function lines(
  productId: string,
  items: Array<Omit<CostLine, 'id' | 'productId'>>,
): CostLine[] {
  return items.map((item) => ({ ...item, id: nid('cl'), productId }))
}

function mats(
  productId: string,
  items: Array<Omit<MaterialLine, 'id' | 'productId'>>,
): MaterialLine[] {
  return items.map((item) => ({ ...item, id: nid('ml'), productId }))
}

function labs(
  productId: string,
  items: Array<Omit<LabourLine, 'id' | 'productId'>>,
): LabourLine[] {
  return items.map((item) => ({ ...item, id: nid('lb'), productId }))
}

const products: Product[] = []

function addProduct(p: Omit<Product, 'costLines' | 'materials' | 'labour'> & {
  costLines?: Omit<CostLine, 'id' | 'productId'>[]
  materials?: Omit<MaterialLine, 'id' | 'productId'>[]
  labour?: Omit<LabourLine, 'id' | 'productId'>[]
}): Product {
  const product: Product = {
    ...p,
    costLines: lines(p.id, p.costLines ?? []),
    materials: mats(p.id, p.materials ?? []),
    labour: labs(p.id, p.labour ?? []),
  }
  products.push(product)
  return product
}

/** Canonical spec example: finished ₹44,300, sell ₹62,000, GP ₹17,700 */
addProduct({
  id: 'pr_royal_teak_sofa',
  name: 'Royal Teak Sofa',
  code: 'AC-SOF-001',
  category: 'Sofa',
  subcategory: '3-seater',
  brand: 'AAIRA',
  material: 'Teak Wood',
  woodType: 'Teak',
  color: 'Honey',
  finish: 'Hand-polished',
  size: '3-seater',
  dimensions: '210 × 85 × 90 cm',
  condition: 'Refurbished',
  purchaseDate: '2026-07-14',
  supplier: 'Sawant Timber Yard',
  purchasedFrom: 'Alibaug lot',
  description: 'Refurbished teak sofa, Lonavala floor piece. Costing example from the spec.',
  imageUrl: img('royal-teak-sofa'),
  showroomId: 'sr_lonavala',
  status: 'available',
  quantity: 1,
  purchasePrice: 35000,
  sellingPrice: 62000,
  costLines: [
    { label: 'Transportation', category: 'transport', amount: 2000 },
    { label: 'Loading', category: 'loading', amount: 500 },
    { label: 'Unloading', category: 'unloading', amount: 300 },
    { label: 'Packaging', category: 'packaging', amount: 300 },
    { label: 'Other', category: 'other', amount: 200 },
  ],
  materials: [
    { name: 'Teak Wood', qty: 2, unit: 'pcs', unitCost: 800 },
    { name: 'Polish', qty: 1, unit: 'L', unitCost: 400 },
    { name: 'Fabric', qty: 5, unit: 'm', unitCost: 200 },
    { name: 'Foam', qty: 2, unit: 'pcs', unitCost: 250 },
    { name: 'Screws', qty: 1, unit: 'box', unitCost: 150 },
  ],
  labour: [
    { workType: 'Carpenter', amount: 800 },
    { workType: 'Polishing', amount: 900 },
    { workType: 'Upholstery', amount: 500 },
    { workType: 'Cleaning', amount: 150 },
  ],
})

addProduct({
  id: 'pr_dining',
  name: 'Sheesham Dining Table',
  code: 'AC-DIN-014',
  category: 'Dining',
  subcategory: '6-seater',
  brand: 'AAIRA',
  material: 'Sheesham',
  woodType: 'Sheesham',
  color: 'Walnut',
  finish: 'Matte',
  size: '6-seater',
  dimensions: '180 × 90 × 76 cm',
  condition: 'New',
  purchaseDate: '2026-06-20',
  supplier: 'Pune Wood Co',
  purchasedFrom: 'Wholesale yard',
  description: 'Six-seater dining with tapered legs.',
  imageUrl: img('sheesham-dining'),
  showroomId: 'sr_pune',
  status: 'available',
  quantity: 1,
  purchasePrice: 24000,
  sellingPrice: 48000,
  costLines: [
    { label: 'Transportation', category: 'transport', amount: 1800 },
    { label: 'Loading', category: 'loading', amount: 400 },
    { label: 'Unloading', category: 'unloading', amount: 200 },
    { label: 'Packaging', category: 'packaging', amount: 400 },
  ],
  materials: [{ name: 'Sheesham board', qty: 3, unit: 'pcs', unitCost: 1200 }],
  labour: [
    { workType: 'Carpenter', amount: 2000 },
    { workType: 'Polishing', amount: 1200 },
  ],
})

addProduct({
  id: 'pr_king_bed',
  name: 'King Teak Bed',
  code: 'AC-BED-009',
  category: 'Bed',
  subcategory: 'King',
  brand: 'AAIRA',
  material: 'Teak Wood',
  woodType: 'Teak',
  color: 'Natural',
  finish: 'Oil',
  size: 'King',
  dimensions: '198 × 188 × 110 cm',
  condition: 'Refurbished',
  purchaseDate: '2026-05-11',
  supplier: 'Sawant Timber Yard',
  purchasedFrom: 'Mumbai lot',
  description: 'King bed with cane headboard.',
  imageUrl: img('king-teak-bed'),
  showroomId: 'sr_mumbai',
  status: 'available',
  quantity: 1,
  purchasePrice: 28000,
  sellingPrice: 55000,
  costLines: [
    { label: 'Transportation', category: 'transport', amount: 2200 },
    { label: 'Loading', category: 'loading', amount: 600 },
    { label: 'Unloading', category: 'unloading', amount: 400 },
    { label: 'Repair', category: 'repair', amount: 1800 },
    { label: 'Polishing', category: 'polishing', amount: 2500 },
  ],
  materials: [{ name: 'Cane mesh', qty: 2, unit: 'm', unitCost: 700 }],
  labour: [{ workType: 'Assembly', amount: 1800 }],
})

addProduct({
  id: 'pr_cabinet',
  name: 'Royal Cabinet',
  code: 'AC-CAB-022',
  category: 'Storage',
  subcategory: 'Cabinet',
  brand: 'AAIRA',
  material: 'Teak Wood',
  woodType: 'Teak',
  color: 'Dark honey',
  finish: 'Gloss',
  size: 'Tall',
  dimensions: '90 × 45 × 180 cm',
  condition: 'Used',
  purchaseDate: '2026-02-03',
  supplier: 'Estate sale',
  purchasedFrom: 'Bandra apartment',
  description: 'Slow-moving tall cabinet.',
  imageUrl: img('royal-cabinet'),
  showroomId: 'sr_mumbai',
  status: 'available',
  quantity: 1,
  purchasePrice: 18000,
  sellingPrice: 36000,
  costLines: [{ label: 'Transportation', category: 'transport', amount: 1200 }],
  materials: [],
  labour: [{ workType: 'Polishing', amount: 1800 }],
})

addProduct({
  id: 'pr_cane_lounge',
  name: 'Cane Lounge Chair',
  code: 'AC-CHR-031',
  category: 'Chair',
  subcategory: 'Lounge',
  brand: 'AAIRA',
  material: 'Cane',
  woodType: 'Teak',
  color: 'Natural',
  finish: 'Cane weave',
  size: 'Single',
  dimensions: '70 × 80 × 85 cm',
  condition: 'Repair',
  purchaseDate: '2026-08-02',
  supplier: 'Lonavala crafts',
  purchasedFrom: 'Workshop',
  description: 'Seat weave being redone.',
  imageUrl: img('cane-lounge'),
  showroomId: 'sr_lonavala',
  status: 'under_repair',
  quantity: 1,
  purchasePrice: 9000,
  sellingPrice: 18000,
  costLines: [{ label: 'Transportation', category: 'transport', amount: 400 }],
  materials: [{ name: 'Cane strips', qty: 4, unit: 'bundle', unitCost: 350 }],
  labour: [{ workType: 'Repair', amount: 800 }],
})

addProduct({
  id: 'pr_sideboard',
  name: 'Walnut Sideboard',
  code: 'AC-SID-011',
  category: 'Storage',
  subcategory: 'Sideboard',
  brand: 'AAIRA',
  material: 'Walnut',
  woodType: 'Walnut',
  color: 'Walnut',
  finish: 'Satin',
  size: 'Low',
  dimensions: '160 × 45 × 80 cm',
  condition: 'New',
  purchaseDate: '2026-07-28',
  supplier: 'Pune Wood Co',
  purchasedFrom: 'Workshop',
  description: 'Ready after polish.',
  imageUrl: img('walnut-sideboard'),
  showroomId: 'sr_pune',
  status: 'ready_for_sale',
  quantity: 1,
  purchasePrice: 22000,
  sellingPrice: 42000,
  costLines: [
    { label: 'Transportation', category: 'transport', amount: 900 },
    { label: 'Polishing', category: 'polishing', amount: 1600 },
  ],
  materials: [],
  labour: [{ workType: 'Carpenter', amount: 1200 }],
})

addProduct({
  id: 'pr_rocking',
  name: 'Teak Rocking Chair',
  code: 'AC-CHR-018',
  category: 'Chair',
  subcategory: 'Rocking',
  brand: 'AAIRA',
  material: 'Teak Wood',
  woodType: 'Teak',
  color: 'Honey',
  finish: 'Oil',
  size: 'Single',
  dimensions: '65 × 95 × 100 cm',
  condition: 'Refurbished',
  purchaseDate: '2026-07-01',
  supplier: 'Estate sale',
  purchasedFrom: 'Pune',
  description: 'Held for a Bandra client.',
  imageUrl: img('teak-rocking'),
  showroomId: 'sr_mumbai',
  status: 'reserved',
  quantity: 1,
  purchasePrice: 11000,
  sellingPrice: 24000,
  costLines: [{ label: 'Transportation', category: 'transport', amount: 700 }],
  materials: [],
  labour: [{ workType: 'Polishing', amount: 900 }],
})

addProduct({
  id: 'pr_console',
  name: 'Brass Mirror Console',
  code: 'AC-CON-007',
  category: 'Console',
  subcategory: 'Hall',
  brand: 'AAIRA',
  material: 'Teak Wood',
  woodType: 'Teak',
  color: 'Brass inlay',
  finish: 'Mixed',
  size: 'Hall',
  dimensions: '120 × 35 × 80 cm',
  condition: 'Costing',
  purchaseDate: '2026-08-12',
  supplier: 'Sawant Timber Yard',
  purchasedFrom: 'Mumbai lot',
  description: 'Awaiting material lines.',
  imageUrl: img('brass-console'),
  showroomId: 'sr_mumbai',
  status: 'costing',
  quantity: 1,
  purchasePrice: 16000,
  sellingPrice: 0,
  costLines: [{ label: 'Transportation', category: 'transport', amount: 800 }],
  materials: [],
  labour: [],
})

addProduct({
  id: 'pr_coffee',
  name: 'Teak Coffee Table',
  code: 'AC-TAB-019',
  category: 'Table',
  subcategory: 'Coffee',
  brand: 'AAIRA',
  material: 'Teak Wood',
  woodType: 'Teak',
  color: 'Honey',
  finish: 'Matte',
  size: 'Low',
  dimensions: '110 × 60 × 42 cm',
  condition: 'New',
  purchaseDate: '2026-06-08',
  supplier: 'Pune Wood Co',
  purchasedFrom: 'Yard',
  description: 'Live-edge coffee table.',
  imageUrl: img('teak-coffee'),
  showroomId: 'sr_pune',
  status: 'available',
  quantity: 2,
  purchasePrice: 9000,
  sellingPrice: 18500,
  costLines: [{ label: 'Transportation', category: 'transport', amount: 500 }],
  materials: [],
  labour: [{ workType: 'Polishing', amount: 700 }],
})

addProduct({
  id: 'pr_ottoman',
  name: 'Jute Ottoman Pair',
  code: 'AC-OTT-004',
  category: 'Seating',
  subcategory: 'Ottoman',
  brand: 'AAIRA',
  material: 'Jute',
  woodType: 'Sheesham',
  color: 'Natural',
  finish: 'Upholstered',
  size: 'Pair',
  dimensions: '45 × 45 × 40 cm',
  condition: 'Purchased',
  purchaseDate: '2026-08-18',
  supplier: 'Lonavala crafts',
  purchasedFrom: 'Workshop',
  description: 'Just arrived, not received on floor yet.',
  imageUrl: img('jute-ottoman'),
  showroomId: 'sr_lonavala',
  status: 'purchased',
  quantity: 2,
  purchasePrice: 3500,
  sellingPrice: 0,
  costLines: [],
  materials: [],
  labour: [],
})

addProduct({
  id: 'pr_door',
  name: 'Carved Door Panel',
  code: 'AC-DOR-002',
  category: 'Architectural',
  subcategory: 'Door',
  brand: 'AAIRA',
  material: 'Teak Wood',
  woodType: 'Teak',
  color: 'Antique',
  finish: 'Carved',
  size: 'Standard',
  dimensions: '90 × 8 × 210 cm',
  condition: 'Received',
  purchaseDate: '2026-08-16',
  supplier: 'Estate sale',
  purchasedFrom: 'Lonavala bungalow',
  description: 'Received, costing next.',
  imageUrl: img('carved-door'),
  showroomId: 'sr_mumbai',
  status: 'received',
  quantity: 1,
  purchasePrice: 14000,
  sellingPrice: 0,
  costLines: [{ label: 'Transportation', category: 'transport', amount: 1100 }],
  materials: [],
  labour: [],
})

function soldProduct(
  id: string,
  name: string,
  code: string,
  showroomId: string,
  purchase: number,
  sell: number,
  extra = 4000,
): Product {
  return addProduct({
    id,
    name,
    code,
    category: 'Sold lot',
    subcategory: 'August',
    brand: 'AAIRA',
    material: 'Teak Wood',
    woodType: 'Teak',
    color: 'Honey',
    finish: 'Mixed',
    size: '-',
    dimensions: '-',
    condition: 'Sold',
    purchaseDate: '2026-05-01',
    supplier: 'Mixed',
    purchasedFrom: 'Yard',
    description: 'Sold in August 2026.',
    imageUrl: img(id),
    showroomId,
    status: 'sold',
    quantity: 0,
    purchasePrice: purchase,
    sellingPrice: sell,
    costLines: [{ label: 'Transportation', category: 'transport', amount: extra }],
    materials: [],
    labour: [{ workType: 'Polishing', amount: 1500 }],
  })
}

soldProduct('pr_sold_m1', 'Bandra Lounge Set', 'AC-S-M1', 'sr_mumbai', 90000, 240000, 8000)
soldProduct('pr_sold_m2', 'Marine Drive Sofa', 'AC-S-M2', 'sr_mumbai', 85000, 210000, 7000)
soldProduct('pr_sold_m3', 'Worli Dining 8', 'AC-S-M3', 'sr_mumbai', 42000, 110000, 5000)
soldProduct('pr_sold_m4', 'Juhu King Suite', 'AC-S-M4', 'sr_mumbai', 38000, 95000, 4500)
soldProduct('pr_sold_m5', 'Colaba Wardrobe', 'AC-S-M5', 'sr_mumbai', 32000, 88000, 3000)
soldProduct('pr_sold_m6', 'Khar Sideboard Pair', 'AC-S-M6', 'sr_mumbai', 28000, 72000, 2500)
soldProduct('pr_sold_p1', 'KP Dining Set', 'AC-S-P1', 'sr_pune', 36000, 98000, 4000)
soldProduct('pr_sold_p2', 'Kalyani Nagar Bed', 'AC-S-P2', 'sr_pune', 30000, 82000, 3500)
soldProduct('pr_sold_p3', 'FC Road Console', 'AC-S-P3', 'sr_pune', 18000, 54000, 2000)
soldProduct('pr_sold_p4', 'Viman Nagar Sofa', 'AC-S-P4', 'sr_pune', 40000, 125000, 5000)
soldProduct('pr_sold_p5', 'Baner Bookshelf', 'AC-S-P5', 'sr_pune', 16000, 41000, 1800)
soldProduct('pr_sold_l1', 'Hill Station Sofa', 'AC-S-L1', 'sr_lonavala', 32000, 78000, 3500)
soldProduct('pr_sold_l2', 'Valley Dining', 'AC-S-L2', 'sr_lonavala', 26000, 64000, 2800)
soldProduct('pr_sold_l3', 'Tiger Point Bed', 'AC-S-L3', 'sr_lonavala', 22000, 58000, 2400)
soldProduct('pr_sold_l4', 'Bush Lounge Pair', 'AC-S-L4', 'sr_lonavala', 14000, 36000, 1600)

const sales: Sale[] = [
  s('pr_sold_m1', 'sr_mumbai', '2026-08-03', 240000, 2500),
  s('pr_sold_m2', 'sr_mumbai', '2026-08-06', 210000, 0),
  s('pr_sold_m3', 'sr_mumbai', '2026-08-09', 110000, 1500),
  s('pr_sold_m4', 'sr_mumbai', '2026-08-12', 95000, 2000),
  s('pr_sold_m5', 'sr_mumbai', '2026-08-15', 88000, 0),
  s('pr_sold_m6', 'sr_mumbai', '2026-08-18', 72000, 800),
  s('pr_sold_p1', 'sr_pune', '2026-08-04', 98000, 1200),
  s('pr_sold_p2', 'sr_pune', '2026-08-08', 82000, 0),
  s('pr_sold_p3', 'sr_pune', '2026-08-11', 54000, 0),
  s('pr_sold_p4', 'sr_pune', '2026-08-14', 125000, 1800),
  s('pr_sold_p5', 'sr_pune', '2026-08-17', 41000, 0),
  s('pr_sold_l1', 'sr_lonavala', '2026-08-05', 78000, 2000),
  s('pr_sold_l2', 'sr_lonavala', '2026-08-10', 64000, 0),
  s('pr_sold_l3', 'sr_lonavala', '2026-08-13', 58000, 1500),
  s('pr_sold_l4', 'sr_lonavala', '2026-08-19', 36000, 0),
  s('pr_sold_m1', 'sr_mumbai', '2026-07-12', 198000, 0),
  s('pr_sold_p1', 'sr_pune', '2026-07-20', 90000, 0),
  s('pr_sold_l1', 'sr_lonavala', '2026-07-22', 70000, 0),
  s('pr_sold_m3', 'sr_mumbai', '2025-08-08', 102000, 0),
  s('pr_sold_p2', 'sr_pune', '2025-08-16', 76000, 0),
]

function s(
  productId: string,
  showroomId: string,
  soldAt: string,
  unitPrice: number,
  deliveryCharge: number,
): Sale {
  return {
    id: nid('sale'),
    productId,
    showroomId,
    soldAt: `${soldAt}T12:00:00+05:30`,
    quantity: 1,
    unitPrice,
    deliveryCharge,
    notes: '',
  }
}

function exp(
  showroomId: string,
  group: ExpenseGroup,
  category: string,
  amount: number,
  day: string,
  note = '',
): Expense {
  return {
    id: nid('ex'),
    showroomId,
    group,
    category,
    amount,
    month: day.slice(0, 7),
    incurredOn: day,
    note,
  }
}

const expenses: Expense[] = [
  exp('sr_lonavala', 'showroom', 'Rent', 80000, '2026-08-01', 'Monthly rent'),
  exp('sr_lonavala', 'staff', 'Salary', 120000, '2026-08-01', 'August payroll'),
  exp('sr_lonavala', 'showroom', 'Electricity', 18000, '2026-08-07'),
  exp('sr_lonavala', 'office', 'Internet', 2000, '2026-08-05'),
  exp('sr_lonavala', 'showroom', 'Maintenance', 5000, '2026-08-11'),
  exp('sr_lonavala', 'marketing', 'Meta', 16000, '2026-08-09'),
  exp('sr_lonavala', 'marketing', 'Printing', 11500, '2026-08-14'),
  exp('sr_lonavala', 'showroom', 'Cleaning', 5000, '2026-08-03'),
  exp('sr_lonavala', 'showroom', 'Security', 10000, '2026-08-01'),
  exp('sr_lonavala', 'other', 'Miscellaneous', 10000, '2026-08-16'),
  exp('sr_mumbai', 'showroom', 'Rent', 95000, '2026-08-01'),
  exp('sr_mumbai', 'staff', 'Salary', 77000, '2026-08-01'),
  exp('sr_mumbai', 'showroom', 'Electricity', 12000, '2026-08-08'),
  exp('sr_mumbai', 'marketing', 'Google', 18000, '2026-08-10'),
  exp('sr_mumbai', 'office', 'Internet', 2500, '2026-08-05'),
  exp('sr_pune', 'showroom', 'Rent', 55000, '2026-08-01'),
  exp('sr_pune', 'staff', 'Salary', 40000, '2026-08-01'),
  exp('sr_pune', 'showroom', 'Electricity', 8000, '2026-08-07'),
  exp('sr_pune', 'marketing', 'Offline', 9000, '2026-08-12'),
  exp('sr_lonavala', 'showroom', 'Rent', 80000, '2026-07-01'),
  exp('sr_lonavala', 'staff', 'Salary', 120000, '2026-07-01'),
  exp('sr_mumbai', 'showroom', 'Rent', 95000, '2026-07-01'),
  exp('sr_pune', 'showroom', 'Rent', 55000, '2026-07-01'),
  exp('sr_lonavala', 'showroom', 'Rent', 75000, '2025-08-01'),
]

const marketing: MarketingBudget[] = [
  { id: 'mb_l_aug', showroomId: 'sr_lonavala', month: MONTH, budget: 30000 },
  { id: 'mb_m_aug', showroomId: 'sr_mumbai', month: MONTH, budget: 25000 },
  { id: 'mb_p_aug', showroomId: 'sr_pune', month: MONTH, budget: 12000 },
]

export interface SessionUser extends User {
  token: string
}

const sessions = new Map<string, string>()

export function publicUser(u: DbUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    showroomId: u.showroomId,
  }
}

export function loginUser(email: string, password: string): { token: string; user: User } {
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
  if (!found) throw Object.assign(new Error('Invalid email or password'), { status: 401 })
  const token = `mock.${found.id}.${Date.now()}`
  sessions.set(token, found.id)
  return { token, user: publicUser(found) }
}

export function userFromToken(token: string): User {
  const id = sessions.get(token)
  const found = users.find((u) => u.id === id)
  if (!found) throw Object.assign(new Error('Unauthorized'), { status: 401 })
  return publicUser(found)
}

function assertOwner(user: User): void {
  if (user.role !== 'owner') {
    throw Object.assign(new Error('Owner only'), { status: 403 })
  }
}

export function scopedShowroomId(user: User, requested?: string): string | undefined {
  if (user.role === 'staff') return user.showroomId ?? undefined
  return requested
}

function inScope(user: User, showroomId: string): boolean {
  if (user.role === 'owner') return true
  return user.showroomId === showroomId
}

export function listShowroomsFor(user: User): Showroom[] {
  if (user.role === 'staff') return showrooms.filter((s) => s.id === user.showroomId)
  return [...showrooms]
}

export function getShowroomById(user: User, id: string): Showroom {
  const found = showrooms.find((s) => s.id === id)
  if (!found || !inScope(user, id)) {
    throw Object.assign(new Error('Showroom not found'), { status: 404 })
  }
  return found
}

export function listProductsFor(user: User, showroomId?: string): Product[] {
  const scope = scopedShowroomId(user, showroomId)
  return products.filter((p) => (scope ? p.showroomId === scope : true))
}

export function getProductById(user: User, id: string): Product {
  const found = products.find((p) => p.id === id)
  if (!found || !inScope(user, found.showroomId)) {
    throw Object.assign(new Error('Product not found'), { status: 404 })
  }
  return found
}

export function createProductFor(user: User, input: ProductInput): Product {
  const showroomId = user.role === 'staff' ? user.showroomId! : input.showroomId
  if (!inScope(user, showroomId)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }
  return addProduct({
    id: nid('pr'),
    name: input.name,
    code: input.code,
    category: input.category,
    subcategory: input.subcategory ?? '',
    brand: input.brand ?? 'AAIRA',
    material: input.material ?? '',
    woodType: input.woodType ?? '',
    color: input.color ?? '',
    finish: input.finish ?? '',
    size: input.size ?? '',
    dimensions: input.dimensions ?? '',
    condition: input.condition ?? '',
    purchaseDate: input.purchaseDate ?? new Date().toISOString().slice(0, 10),
    supplier: input.supplier ?? '',
    purchasedFrom: input.purchasedFrom ?? '',
    description: input.description ?? '',
    imageUrl: input.imageUrl || img(input.code),
    showroomId,
    status: 'purchased',
    quantity: input.quantity ?? 1,
    purchasePrice: input.purchasePrice,
    sellingPrice: input.sellingPrice ?? 0,
    costLines: [],
    materials: [],
    labour: [],
  })
}

export function updateProductFor(
  user: User,
  id: string,
  patch: Partial<ProductInput> & { status?: ProductStatus },
): Product {
  const product = getProductById(user, id)
  Object.assign(product, patch)
  if (patch.showroomId && user.role === 'staff') product.showroomId = user.showroomId!
  return product
}

export function updateCostingFor(user: User, id: string, input: CostingInput): Product {
  const product = getProductById(user, id)
  product.purchasePrice = input.purchasePrice
  product.costLines = lines(product.id, input.costLines)
  product.materials = mats(product.id, input.materials)
  product.labour = labs(product.id, input.labour)
  if (product.status === 'purchased' || product.status === 'received') {
    product.status = 'costing'
  }
  return product
}

export function listSalesFor(user: User, query?: MonthQuery): Sale[] {
  const scope = scopedShowroomId(user, query?.showroomId)
  const month = query?.month
  return sales.filter((row) => {
    if (scope && row.showroomId !== scope) return false
    if (month && monthKeyFromDate(row.soldAt) !== month) return false
    return true
  })
}

export function createSaleFor(user: User, input: SaleInput): Sale {
  const product = getProductById(user, input.productId)
  const showroomId = user.role === 'staff' ? user.showroomId! : input.showroomId
  if (product.showroomId !== showroomId) {
    throw Object.assign(new Error('Product is not in this showroom'), { status: 400 })
  }
  const sale: Sale = {
    id: nid('sale'),
    productId: input.productId,
    showroomId,
    soldAt: input.soldAt ?? new Date().toISOString(),
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    deliveryCharge: input.deliveryCharge ?? 0,
    notes: input.notes ?? '',
  }
  sales.push(sale)
  product.status = 'sold'
  product.quantity = Math.max(0, product.quantity - input.quantity)
  if (input.unitPrice) product.sellingPrice = input.unitPrice
  return sale
}

export function listExpensesFor(user: User, query?: MonthQuery): Expense[] {
  const scope = scopedShowroomId(user, query?.showroomId)
  const month = query?.month
  return expenses.filter((row) => {
    if (scope && row.showroomId !== scope) return false
    if (month && row.month !== month) return false
    return true
  })
}

export function createExpenseFor(user: User, input: ExpenseInput): Expense {
  const showroomId = user.role === 'staff' ? user.showroomId! : input.showroomId
  if (!inScope(user, showroomId)) {
    throw Object.assign(new Error('Forbidden'), { status: 403 })
  }
  const row = exp(
    showroomId,
    input.group,
    input.category,
    input.amount,
    input.incurredOn,
    input.note ?? '',
  )
  expenses.push(row)
  return row
}

export function listStaffFor(user: User, showroomId?: string): StaffProfile[] {
  if (user.role === 'staff') {
    return staff.filter((row) => row.showroomId === user.showroomId)
  }
  return staff.filter((row) => (showroomId ? row.showroomId === showroomId : true))
}

export function createStaffFor(user: User, input: StaffInput): StaffProfile {
  assertOwner(user)
  const row: StaffProfile = {
    id: nid('st'),
    name: input.name,
    designation: input.designation,
    showroomId: input.showroomId,
    salary: input.salary,
    joiningDate: input.joiningDate,
    status: input.status ?? 'active',
  }
  staff.push(row)
  return row
}

export function listMarketingFor(user: User, query?: MonthQuery): MarketingBudget[] {
  const scope = scopedShowroomId(user, query?.showroomId)
  const month = query?.month ?? currentMonth()
  return marketing.filter((row) => {
    if (scope && row.showroomId !== scope) return false
    if (row.month !== month) return false
    return true
  })
}

function productMap(): Map<string, Product> {
  return new Map(products.map((p) => [p.id, p]))
}

function periodSales(showroomId: string | undefined, month: string): Sale[] {
  return sales.filter((row) => {
    if (showroomId && row.showroomId !== showroomId) return false
    return monthKeyFromDate(row.soldAt) === month
  })
}

function periodExpenses(showroomId: string | undefined, month: string): Expense[] {
  return expenses.filter((row) => {
    if (showroomId && row.showroomId !== showroomId) return false
    return row.month === month
  })
}

function saleEconomics(row: Sale, map: Map<string, Product>) {
  const product = map.get(row.productId)
  const cost = product ? productFinishedCost(product) * row.quantity : 0
  const revenue = row.unitPrice * row.quantity + row.deliveryCharge
  return { revenue, cost, gross: revenue - cost, qty: row.quantity }
}

function totals(rows: Sale[], map: Map<string, Product>) {
  return rows.reduce(
    (acc, row) => {
      const e = saleEconomics(row, map)
      acc.revenue += e.revenue
      acc.cogs += e.cost
      acc.gross += e.gross
      acc.units += e.qty
      return acc
    },
    { revenue: 0, cogs: 0, gross: 0, units: 0 },
  )
}

function inventoryCounts(list: Product[]): InventoryCounts {
  const unsold = list.filter((p) => p.status !== 'sold')
  return {
    total: list.length,
    available: list.filter((p) => p.status === 'available').length,
    reserved: list.filter((p) => p.status === 'reserved').length,
    underRepair: list.filter((p) => p.status === 'under_repair').length,
    readyForSale: list.filter((p) => p.status === 'ready_for_sale').length,
    sold: list.filter((p) => p.status === 'sold').length,
    notAvailable: list.filter((p) => p.status === 'not_available').length,
    inventoryCost: unsold.reduce((sum, p) => sum + productFinishedCost(p) * Math.max(p.quantity, 1), 0),
  }
}

function emptyGroups(): Record<ExpenseGroup, number> {
  return {
    showroom: 0,
    staff: 0,
    marketing: 0,
    operations: 0,
    office: 0,
    finance: 0,
    other: 0,
  }
}

export function overviewFor(user: User, query?: MonthQuery): OverviewReport {
  const month = query?.month ?? MONTH
  const scope = scopedShowroomId(user, query?.showroomId) ?? null
  const map = productMap()
  const saleRows = periodSales(scope ?? undefined, month)
  const expenseRows = periodExpenses(scope ?? undefined, month)
  const t = totals(saleRows, map)
  const opex = expenseRows.reduce((sum, row) => sum + row.amount, 0)
  const net = t.gross - opex
  const groups = emptyGroups()
  for (const row of expenseRows) groups[row.group] += row.amount

  const byProduct = new Map<string, { name: string; qty: number; revenue: number; profit: number }>()
  for (const row of saleRows) {
    const product = map.get(row.productId)
    const e = saleEconomics(row, map)
    const cur = byProduct.get(row.productId) ?? {
      name: product?.name ?? 'Unknown',
      qty: 0,
      revenue: 0,
      profit: 0,
    }
    cur.qty += row.quantity
    cur.revenue += e.revenue
    cur.profit += e.gross
    byProduct.set(row.productId, cur)
  }
  const ranked = [...byProduct.values()]
  const bestSeller = [...ranked].sort((a, b) => b.qty - a.qty)[0]?.name ?? '—'
  const highestRevenue = [...ranked].sort((a, b) => b.revenue - a.revenue)[0]?.name ?? '—'
  const highestProfit = [...ranked].sort((a, b) => b.profit - a.profit)[0]?.name ?? '—'
  const slow = listProductsFor(user, scope ?? undefined)
    .filter((p) => p.status === 'available')
    .sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate))[0]

  const showroomHealth: ShowroomHealth[] = listShowroomsFor(user).map((sr) => {
    const st = totals(periodSales(sr.id, month), map)
    const ox = periodExpenses(sr.id, month).reduce((sum, row) => sum + row.amount, 0)
    const profit = st.gross - ox
    const marginPct = st.revenue === 0 ? 0 : (profit / st.revenue) * 100
    return {
      showroomId: sr.id,
      name: sr.name,
      city: sr.city,
      revenue: st.revenue,
      expenses: ox,
      profit,
      marginPct,
      status: profit >= 0 ? 'good' : 'watch',
    }
  })

  return {
    month,
    showroomId: scope,
    revenue: t.revenue,
    cogs: t.cogs,
    grossProfit: t.gross,
    opex,
    netProfit: net,
    marginPct: t.revenue === 0 ? 0 : (net / t.revenue) * 100,
    inventory: inventoryCounts(listProductsFor(user, scope ?? undefined)),
    bestSeller,
    highestRevenue,
    highestProfit,
    slowMoving: slow?.name ?? '—',
    expensesByGroup: groups,
    showrooms: showroomHealth,
  }
}

export function pnlFor(user: User, query?: MonthQuery): PnlReport {
  const month = query?.month ?? MONTH
  const scope = scopedShowroomId(user, query?.showroomId) ?? null
  const map = productMap()
  const build = (m: string) => {
    const t = totals(periodSales(scope ?? undefined, m), map)
    const opex = periodExpenses(scope ?? undefined, m).reduce((sum, row) => sum + row.amount, 0)
    return {
      sales: t.revenue,
      productCost: t.cogs,
      grossProfit: t.gross,
      operatingExpenses: opex,
      netOperatingProfit: t.gross - opex,
    }
  }
  const cur = build(month)
  const prevM = build(query?.month ? shiftMonth(month, -1) : PREV)
  const prevY = build(query?.month ? shiftMonth(month, -12) : YEAR_AGO)
  return {
    month,
    showroomId: scope,
    ...cur,
    prevMonth: {
      month: shiftMonth(month, -1),
      netOperatingProfit: prevM.netOperatingProfit,
      sales: prevM.sales,
    },
    prevYear: {
      month: shiftMonth(month, -12),
      netOperatingProfit: prevY.netOperatingProfit,
      sales: prevY.sales,
    },
  }
}

export function breakEvenFor(user: User, query?: MonthQuery): BreakEvenReport {
  const month = query?.month ?? MONTH
  const scope = scopedShowroomId(user, query?.showroomId) ?? null
  const map = productMap()
  const t = totals(periodSales(scope ?? undefined, month), map)
  const opex = periodExpenses(scope ?? undefined, month).reduce((sum, row) => sum + row.amount, 0)
  const avg = t.units === 0 ? 0 : t.gross / t.units
  return {
    month,
    showroomId: scope,
    fixedOpex: opex,
    avgGrossProfitPerPiece: avg,
    unitsNeeded: breakEvenUnits(opex, avg),
    unitsSold: t.units,
  }
}

export function productProfitFor(user: User, query?: MonthQuery): ProductProfitRow[] {
  const scope = scopedShowroomId(user, query?.showroomId)
  return listProductsFor(user, scope)
    .filter((p) => p.sellingPrice > 0)
    .map((p) => {
      const cost = productFinishedCost(p)
      const profit = p.sellingPrice - cost
      return {
        productId: p.id,
        name: p.name,
        code: p.code,
        showroomId: p.showroomId,
        finishedCost: cost,
        sellingPrice: p.sellingPrice,
        profit,
        marginPct: p.sellingPrice === 0 ? 0 : (profit / p.sellingPrice) * 100,
        status: p.status,
      }
    })
    .sort((a, b) => b.profit - a.profit)
}

export function demoAccounts(): Array<{ role: Role; email: string; password: string }> {
  return users.map((u) => ({ role: u.role, email: u.email, password: u.password }))
}
