import type { ReactNode } from 'react'
import { cn } from '../../lib/cn.ts'
import { SectionLabel } from './SectionLabel.tsx'

export interface MetricProps {
  label: string
  children: ReactNode
  className?: string
  valueClassName?: string
}

export function Metric({ label, children, className, valueClassName }: MetricProps) {
  return (
    <div className={className}>
      <SectionLabel>{label}</SectionLabel>
      <div className={cn('mt-1 font-mono text-xl font-semibold tabular-nums text-accent', valueClassName)}>
        {children}
      </div>
    </div>
  )
}
