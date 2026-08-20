import { Link, useParams } from 'react-router-dom'
import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
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
        <PageBody>
          <p className="text-mute">Your branch is on Home.</p>
        </PageBody>
      </>
    )
  }
  return (
    <>
      <TopBar title="Showrooms" />
      <PageBody>
        <Card padded={false} className="overflow-hidden">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th className="text-right">Rev</th>
                <th className="text-right">Exp</th>
                <th className="text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {(data?.showrooms ?? []).map((sr) => (
                <tr key={sr.showroomId}>
                  <td>
                    <Link to={`/showrooms/${sr.showroomId}`} className="font-semibold text-accent">
                      {sr.city}
                    </Link>
                    <p className="font-mono text-xs text-mute">{formatPct(sr.marginPct)}</p>
                  </td>
                  <td className="text-right font-mono">
                    <Rupee amount={sr.revenue} compact />
                  </td>
                  <td className="text-right font-mono">
                    <Rupee amount={sr.expenses} compact />
                  </td>
                  <td className="text-right font-mono font-semibold text-accent">
                    <Rupee amount={sr.profit} compact />
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
      <PageBody>
        <p className="text-sm text-mute">{sr?.address}</p>
        <Card accent="top" className="rounded-[1.5rem] shadow-timber">
          <SectionLabel>August operating profit</SectionLabel>
          <p className="mt-1 font-mono text-2xl font-semibold text-accent">
            <Rupee amount={health?.profit ?? 0} compact />
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-mute">Revenue</p>
              <Rupee className="font-semibold" amount={health?.revenue ?? 0} compact />
            </div>
            <div>
              <p className="text-mute">Expenses</p>
              <Rupee className="font-semibold" amount={health?.expenses ?? 0} compact />
            </div>
          </div>
        </Card>
        <Card accent="left">
          <SectionLabel>Expense mix</SectionLabel>
          <ul className="mt-2 space-y-1.5 text-sm">
            {Object.entries(data?.expensesByGroup ?? {}).map(([g, amt]) => (
              <li key={g} className="flex justify-between capitalize">
                <span className="text-mute">{g}</span>
                <Rupee amount={amt} />
              </li>
            ))}
          </ul>
        </Card>
      </PageBody>
    </>
  )
}
