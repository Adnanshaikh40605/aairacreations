import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/index.ts'
import { Rupee } from '../components/money/Rupee.tsx'
import { StatusBadge } from '../components/product/StatusBadge.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { Chip } from '../components/ui/Chip.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
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
        <PageBody>
          <div className="skeleton h-48 rounded-[1.25rem]" />
        </PageBody>
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
      <PageBody>
        <img src={p.imageUrl} alt="" className="h-48 w-full rounded-[1.25rem] object-cover" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-mute">
              {p.code} · {city}
            </p>
            <p className="mt-1 text-sm text-mute">
              {p.category} · {p.material}
            </p>
          </div>
          <StatusBadge status={p.status} />
        </div>

        <Card accent="top">
          <SectionLabel>Finished cost</SectionLabel>
          <p className="mt-2 font-mono text-2xl font-semibold text-accent">
            <Rupee amount={cost} />
          </p>
          <ul className="mt-3 space-y-1.5 font-mono text-sm">
            <li className="flex justify-between">
              <span className="font-sans text-mute">Purchase</span>
              <Rupee amount={p.purchasePrice} />
            </li>
            <li className="flex justify-between">
              <span className="font-sans text-mute">Additional + materials + labour</span>
              <Rupee amount={extra} />
            </li>
            <li className="flex justify-between">
              <span className="font-sans text-mute">Selling</span>
              <Rupee amount={p.sellingPrice} />
            </li>
            <li className="flex justify-between">
              <span className="font-sans text-mute">Gross profit</span>
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
          <SectionLabel>Lifecycle</SectionLabel>
          <ol className="mt-3 flex flex-wrap gap-2">
            {LIFECYCLE.map((step) => (
              <li key={step}>
                <Chip selected={p.status === step} className="pointer-events-none min-h-9 text-xs">
                  {STATUS_LABEL[step]}
                </Chip>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <SectionLabel className="mb-2">Floor status</SectionLabel>
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
      </PageBody>
    </>
  )
}
