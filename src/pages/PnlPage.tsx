import { Link } from 'react-router-dom'
import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { usePnl } from '../hooks/useApi.ts'
import { formatPct, monthLabel } from '../lib/money.ts'
import { useAuth } from '../auth/AuthContext.tsx'

export interface PnlPageProps {
  className?: string
}

export function PnlPage(_props: PnlPageProps) {
  const { user } = useAuth()
  const { data } = usePnl({ month: '2026-08' })
  if (!data) {
    return (
      <>
        <TopBar title="P&L" />
        <PageBody>
          <div className="skeleton h-40 rounded-[1.25rem]" />
        </PageBody>
      </>
    )
  }
  const mom =
    data.prevMonth.sales === 0
      ? 0
      : ((data.sales - data.prevMonth.sales) / data.prevMonth.sales) * 100
  const yoy =
    data.prevYear.sales === 0
      ? 0
      : ((data.sales - data.prevYear.sales) / data.prevYear.sales) * 100
  return (
    <>
      <TopBar title="Monthly P&L" />
      <PageBody>
        <p className="text-sm text-mute">
          {monthLabel(data.month)}
          {user?.role === 'staff' ? ' · your branch' : ' · all showrooms'}
        </p>
        <Card accent="top">
          <Row label="Sales" amount={data.sales} />
          <Row label="Product cost" amount={data.productCost} />
          <Row label="Gross profit" amount={data.grossProfit} strong />
          <Row label="Operating expenses" amount={data.operatingExpenses} />
          <Row label="Net operating profit" amount={data.netOperatingProfit} strong />
        </Card>
        <Card accent="left">
          <SectionLabel>Comparisons</SectionLabel>
          <p className="mt-2 text-sm">
            vs {monthLabel(data.prevMonth.month)} sales {formatPct(mom)}
          </p>
          <p className="mt-1 text-sm text-mute">
            Net then <Rupee amount={data.prevMonth.netOperatingProfit} compact />
          </p>
          <p className="mt-3 text-sm">
            vs {monthLabel(data.prevYear.month)} sales {formatPct(yoy)}
          </p>
          <p className="mt-1 text-sm text-mute">
            Net then <Rupee amount={data.prevYear.netOperatingProfit} compact />
          </p>
        </Card>
        <Link to="/reports/breakeven" className="block text-center text-sm font-semibold text-accent">
          Break-even for this month
        </Link>
      </PageBody>
    </>
  )
}

function Row({ label, amount, strong }: { label: string; amount: number; strong?: boolean }) {
  return (
    <div className={`flex justify-between border-b border-border py-2 last:border-b-0 ${strong ? 'font-semibold' : ''} text-sm`}>
      <span className="text-mute">{label}</span>
      <Rupee className={strong ? 'text-accent' : undefined} amount={amount} />
    </div>
  )
}
