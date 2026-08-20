import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/index.ts'
import { Rupee } from '../components/money/Rupee.tsx'
import { StatusBadge } from '../components/product/StatusBadge.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useProduct, useShowrooms, useToken } from '../hooks/useApi.ts'
import { additionalDirectCost, productFinishedCost } from '../lib/costing.ts'
import { grossMarginPct, grossProfit } from '../lib/costing.ts'
import { FLOOR_STATUSES, LIFECYCLE, STATUS_LABEL } from '../lib/status.ts'
import type { ProductStatus } from '../types.ts'

export interface ProductDetailPageProps {
  className?: string
}

export function ProductDetailPage(_props: ProductDetailPageProps) {
  const { id } = useParams()
  const { data: p, isLoading } = useProduct(id)
  const { data: showrooms } = useShowrooms()
  const token = useToken()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const mutate = useMutation({
    mutationFn: (status: ProductStatus) => api.updateProduct(token, id!, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['product', id] }),
  })

  if (isLoading || !p) {
    return (
      <>
        <TopBar title="Product" backTo="/inventory" />
        <div className="skeleton mx-4 h-48 rounded-[1.25rem]" />
      </>
    )
  }

  const cost = productFinishedCost(p)
  const extra = additionalDirectCost(p)
  const gp = grossProfit(p.sellingPrice, cost)
  const city = showrooms?.find((s) => s.id === p.showroomId)?.city ?? ''

  return (
    <>
      <TopBar title={p.name} backTo="/inventory" />
      <div className="space-y-4 px-4">
        <img src={p.imageUrl} alt="" className="h-48 w-full rounded-[1.25rem] object-cover" />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-mute">
              {p.code} · {city}
            </p>
            <StatusBadge status={p.status} />
          </div>
          <p className="text-sm text-mute">
            {p.category} · {p.material}
          </p>
        </div>

        <Card>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
            Finished cost
          </p>
          <p className="mt-2 text-2xl font-semibold">
            <Rupee amount={cost} />
          </p>
          <ul className="mt-3 space-y-1 font-mono text-sm">
            <li className="flex justify-between">
              <span className="text-mute">Purchase</span>
              <Rupee amount={p.purchasePrice} />
            </li>
            <li className="flex justify-between">
              <span className="text-mute">Additional + materials + labour</span>
              <Rupee amount={extra} />
            </li>
            <li className="flex justify-between">
              <span className="text-mute">Selling</span>
              <Rupee amount={p.sellingPrice} />
            </li>
            <li className="flex justify-between">
              <span className="text-mute">Gross profit</span>
              <span className={gp >= 0 ? 'text-available' : 'text-sold'}>
                <Rupee amount={gp} /> ({grossMarginPct(p.sellingPrice, cost).toFixed(2)}%)
              </span>
            </li>
          </ul>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Link to={`/inventory/${p.id}/costing`}>
            <Button variant="secondary">Costing</Button>
          </Link>
          <Link to={`/inventory/${p.id}/pricing`}>
            <Button variant="secondary">Pricing</Button>
          </Link>
        </div>

        <Card>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
            Lifecycle
          </p>
          <ol className="mt-3 flex flex-wrap gap-2">
            {LIFECYCLE.map((step) => (
              <li
                key={step}
                className={
                  p.status === step
                    ? 'rounded-full bg-accent-soft px-3 py-1 text-xs text-accent'
                    : 'rounded-full border border-border px-3 py-1 text-xs text-mute'
                }
              >
                {STATUS_LABEL[step]}
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
            Floor status
          </p>
          <div className="grid grid-cols-2 gap-2">
            {FLOOR_STATUSES.map((s) => (
              <Button
                key={s}
                variant={p.status === s ? 'primary' : 'secondary'}
                onClick={() => mutate.mutate(s)}
              >
                {STATUS_LABEL[s]}
              </Button>
            ))}
          </div>
        </Card>

        {p.status !== 'sold' ? (
          <Button onClick={() => navigate(`/sales/new?productId=${p.id}`)}>Record sale</Button>
        ) : null}
      </div>
    </>
  )
}
