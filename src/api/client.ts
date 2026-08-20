import type {
  AuthSession,
  BreakEvenReport,
  CostingInput,
  Expense,
  ExpenseInput,
  MarketingBudget,
  MonthQuery,
  OverviewReport,
  PnlReport,
  Product,
  ProductInput,
  ProductProfitRow,
  ProductStatus,
  Sale,
  SaleInput,
  Showroom,
  StaffInput,
  StaffProfile,
  User,
} from '../types.ts'

export interface ApiClient {
  login(email: string, password: string): Promise<AuthSession>
  me(token: string): Promise<User>
  listShowrooms(token: string): Promise<Showroom[]>
  getShowroom(token: string, id: string): Promise<Showroom>
  listProducts(token: string, showroomId?: string): Promise<Product[]>
  getProduct(token: string, id: string): Promise<Product>
  createProduct(token: string, input: ProductInput): Promise<Product>
  updateProduct(
    token: string,
    id: string,
    patch: Partial<ProductInput> & { status?: ProductStatus },
  ): Promise<Product>
  updateCosting(token: string, id: string, input: CostingInput): Promise<Product>
  listSales(token: string, query?: MonthQuery): Promise<Sale[]>
  createSale(token: string, input: SaleInput): Promise<Sale>
  listExpenses(token: string, query?: MonthQuery): Promise<Expense[]>
  createExpense(token: string, input: ExpenseInput): Promise<Expense>
  listStaff(token: string, showroomId?: string): Promise<StaffProfile[]>
  createStaff(token: string, input: StaffInput): Promise<StaffProfile>
  listMarketing(token: string, query?: MonthQuery): Promise<MarketingBudget[]>
  overview(token: string, query?: MonthQuery): Promise<OverviewReport>
  pnl(token: string, query?: MonthQuery): Promise<PnlReport>
  breakEven(token: string, query?: MonthQuery): Promise<BreakEvenReport>
  productProfit(token: string, query?: MonthQuery): Promise<ProductProfitRow[]>
}
