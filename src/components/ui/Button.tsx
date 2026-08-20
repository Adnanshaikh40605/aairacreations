import type { ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

export interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  className,
  disabled,
  onClick,
}: ButtonProps) {
  const styles = {
    primary: 'bg-accent text-surface',
    secondary: 'bg-surface text-ink border border-border',
    ghost: 'bg-transparent text-mute',
    danger: 'bg-sold text-surface',
  } as const
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-h-11 w-full rounded-[0.875rem] px-4 text-[0.9375rem] font-semibold active:scale-[0.98] disabled:opacity-50',
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}
