import { useState } from 'react'
import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
import { Chip } from '../components/ui/Chip.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useProductProfit } from '../hooks/useApi.ts'
import { formatPct } from '../lib/money.ts'

export interface ProfitabilityPageProps {
  className?: string
}

export function ProfitabilityPage(_props: ProfitabilityPageProps) {
  const { data } = useProductProfit()
  const [dir, setDir] = useState<'high' | 'low'>('high')
  const rows = [...(data ?? [])].sort((a, b) => (dir === 'high' ? b.profit - a.profit : a.profit - b.profit))
  return (
    <>
      <TopBar title="Product profit" />
      <PageBody>
        <div className="grid grid-cols-2 gap-2">
          <Chip selected={dir === 'high'} onClick={() => setDir('high')} className="w-full rounded-[0.875rem]">
            Highest profit
          </Chip>
          <Chip selected={dir === 'low'} onClick={() => setDir('low')} className="w-full rounded-[0.875rem]">
            Lowest profit
          </Chip>
        </div>
        <Card padded={false} className="overflow-hidden">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-right">Cost</th>
                <th className="text-right">Sell</th>
                <th className="text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.productId}>
                  <td className="pr-2">
                    {r.name}
                    <p className="font-mono text-xs text-mute">{formatPct(r.marginPct)}</p>
                  </td>
                  <td className="text-right font-mono">
                    <Rupee amount={r.finishedCost} />
                  </td>
                  <td className="text-right font-mono">
                    <Rupee amount={r.sellingPrice} />
                  </td>
                  <td className="text-right font-mono font-semibold text-accent">
                    <Rupee amount={r.profit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </PageBody>
    </>
  )
}
