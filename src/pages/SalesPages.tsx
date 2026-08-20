import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/index.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { Rupee } from '../components/money/Rupee.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { Field, Input, Select } from '../components/ui/Field.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useProduct, useProducts, useSales, useShowrooms, useToken } from '../hooks/useApi.ts'
import { productFinishedCost } from '../lib/costing.ts'

export interface SalesPageProps {
  className?: string
}

export function SalesPage(_props: SalesPageProps) {
  const { data: sales } = useSales({ month: '2026-08' })
  const { data: products } = useProducts()
  const map = useMemo(() => new Map((products ?? []).map((p) => [p.id, p])), [products])
  return (
    <>
      <TopBar
        title="Sales"
        action={
          <Link to="/sales/new" className="text-sm font-semibold text-accent">
            Record
          </Link>
        }
      />
      <ul className="space-y-2 px-4">
        {(sales ?? []).map((s) => {
          const p = map.get(s.productId)
          return (
            <li key={s.id}>
              <Card padded={false} className="px-4 py-3">
                <div className="flex justify-between">
                  <p className="font-semibold">{p?.name ?? s.productId}</p>
                  <Rupee amount={s.unitPrice * s.quantity + s.deliveryCharge} />
                </div>
                <p className="font-mono text-xs text-mute">
                  {s.soldAt.slice(0, 10)}
                  {s.deliveryCharge ? ` · delivery ₹${s.deliveryCharge}` : ''}
                </p>
              </Card>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export interface RecordSalePageProps {
  className?: string
}

export function RecordSalePage(_props: RecordSalePageProps) {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const token = useToken()
  const qc = useQueryClient()
  const { data: products } = useProducts()
  const { data: showrooms } = useShowrooms()
  const [productId, setProductId] = useState(params.get('productId') ?? '')
  const [showroomId, setShowroomId] = useState(user?.showroomId ?? '')
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(0)
  const [delivery, setDelivery] = useState(0)
  const { data: selected } = useProduct(productId || undefined)

  const sellable = (products ?? []).filter((p) => p.status !== 'sold' && p.quantity > 0)

  useEffect(() => {
    if (selected?.sellingPrice) setPrice(selected.sellingPrice)
    if (selected?.showroomId) setShowroomId(selected.showroomId)
  }, [selected])

  const mutate = useMutation({
    mutationFn: () =>
      api.createSale(token, {
        productId,
        showroomId: user?.role === 'staff' ? user.showroomId! : showroomId,
        quantity: qty,
        unitPrice: price,
        deliveryCharge: delivery,
      }),
    onSuccess: () => {
      void qc.invalidateQueries()
    },
  })

  const cost = selected ? productFinishedCost(selected) : 0

  return (
    <>
      <TopBar title="Record sale" backTo="/sales" />
      <form
        className="space-y-4 px-4"
        onSubmit={(e) => {
          e.preventDefault()
          mutate.mutate()
        }}
      >
        <Field label="Product">
          <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select</option>
            {sellable.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </Select>
        </Field>
        {user?.role === 'owner' ? (
          <Field label="Showroom">
            <Select value={showroomId} onChange={(e) => setShowroomId(e.target.value)}>
              {(showrooms ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.city}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field label="Quantity">
          <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </Field>
        <Field label="Selling price">
          <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </Field>
        <Field label="Delivery charge (optional)">
          <Input
            type="number"
            value={delivery}
            onChange={(e) => setDelivery(Number(e.target.value))}
          />
        </Field>
        {selected ? (
          <Card>
            <p className="text-sm text-mute">Finished cost</p>
            <Rupee className="text-lg font-semibold" amount={cost} />
            <p className="mt-2 text-sm text-mute">
              Gross on this sale{' '}
              <Rupee className="text-ink" amount={price * qty + delivery - cost * qty} />
            </p>
          </Card>
        ) : null}
        <Button type="submit" disabled={!productId || mutate.isPending}>
          {mutate.isSuccess ? 'Recorded' : 'Save sale'}
        </Button>
      </form>
    </>
  )
}
