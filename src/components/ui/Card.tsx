import type { ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

export interface CardProps {
  children: ReactNode
  className?: string
  padded?: boolean
}

export function Card({ children, className, padded = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[1.25rem] border border-border bg-surface',
        padded && 'p-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
