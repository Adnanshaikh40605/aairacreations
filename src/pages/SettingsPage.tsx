import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'

export interface SettingsPageProps {
  className?: string
}

export function SettingsPage(_props: SettingsPageProps) {
  const { user, logout } = useAuth()
  const ownerLinks = [
    { to: '/showrooms', label: 'Showrooms' },
    { to: '/staff', label: 'Staff' },
    { to: '/reports/pnl', label: 'Monthly P&L' },
    { to: '/reports/profitability', label: 'Product profitability' },
    { to: '/reports/breakeven', label: 'Break-even' },
  ]
  const staffLinks = [
    { to: '/staff', label: 'Branch team' },
    { to: '/reports/pnl', label: 'Branch P&L' },
    { to: '/reports/breakeven', label: 'Break-even' },
  ]
  const links = user?.role === 'owner' ? ownerLinks : staffLinks
  return (
    <>
      <TopBar title="More" />
      <PageBody>
        <Card accent="left">
          <SectionLabel>Signed in</SectionLabel>
          <p className="mt-1 font-semibold">{user?.name}</p>
          <p className="text-sm capitalize text-mute">{user?.role}</p>
        </Card>
        <ul className="divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border bg-surface">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="flex min-h-14 items-center px-4 font-medium">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </PageBody>
    </>
  )
}
