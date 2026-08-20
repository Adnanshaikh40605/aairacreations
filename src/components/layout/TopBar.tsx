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
    <header className="sticky top-0 z-10 flex min-h-14 items-center gap-2 bg-canvas/95 px-4 backdrop-blur">
      {backTo ? (
        <Link
          to={backTo}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </Link>
      ) : (
        <Link to="/" className="font-semibold tracking-tight text-ink">
          AAIRA
        </Link>
      )}
      <h1 className={cn('flex-1 text-lg font-semibold', backTo ? '' : 'text-center')}>{title}</h1>
      <div className="flex min-w-11 justify-end">{action}</div>
    </header>
  )
}
