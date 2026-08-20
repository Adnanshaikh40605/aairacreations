import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/index.ts'
import { Rupee } from '../components/money/Rupee.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { Field, Input } from '../components/ui/Field.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
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

  const save = useMutation({
    mutationFn: () => api.updateProduct(token, id!, { sellingPrice: selling }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['product', id] })
      navigate(`/inventory/${id}`)
    },
  })

  if (!p) {
    return (
      <>
        <TopBar title="Pricing" backTo={`/inventory/${id}`} />
        <PageBody>
          <div className="skeleton h-32 rounded-[1.25rem]" />
        </PageBody>
      </>
    )
  }

  const cost = productFinishedCost(p)
  const suggested = suggestedPrice(cost, margin)
  const gp = grossProfit(selling, cost)
  const gm = grossMarginPct(selling, cost)

  return (
    <>
      <TopBar title="Pricing" backTo={`/inventory/${p.id}`} />
      <PageBody>
        <Card accent="top">
          <SectionLabel>Finished cost</SectionLabel>
          <p className="mt-1 font-mono text-2xl font-semibold text-accent">
            <Rupee amount={cost} />
          </p>
        </Card>
        <Field label="Target margin %">
          <Input
            className="font-mono"
            type="number"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
        </Field>
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between rounded-xl bg-chip px-3 text-left text-sm font-medium"
          onClick={() => setSelling(Math.round(suggested))}
        >
          Suggested selling
          <Rupee className="font-semibold text-accent" amount={suggested} />
        </button>
        <Field label="Selling price">
          <Input
            className="font-mono"
            type="number"
            value={selling}
            onChange={(e) => setSelling(Number(e.target.value))}
          />
        </Field>
        <Card accent="left">
          <div className="flex justify-between text-sm">
            <span className="text-mute">Gross profit</span>
            <Rupee className="font-semibold text-accent" amount={gp} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-mute">Gross margin</span>
            <span className="font-mono font-semibold">{gm.toFixed(2)}%</span>
          </div>
        </Card>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          Save price
        </Button>
      </PageBody>
    </>
  )
}
