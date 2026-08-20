import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.tsx'
import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
import { Metric } from '../components/ui/Metric.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useOverview } from '../hooks/useApi.ts'
import { formatPct, monthLabel } from '../lib/money.ts'

export interface HomePageProps {
  className?: string
}

export function HomePage(_props: HomePageProps) {
  const { user } = useAuth()
  const { data, isLoading } = useOverview({ month: '2026-08' })

  if (isLoading || !data || !user) {
    return (
      <>
        <TopBar title="Home" />
        <PageBody>
          <div className="skeleton h-40 rounded-[1.5rem]" />
          <div className="skeleton h-24 rounded-[1.25rem]" />
        </PageBody>
      </>
    )
  }

  if (user.role === 'staff') {
    return (
      <>
        <TopBar title={data.showrooms[0]?.city ?? 'Showroom'} />
        <PageBody>
          <Card accent="top" className="rounded-[1.5rem] shadow-timber">
            <SectionLabel>
              {monthLabel(data.month)} · this branch
            </SectionLabel>
            <p className="mt-2 text-sm text-mute">Today&apos;s sales (month so far)</p>
            <p className="mt-1 font-mono text-[1.75rem] font-semibold text-accent">
              <Rupee amount={data.revenue} compact />
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Metric label="Available" valueClassName="text-lg">
                {data.inventory.available}
              </Metric>
              <Metric label="Under repair" valueClassName="text-lg text-ink">
                {data.inventory.underRepair}
              </Metric>
            </div>
          </Card>
          <div className="grid gap-2">
            <Link className="flex min-h-11 items-center justify-center rounded-[0.875rem] bg-accent font-semibold text-on-accent" to="/inventory/new">
              Add product
            </Link>
            <Link className="flex min-h-11 items-center justify-center rounded-[0.875rem] bg-chip font-semibold text-ink" to="/sales/new">
              Record sale
            </Link>
            <Link className="flex min-h-11 items-center justify-center rounded-[0.875rem] bg-chip font-semibold text-ink" to="/expenses/new">
              Add expense
            </Link>
          </div>
        </PageBody>
      </>
    )
  }

  return (
    <>
      <TopBar title="Business" />
      <PageBody>
        <Card accent="top" className="rounded-[1.5rem] shadow-timber">
          <SectionLabel>{monthLabel(data.month)}</SectionLabel>
          <p className="mt-3 text-sm text-mute">Net operating profit</p>
          <p className="font-mono text-[1.75rem] font-semibold tracking-tight text-accent">
            <Rupee amount={data.netProfit} compact />
          </p>
          <p className="mt-1 font-mono text-sm text-mute">{formatPct(data.marginPct)} margin</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Metric label="Revenue" valueClassName="text-base text-ink">
              <Rupee amount={data.revenue} compact />
            </Metric>
            <Metric label="Gross profit" valueClassName="text-base text-ink">
              <Rupee amount={data.grossProfit} compact />
            </Metric>
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <Metric label="Operating expenses" valueClassName="text-base text-ink">
              <Rupee amount={data.opex} compact />
            </Metric>
          </div>
        </Card>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {data.showrooms.map((sr) => (
            <Link
              key={sr.showroomId}
              to={`/showrooms/${sr.showroomId}`}
              className="relative min-w-[156px] shrink-0 overflow-hidden rounded-[1.25rem] border border-border bg-surface px-4 py-3 pl-5"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />
              <p className="text-sm font-semibold">{sr.city}</p>
              <p className="text-xs font-medium text-mute">
                {sr.status === 'good' ? 'Good' : 'Needs attention'}
              </p>
              <Rupee className="mt-1 text-sm font-semibold text-accent" amount={sr.profit} compact />
            </Link>
          ))}
        </div>

        <Card accent="left">
          <SectionLabel>Inventory</SectionLabel>
          <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-mute">Pieces</span>
            <span className="text-right font-mono font-semibold text-accent">{data.inventory.total}</span>
            <span className="text-mute">Available</span>
            <span className="text-right font-mono">{data.inventory.available}</span>
            <span className="text-mute">Reserved</span>
            <span className="text-right font-mono">{data.inventory.reserved}</span>
            <span className="text-mute">Under repair</span>
            <span className="text-right font-mono">{data.inventory.underRepair}</span>
            <span className="text-mute">Sold</span>
            <span className="text-right font-mono">{data.inventory.sold}</span>
            <span className="text-mute">Stock cost</span>
            <span className="text-right">
              <Rupee amount={data.inventory.inventoryCost} compact />
            </span>
          </div>
        </Card>

        <Card accent="left">
          <SectionLabel>Sales</SectionLabel>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between gap-3">
              <span className="text-mute">Best seller</span>
              <span className="text-right font-medium">{data.bestSeller}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-mute">Highest revenue</span>
              <span className="text-right font-medium">{data.highestRevenue}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-mute">Highest profit</span>
              <span className="text-right font-medium">{data.highestProfit}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-mute">Slow moving</span>
              <span className="text-right font-medium">{data.slowMoving}</span>
            </li>
          </ul>
        </Card>

        <p className="pb-1 text-center text-sm text-mute">
          Break-even hint on{' '}
          <Link to="/reports/breakeven" className="font-semibold text-accent">
            this month&apos;s units
          </Link>
        </p>
      </PageBody>
    </>
  )
}
