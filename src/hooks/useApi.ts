import { useQuery } from '@tanstack/react-query'
import { api } from '../api/index.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import type { MonthQuery } from '../types.ts'

export function useToken(): string {
  const { token } = useAuth()
  if (!token) throw new Error('Not signed in')
  return token
}

export function useOverview(query?: MonthQuery) {
  const token = useToken()
  return useQuery({
    queryKey: ['overview', query],
    queryFn: () => api.overview(token, query),
  })
}

export function useProducts(showroomId?: string) {
  const token = useToken()
  return useQuery({
    queryKey: ['products', showroomId],
    queryFn: () => api.listProducts(token, showroomId),
  })
}

export function useProduct(id: string | undefined) {
  const token = useToken()
  return useQuery({
    queryKey: ['product', id],
    enabled: Boolean(id),
    queryFn: () => api.getProduct(token, id!),
  })
}

export function useShowrooms() {
  const token = useToken()
  return useQuery({
    queryKey: ['showrooms'],
    queryFn: () => api.listShowrooms(token),
  })
}

export function useSales(query?: MonthQuery) {
  const token = useToken()
  return useQuery({
    queryKey: ['sales', query],
    queryFn: () => api.listSales(token, query),
  })
}

export function useExpenses(query?: MonthQuery) {
  const token = useToken()
  return useQuery({
    queryKey: ['expenses', query],
    queryFn: () => api.listExpenses(token, query),
  })
}

export function useStaff(showroomId?: string) {
  const token = useToken()
  return useQuery({
    queryKey: ['staff', showroomId],
    queryFn: () => api.listStaff(token, showroomId),
  })
}

export function usePnl(query?: MonthQuery) {
  const token = useToken()
  return useQuery({
    queryKey: ['pnl', query],
    queryFn: () => api.pnl(token, query),
  })
}

export function useBreakEven(query?: MonthQuery) {
  const token = useToken()
  return useQuery({
    queryKey: ['breakeven', query],
    queryFn: () => api.breakEven(token, query),
  })
}

export function useProductProfit(query?: MonthQuery) {
  const token = useToken()
  return useQuery({
    queryKey: ['product-profit', query],
    queryFn: () => api.productProfit(token, query),
  })
}

export function useMarketing(query?: MonthQuery) {
  const token = useToken()
  return useQuery({
    queryKey: ['marketing', query],
    queryFn: () => api.listMarketing(token, query),
  })
}
