import { cn } from '../../lib/cn.ts'
import { STATUS_LABEL, STATUS_TINT } from '../../lib/status.ts'
import type { ProductStatus } from '../../types.ts'

export interface StatusBadgeProps {
  status: ProductStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold',
        STATUS_TINT[status],
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full bg-current',
          status === 'available' || status === 'under_repair' ? 'pulse-dot' : '',
        )}
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
