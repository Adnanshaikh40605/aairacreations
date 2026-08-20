import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell.tsx'
import { AuthProvider } from './auth/AuthContext.tsx'
import { RequireAuth, RequireOwner } from './auth/guards.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { InventoryPage } from './pages/InventoryPage.tsx'
import { ProductDetailPage } from './pages/ProductDetailPage.tsx'
import { AddProductPage } from './pages/AddProductPage.tsx'
import { CostingPage } from './pages/CostingPage.tsx'
import { PricingPage } from './pages/PricingPage.tsx'
import { RecordSalePage, SalesPage } from './pages/SalesPages.tsx'
import { AddExpensePage, ExpensesPage } from './pages/ExpensePages.tsx'
import { ShowroomDetailPage, ShowroomsPage } from './pages/ShowroomPages.tsx'
import { StaffPage } from './pages/StaffPage.tsx'
import { PnlPage } from './pages/PnlPage.tsx'
import { ProfitabilityPage } from './pages/ProfitabilityPage.tsx'
import { BreakEvenPage } from './pages/BreakEvenPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/new" element={<AddProductPage />} />
            <Route path="inventory/:id" element={<ProductDetailPage />} />
            <Route path="inventory/:id/costing" element={<CostingPage />} />
            <Route path="inventory/:id/pricing" element={<PricingPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="sales/new" element={<RecordSalePage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="expenses/new" element={<AddExpensePage />} />
            <Route path="showrooms" element={<ShowroomsPage />} />
            <Route path="showrooms/:id" element={<ShowroomDetailPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="reports/pnl" element={<PnlPage />} />
            <Route
              path="reports/profitability"
              element={
                <RequireOwner>
                  <ProfitabilityPage />
                </RequireOwner>
              }
            />
            <Route path="reports/breakeven" element={<BreakEvenPage />} />
            <Route path="more" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
