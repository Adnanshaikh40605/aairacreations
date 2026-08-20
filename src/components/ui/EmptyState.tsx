import type { ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

export interface EmptyStateProps {
  message: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-[1.25rem] border border-border bg-surface px-5 py-8 text-center',
        className,
      )}
    >
      <svg viewBox="0 0 72 48" className="h-12 w-[72px] text-accent" aria-hidden="true">
        <rect x="6" y="22" width="60" height="16" rx="3" fill="currentColor" opacity="0.18" />
        <rect x="10" y="14" width="24" height="12" rx="2" fill="currentColor" opacity="0.55" />
        <rect x="38" y="16" width="24" height="10" rx="2" fill="currentColor" opacity="0.4" />
        <circle cx="18" cy="40" r="3" fill="currentColor" />
        <circle cx="54" cy="40" r="3" fill="currentColor" />
      </svg>
      <p className="mt-3 max-w-[28ch] text-sm text-mute">{message}</p>
      {action ? <div className="mt-4 w-full">{action}</div> : null}
    </div>
  )
}
