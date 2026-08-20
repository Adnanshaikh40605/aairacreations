import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.tsx'
import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
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
        <div className="space-y-3 px-4">
          <div className="skeleton h-40 rounded-[1.5rem]" />
          <div className="skeleton h-24 rounded-[1.25rem]" />
        </div>
      </>
    )
  }

  if (user.role === 'staff') {
    return (
      <>
        <TopBar title={data.showrooms[0]?.city ?? 'Showroom'} />
        <div className="space-y-4 px-4">
          <Card className="rounded-[1.5rem] shadow-timber">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
              {monthLabel(data.month)} · this branch
            </p>
            <p className="mt-2 text-sm text-mute">Today&apos;s sales (month so far)</p>
            <p className="mt-1 text-[1.75rem] font-semibold">
              <Rupee amount={data.revenue} compact />
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-mute">Available</p>
                <p className="font-mono text-lg">{data.inventory.available}</p>
              </div>
              <div>
                <p className="text-mute">Under repair</p>
                <p className="font-mono text-lg">{data.inventory.underRepair}</p>
              </div>
            </div>
          </Card>
          <div className="grid gap-2">
            <Link className="flex min-h-11 items-center justify-center rounded-[0.875rem] bg-accent font-semibold text-surface" to="/inventory/new">
              Add product
            </Link>
            <Link className="flex min-h-11 items-center justify-center rounded-[0.875rem] border border-border bg-surface font-semibold" to="/sales/new">
              Record sale
            </Link>
            <Link className="flex min-h-11 items-center justify-center rounded-[0.875rem] border border-border bg-surface font-semibold" to="/expenses/new">
              Add expense
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title="Business" />
      <div className="space-y-4 px-4">
        <Card className="rounded-[1.5rem] shadow-timber">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
            {monthLabel(data.month)}
          </p>
          <p className="mt-3 text-sm text-mute">Net operating profit</p>
          <p className="text-[1.75rem] font-semibold tracking-tight">
            <Rupee amount={data.netProfit} compact />
          </p>
          <p className="mt-1 font-mono text-sm text-mute">{formatPct(data.marginPct)} margin</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-mute">Revenue</p>
              <Rupee className="text-base font-medium" amount={data.revenue} compact />
            </div>
            <div>
              <p className="text-xs text-mute">Gross profit</p>
              <Rupee className="text-base font-medium" amount={data.grossProfit} compact />
            </div>
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs text-mute">Operating expenses</p>
            <Rupee className="text-base font-medium" amount={data.opex} compact />
          </div>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {data.showrooms.map((sr) => (
            <Link
              key={sr.showroomId}
              to={`/showrooms/${sr.showroomId}`}
              className="min-w-[148px] shrink-0 rounded-full border border-border bg-surface px-4 py-3"
            >
              <p className="text-sm font-semibold">{sr.city}</p>
              <p className="font-mono text-xs text-mute">
                {sr.status === 'good' ? 'Good' : 'Needs attention'} · <Rupee amount={sr.profit} compact />
              </p>
            </Link>
          ))}
        </div>

        <Card>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
            Inventory
          </p>
          <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-mute">Pieces</span>
            <span className="font-mono text-right">{data.inventory.total}</span>
            <span className="text-mute">Available</span>
            <span className="font-mono text-right">{data.inventory.available}</span>
            <span className="text-mute">Reserved</span>
            <span className="font-mono text-right">{data.inventory.reserved}</span>
            <span className="text-mute">Under repair</span>
            <span className="font-mono text-right">{data.inventory.underRepair}</span>
            <span className="text-mute">Sold</span>
            <span className="font-mono text-right">{data.inventory.sold}</span>
            <span className="text-mute">Stock cost</span>
            <span className="text-right">
              <Rupee amount={data.inventory.inventoryCost} compact />
            </span>
          </div>
        </Card>

        <Card>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
            Sales
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-mute">Best seller</span>
              <span>{data.bestSeller}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-mute">Highest revenue</span>
              <span>{data.highestRevenue}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-mute">Highest profit</span>
              <span>{data.highestProfit}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-mute">Slow moving</span>
              <span>{data.slowMoving}</span>
            </li>
          </ul>
        </Card>

        <p className="text-center text-sm text-mute">
          Break-even hint on{' '}
          <Link to="/reports/breakeven" className="text-accent">
            this month&apos;s units
          </Link>
        </p>
      </div>
    </>
  )
}
