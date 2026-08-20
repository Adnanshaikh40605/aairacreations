import type { ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

export interface CardProps {
  children: ReactNode
  className?: string
  padded?: boolean
  accent?: 'left' | 'top' | false
}

export function Card({ children, className, padded = true, accent = false }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[1.25rem] border border-border bg-surface',
        padded && (accent === 'left' ? 'py-3.5 pl-4 pr-3.5' : 'p-3.5'),
        className,
      )}
    >
      {accent === 'left' ? (
        <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />
      ) : null}
      {accent === 'top' ? (
        <span className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden="true" />
      ) : null}
      {children}
    </div>
  )
}
