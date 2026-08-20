import { Link, useParams } from 'react-router-dom'
import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useOverview, useShowrooms } from '../hooks/useApi.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { formatPct } from '../lib/money.ts'

export interface ShowroomsPageProps {
  className?: string
}

export function ShowroomsPage(_props: ShowroomsPageProps) {
  const { user } = useAuth()
  const { data } = useOverview({ month: '2026-08' })
  if (user?.role !== 'owner') {
    return (
      <>
        <TopBar title="Showroom" />
        <p className="px-4 text-mute">Your branch is on Home.</p>
      </>
    )
  }
  return (
    <>
      <TopBar title="Showrooms" />
      <div className="px-4">
        <table className="w-full text-left text-sm">
          <thead className="text-[0.6875rem] uppercase tracking-[0.12em] text-mute">
            <tr>
              <th className="py-2">Branch</th>
              <th className="py-2 text-right">Rev</th>
              <th className="py-2 text-right">Exp</th>
              <th className="py-2 text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            {(data?.showrooms ?? []).map((sr) => (
              <tr key={sr.showroomId} className="border-t border-border">
                <td className="py-3">
                  <Link to={`/showrooms/${sr.showroomId}`} className="font-semibold">
                    {sr.city}
                  </Link>
                  <p className="text-xs text-mute">{formatPct(sr.marginPct)}</p>
                </td>
                <td className="text-right font-mono">
                  <Rupee amount={sr.revenue} compact />
                </td>
                <td className="text-right font-mono">
                  <Rupee amount={sr.expenses} compact />
                </td>
                <td className="text-right font-mono">
                  <Rupee amount={sr.profit} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export interface ShowroomDetailPageProps {
  className?: string
}

export function ShowroomDetailPage(_props: ShowroomDetailPageProps) {
  const { id } = useParams()
  const { data: showrooms } = useShowrooms()
  const { data } = useOverview({ month: '2026-08', showroomId: id })
  const sr = showrooms?.find((s) => s.id === id)
  const health = data?.showrooms.find((s) => s.showroomId === id)
  return (
    <>
      <TopBar title={sr?.city ?? 'Showroom'} backTo="/showrooms" />
      <div className="space-y-4 px-4">
        <p className="text-sm text-mute">{sr?.address}</p>
        <Card>
          <p className="text-sm text-mute">August operating profit</p>
          <p className="text-2xl font-semibold text-accent">
            <Rupee amount={health?.profit ?? 0} compact />
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-mute">Revenue</p>
              <Rupee amount={health?.revenue ?? 0} compact />
            </div>
            <div>
              <p className="text-mute">Expenses</p>
              <Rupee amount={health?.expenses ?? 0} compact />
            </div>
          </div>
        </Card>
        <Card>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
            Expense mix
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(data?.expensesByGroup ?? {}).map(([g, amt]) => (
              <li key={g} className="flex justify-between capitalize">
                <span className="text-mute">{g}</span>
                <Rupee amount={amt} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
