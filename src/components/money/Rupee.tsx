import { formatINR, formatLakh } from '../../lib/money.ts'
import { cn } from '../../lib/cn.ts'

export interface RupeeProps {
  amount: number
  compact?: boolean
  className?: string
}

export function Rupee({ amount, compact, className }: RupeeProps) {
  return (
    <span className={cn('font-mono tabular-nums', className)}>
      {compact ? formatLakh(amount) : formatINR(amount)}
    </span>
  )
}
