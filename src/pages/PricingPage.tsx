import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/index.ts'
import { Rupee } from '../components/money/Rupee.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { Field, Input } from '../components/ui/Field.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useProduct, useToken } from '../hooks/useApi.ts'
import { grossMarginPct, grossProfit, productFinishedCost, suggestedPrice } from '../lib/costing.ts'

export interface PricingPageProps {
  className?: string
}

export function PricingPage(_props: PricingPageProps) {
  const { id } = useParams()
  const { data: p } = useProduct(id)
  const token = useToken()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [margin, setMargin] = useState(30)
  const [selling, setSelling] = useState(0)

  useEffect(() => {
    if (p) setSelling(p.sellingPrice)
  }, [p])

  if (!p) {
    return (
      <>
        <TopBar title="Pricing" backTo={`/inventory/${id}`} />
        <div className="skeleton mx-4 h-32 rounded-[1.25rem]" />
      </>
    )
  }

  const cost = productFinishedCost(p)
  const suggested = suggestedPrice(cost, margin)
  const gp = grossProfit(selling, cost)
  const gm = grossMarginPct(selling, cost)

  const save = useMutation({
    mutationFn: () => api.updateProduct(token, p.id, { sellingPrice: selling }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['product', p.id] })
      navigate(`/inventory/${p.id}`)
    },
  })

  return (
    <>
      <TopBar title="Pricing" backTo={`/inventory/${p.id}`} />
      <div className="space-y-4 px-4">
        <Card>
          <p className="text-sm text-mute">Finished cost</p>
          <p className="font-mono text-2xl font-semibold text-accent">
            <Rupee amount={cost} />
          </p>
        </Card>
        <Field label="Target margin %">
          <Input
            type="number"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
        </Field>
        <button
          type="button"
          className="min-h-11 w-full rounded-xl border border-border bg-surface text-left px-3"
          onClick={() => setSelling(Math.round(suggested))}
        >
          Suggested selling <Rupee className="float-right font-semibold" amount={suggested} />
        </button>
        <Field label="Selling price">
          <Input
            type="number"
            value={selling}
            onChange={(e) => setSelling(Number(e.target.value))}
          />
        </Field>
        <Card>
          <div className="flex justify-between text-sm">
            <span className="text-mute">Gross profit</span>
            <Rupee className="font-semibold" amount={gp} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-mute">Gross margin</span>
            <span className="font-mono">{gm.toFixed(2)}%</span>
          </div>
        </Card>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          Save price
        </Button>
      </div>
    </>
  )
}
