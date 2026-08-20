import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useBreakEven } from '../hooks/useApi.ts'
import { monthLabel } from '../lib/money.ts'

export interface BreakEvenPageProps {
  className?: string
}

export function BreakEvenPage(_props: BreakEvenPageProps) {
  const { data } = useBreakEven({ month: '2026-08' })
  if (!data) {
    return (
      <>
        <TopBar title="Break-even" />
        <div className="skeleton mx-4 h-32 rounded-[1.25rem]" />
      </>
    )
  }
  return (
    <>
      <TopBar title="Break-even" />
      <div className="space-y-4 px-4">
        <p className="text-sm text-mute">{monthLabel(data.month)}</p>
        <Card className="rounded-[1.5rem] shadow-timber">
          <p className="text-sm text-mute">Pieces to cover fixed opex</p>
          <p className="mt-2 font-mono text-4xl font-semibold text-accent">{data.unitsNeeded}</p>
          <p className="mt-2 text-sm text-mute">Sold so far: {data.unitsSold}</p>
        </Card>
        <Card>
          <div className="flex justify-between text-sm">
            <span className="text-mute">Fixed opex</span>
            <Rupee amount={data.fixedOpex} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-mute">Avg gross profit / piece</span>
            <Rupee amount={data.avgGrossProfitPerPiece} />
          </div>
        </Card>
        <p className="text-sm text-mute">
          After {data.unitsNeeded} pieces, further sales drop to the operating-profit line.
        </p>
      </div>
    </>
  )
}
