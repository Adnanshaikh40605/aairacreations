import type { ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'

export interface PageBodyProps {
  children: ReactNode
  className?: string
}

export function PageBody({ children, className }: PageBodyProps) {
  return <div className={cn('space-y-3 px-4 pt-3', className)}>{children}</div>
}
