import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children: ReactNode
}

export function Chip({ selected = false, className, children, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold transition-[transform,opacity] duration-200',
        selected ? 'bg-accent text-on-accent' : 'bg-chip text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
