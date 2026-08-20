import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/index.ts'
import { Rupee } from '../components/money/Rupee.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Field, Input } from '../components/ui/Field.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useProduct, useToken } from '../hooks/useApi.ts'
import { additionalDirectCost, finishedCost } from '../lib/costing.ts'
import type { CostCategory } from '../types.ts'

interface Line {
  label: string
  category: CostCategory
  amount: number
}
interface Mat {
  name: string
  qty: number
  unit: string
  unitCost: number
}
interface Lab {
  workType: string
  amount: number
}

export interface CostingPageProps {
  className?: string
}

export function CostingPage(_props: CostingPageProps) {
  const { id } = useParams()
  const { data: p } = useProduct(id)
  const token = useToken()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [purchase, setPurchase] = useState(0)
  const [costLines, setCostLines] = useState<Line[]>([])
  const [materials, setMaterials] = useState<Mat[]>([])
  const [labour, setLabour] = useState<Lab[]>([])
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (!p) return
    setPurchase(p.purchasePrice)
    setCostLines(
      p.costLines.map((l) => ({ label: l.label, category: l.category, amount: l.amount })),
    )
    setMaterials(
      p.materials.map((m) => ({
        name: m.name,
        qty: m.qty,
        unit: m.unit,
        unitCost: m.unitCost,
      })),
    )
    setLabour(p.labour.map((l) => ({ workType: l.workType, amount: l.amount })))
  }, [p])

  const parts = useMemo(
    () => ({ purchasePrice: purchase, costLines, materials, labour }),
    [purchase, costLines, materials, labour],
  )
  const extra = additionalDirectCost(parts)
  const total = finishedCost(parts)

  useEffect(() => {
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 200)
    return () => clearTimeout(t)
  }, [total])

  const save = useMutation({
    mutationFn: () =>
      api.updateCosting(token, id!, {
        purchasePrice: purchase,
        costLines,
        materials,
        labour,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['product', id] })
      navigate(`/inventory/${id}/pricing`)
    },
  })

  if (!p) {
    return (
      <>
        <TopBar title="Costing" backTo={`/inventory/${id}`} />
        <div className="skeleton mx-4 mt-3 h-40 rounded-[1.25rem]" />
      </>
    )
  }

  return (
    <>
      <TopBar title="Costing" backTo={`/inventory/${id}`} />
      <div className="space-y-4 px-4 pb-28 pt-3">
        <p className="text-sm font-medium text-mute">{p.name}</p>
        <Field label="Purchase price">
          <Input
            type="number"
            value={purchase}
            onChange={(e) => setPurchase(Number(e.target.value))}
          />
        </Field>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="section-label">Additional costs</h2>
            <button
              type="button"
              className="min-h-11 text-sm text-accent"
              onClick={() =>
                setCostLines((rows) => [
                  ...rows,
                  { label: 'Other', category: 'other', amount: 0 },
                ])
              }
            >
              Add line
            </button>
          </div>
          <div className="space-y-2">
            {costLines.map((row, i) => (
              <div key={`${row.label}-${i}`} className="grid grid-cols-[1fr_7rem] gap-2">
                <Input
                  value={row.label}
                  onChange={(e) =>
                    setCostLines((rows) =>
                      rows.map((r, idx) => (idx === i ? { ...r, label: e.target.value } : r)),
                    )
                  }
                />
                <Input
                  type="number"
                  value={row.amount}
                  onChange={(e) =>
                    setCostLines((rows) =>
                      rows.map((r, idx) =>
                        idx === i ? { ...r, amount: Number(e.target.value) } : r,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="section-label">Materials</h2>
            <button
              type="button"
              className="min-h-11 text-sm text-accent"
              onClick={() =>
                setMaterials((rows) => [
                  ...rows,
                  { name: '', qty: 1, unit: 'pcs', unitCost: 0 },
                ])
              }
            >
              Add material
            </button>
          </div>
          <div className="space-y-2">
            {materials.map((row, i) => (
              <div key={`${row.name}-${i}`} className="grid grid-cols-[1fr_4rem_4rem_6rem] gap-1">
                <Input
                  placeholder="Name"
                  value={row.name}
                  onChange={(e) =>
                    setMaterials((rows) =>
                      rows.map((r, idx) => (idx === i ? { ...r, name: e.target.value } : r)),
                    )
                  }
                />
                <Input
                  type="number"
                  value={row.qty}
                  onChange={(e) =>
                    setMaterials((rows) =>
                      rows.map((r, idx) => (idx === i ? { ...r, qty: Number(e.target.value) } : r)),
                    )
                  }
                />
                <Input
                  value={row.unit}
                  onChange={(e) =>
                    setMaterials((rows) =>
                      rows.map((r, idx) => (idx === i ? { ...r, unit: e.target.value } : r)),
                    )
                  }
                />
                <Input
                  type="number"
                  value={row.unitCost}
                  onChange={(e) =>
                    setMaterials((rows) =>
                      rows.map((r, idx) =>
                        idx === i ? { ...r, unitCost: Number(e.target.value) } : r,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="section-label">Labour</h2>
            <button
              type="button"
              className="min-h-11 text-sm text-accent"
              onClick={() =>
                setLabour((rows) => [...rows, { workType: 'Carpenter', amount: 0 }])
              }
            >
              Add work
            </button>
          </div>
          <div className="space-y-2">
            {labour.map((row, i) => (
              <div key={`${row.workType}-${i}`} className="grid grid-cols-[1fr_7rem] gap-2">
                <Input
                  value={row.workType}
                  onChange={(e) =>
                    setLabour((rows) =>
                      rows.map((r, idx) => (idx === i ? { ...r, workType: e.target.value } : r)),
                    )
                  }
                />
                <Input
                  type="number"
                  value={row.amount}
                  onChange={(e) =>
                    setLabour((rows) =>
                      rows.map((r, idx) =>
                        idx === i ? { ...r, amount: Number(e.target.value) } : r,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="app-frame fixed inset-x-0 bottom-16 z-10 border-t-4 border-t-accent bg-surface px-4 py-3 shadow-timber">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-mute">Additional ₹{extra.toLocaleString('en-IN')}</p>
            <p className={`font-mono text-lg font-semibold ${flash ? 'text-accent' : 'text-ink'}`}>
              Final <Rupee amount={total} />
            </p>
          </div>
          <div className="w-36">
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
