import { cn } from '../../lib/cn.ts'
import { STATUS_COLOR, STATUS_LABEL } from '../../lib/status.ts'
import type { ProductStatus } from '../../types.ts'

export interface StatusBadgeProps {
  status: ProductStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-mute">
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          STATUS_COLOR[status],
          status === 'available' || status === 'under_repair' ? 'pulse-dot' : '',
        )}
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
