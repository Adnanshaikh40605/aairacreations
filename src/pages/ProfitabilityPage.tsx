import { useState } from 'react'
import { Rupee } from '../components/money/Rupee.tsx'
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
      <div className="px-4">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`min-h-11 rounded-xl border ${dir === 'high' ? 'border-accent bg-accent-soft text-accent' : 'border-border'}`}
            onClick={() => setDir('high')}
          >
            Highest profit
          </button>
          <button
            type="button"
            className={`min-h-11 rounded-xl border ${dir === 'low' ? 'border-accent bg-accent-soft text-accent' : 'border-border'}`}
            onClick={() => setDir('low')}
          >
            Lowest profit
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-[0.6875rem] uppercase tracking-[0.12em] text-mute">
            <tr>
              <th className="py-2">Product</th>
              <th className="py-2 text-right">Cost</th>
              <th className="py-2 text-right">Sell</th>
              <th className="py-2 text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.productId} className="border-t border-border">
                <td className="py-3 pr-2">
                  {r.name}
                  <p className="font-mono text-xs text-mute">{formatPct(r.marginPct)}</p>
                </td>
                <td className="text-right font-mono">
                  <Rupee amount={r.finishedCost} />
                </td>
                <td className="text-right font-mono">
                  <Rupee amount={r.sellingPrice} />
                </td>
                <td className="text-right font-mono">
                  <Rupee amount={r.profit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
