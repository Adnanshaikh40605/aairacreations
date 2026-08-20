import type { ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

export interface SectionLabelProps {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return <p className={cn('section-label', className)}>{children}</p>
}
