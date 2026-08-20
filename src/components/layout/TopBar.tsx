import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn.ts'

export interface TopBarProps {
  title: string
  backTo?: string
  action?: ReactNode
}

export function TopBar({ title, backTo, action }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex min-h-14 items-center gap-2 border-b border-chrome-line bg-chrome px-4 text-chrome-ink">
      {backTo ? (
        <Link
          to={backTo}
          className="flex h-11 w-11 items-center justify-center rounded-full text-chrome-ink"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </Link>
      ) : (
        <Link to="/" className="font-semibold tracking-tight text-chrome-ink">
          AAIRA
        </Link>
      )}
      <h1 className={cn('flex-1 text-lg font-semibold tracking-tight text-chrome-ink', backTo ? '' : 'text-center')}>
        {title}
      </h1>
      <div className="flex min-w-11 justify-end text-accent-bright [&_a]:text-accent-bright [&_button]:text-accent-bright">
        {action}
      </div>
    </header>
  )
}
