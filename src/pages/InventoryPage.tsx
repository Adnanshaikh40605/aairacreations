import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Rupee } from '../components/money/Rupee.tsx'
import { StatusBadge } from '../components/product/StatusBadge.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useProducts, useShowrooms } from '../hooks/useApi.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { productFinishedCost } from '../lib/costing.ts'
import { cn } from '../lib/cn.ts'
import { FLOOR_STATUSES } from '../lib/status.ts'
import type { ProductStatus } from '../types.ts'

export interface InventoryPageProps {
  className?: string
}

export function InventoryPage(_props: InventoryPageProps) {
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<ProductStatus | 'all'>('all')
  const { data: showrooms } = useShowrooms()
  const { data, isLoading } = useProducts(
    user?.role === 'staff' ? user.showroomId ?? undefined : undefined,
  )

  const filtered = useMemo(() => {
    return (data ?? []).filter((p) => {
      const hay = `${p.name} ${p.code} ${p.category}`.toLowerCase()
      if (q && !hay.includes(q.toLowerCase())) return false
      if (status !== 'all' && p.status !== status) return false
      return true
    })
  }, [data, q, status])

  return (
    <>
      <TopBar
        title="Inventory"
        action={
          <Link
            to="/inventory/new"
            className="flex h-11 w-11 items-center justify-center text-accent"
            aria-label="Add product"
          >
            <Plus size={22} />
          </Link>
        }
      />
      <div className="px-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or SKU"
          className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {(['all', ...FLOOR_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                'h-11 shrink-0 rounded-full border px-4 text-sm',
                status === s
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border bg-surface text-mute',
              )}
            >
              {s === 'all' ? 'All' : s.replaceAll('_', ' ')}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="skeleton mt-4 h-24 rounded-[1.25rem]" />
        ) : (
          <ul className="mt-2 space-y-3">
            {filtered.map((p, i) => {
              const cost = productFinishedCost(p)
              const profit = p.sellingPrice - cost
              const city = showrooms?.find((s) => s.id === p.showroomId)?.city ?? ''
              return (
                <li key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <Link
                    to={`/inventory/${p.id}`}
                    className="flex gap-3 overflow-hidden rounded-[1.25rem] border border-border bg-surface"
                  >
                    <span className="w-1 bg-accent" />
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-[72px] w-24 shrink-0 self-center rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1 py-3 pr-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{p.name}</p>
                          <p className="font-mono text-xs text-mute">
                            {p.code} · {city}
                          </p>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="mt-2 flex justify-between font-mono text-xs">
                        <span>
                          Cost <Rupee amount={cost} />
                        </span>
                        <span>
                          Sell <Rupee amount={p.sellingPrice} />
                        </span>
                        <span className={profit >= 0 ? 'text-available' : 'text-sold'}>
                          <Rupee amount={profit} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
