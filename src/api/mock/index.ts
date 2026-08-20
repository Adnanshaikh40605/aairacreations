import type { ApiClient } from '../client.ts'
import * as db from './store.ts'

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 80))
}

export const mockClient: ApiClient = {
  async login(email, password) {
    return wait(db.loginUser(email, password))
  },
  async me(token) {
    return wait(db.userFromToken(token))
  },
  async listShowrooms(token) {
    return wait(db.listShowroomsFor(db.userFromToken(token)))
  },
  async getShowroom(token, id) {
    return wait(db.getShowroomById(db.userFromToken(token), id))
  },
  async listProducts(token, showroomId) {
    return wait(db.listProductsFor(db.userFromToken(token), showroomId))
  },
  async getProduct(token, id) {
    return wait(db.getProductById(db.userFromToken(token), id))
  },
  async createProduct(token, input) {
    return wait(db.createProductFor(db.userFromToken(token), input))
  },
  async updateProduct(token, id, patch) {
    return wait(db.updateProductFor(db.userFromToken(token), id, patch))
  },
  async updateCosting(token, id, input) {
    return wait(db.updateCostingFor(db.userFromToken(token), id, input))
  },
  async listSales(token, query) {
    return wait(db.listSalesFor(db.userFromToken(token), query))
  },
  async createSale(token, input) {
    return wait(db.createSaleFor(db.userFromToken(token), input))
  },
  async listExpenses(token, query) {
    return wait(db.listExpensesFor(db.userFromToken(token), query))
  },
  async createExpense(token, input) {
    return wait(db.createExpenseFor(db.userFromToken(token), input))
  },
  async listStaff(token, showroomId) {
    return wait(db.listStaffFor(db.userFromToken(token), showroomId))
  },
  async createStaff(token, input) {
    return wait(db.createStaffFor(db.userFromToken(token), input))
  },
  async listMarketing(token, query) {
    return wait(db.listMarketingFor(db.userFromToken(token), query))
  },
  async overview(token, query) {
    return wait(db.overviewFor(db.userFromToken(token), query))
  },
  async pnl(token, query) {
    return wait(db.pnlFor(db.userFromToken(token), query))
  },
  async breakEven(token, query) {
    return wait(db.breakEvenFor(db.userFromToken(token), query))
  },
  async productProfit(token, query) {
    return wait(db.productProfitFor(db.userFromToken(token), query))
  },
}
