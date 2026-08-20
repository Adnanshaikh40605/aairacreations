import { Home, MoreHorizontal, Package, Receipt, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn.ts'

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/sales', label: 'Sales', icon: Receipt },
  { to: '/expenses', label: 'Expenses', icon: Wallet },
  { to: '/more', label: 'More', icon: MoreHorizontal },
]

export interface BottomNavProps {
  className?: string
}

export function BottomNav({ className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[440px] border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.625rem] font-medium',
                  isActive ? 'text-accent' : 'text-mute',
                )
              }
            >
              <item.icon size={22} strokeWidth={1.75} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
