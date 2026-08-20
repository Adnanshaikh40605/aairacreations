import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Rupee } from '../components/money/Rupee.tsx'
import { StatusBadge } from '../components/product/StatusBadge.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { Chip } from '../components/ui/Chip.tsx'
import { EmptyState } from '../components/ui/EmptyState.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { useProducts, useShowrooms } from '../hooks/useApi.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { productFinishedCost } from '../lib/costing.ts'
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
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Add product"
          >
            <Plus size={22} />
          </Link>
        }
      />
      <PageBody>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or SKU"
          className="min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[0.9375rem] text-ink outline-none placeholder:text-hint focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas"
        />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {(['all', ...FLOOR_STATUSES] as const).map((s) => (
            <Chip key={s} selected={status === s} onClick={() => setStatus(s)}>
              {s === 'all' ? 'All' : s.replaceAll('_', ' ')}
            </Chip>
          ))}
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <div className="skeleton h-20 rounded-[1.25rem]" />
            <div className="skeleton h-20 rounded-[1.25rem]" />
            <div className="skeleton h-20 rounded-[1.25rem]" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            message="No pieces match these filters. Clear search or add a product."
            action={
              <Link
                to="/inventory/new"
                className="flex min-h-11 items-center justify-center rounded-[0.875rem] bg-accent font-semibold text-on-accent"
              >
                Add product
              </Link>
            }
          />
        ) : (
          <ul className="space-y-2">
            {filtered.map((p, i) => {
              const cost = productFinishedCost(p)
              const profit = p.sellingPrice - cost
              const city = showrooms?.find((s) => s.id === p.showroomId)?.city ?? ''
              return (
                <li key={p.id} className="enter-row" style={{ ['--index' as string]: i }}>
                  <Link
                    to={`/inventory/${p.id}`}
                    className="relative flex gap-3 overflow-hidden rounded-[1.25rem] border border-border bg-surface"
                  >
                    <span className="w-1 shrink-0 bg-accent" aria-hidden="true" />
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-[72px] w-24 shrink-0 self-center rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1 py-2.5 pr-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold tracking-tight">{p.name}</p>
                          <p className="font-mono text-xs text-mute">
                            {p.code} · {city}
                          </p>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>
                      <div className="mt-1.5 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-mute">
                            Cost
                          </p>
                          <Rupee className="text-xs text-ink" amount={cost} />
                        </div>
                        <div>
                          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-mute">
                            Sell
                          </p>
                          <Rupee className="text-xs text-ink" amount={p.sellingPrice} />
                        </div>
                        <div className="text-right">
                          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-mute">
                            Margin
                          </p>
                          <Rupee
                            className={profit >= 0 ? 'text-xs text-available' : 'text-xs text-sold'}
                            amount={profit}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </PageBody>
    </>
  )
}
