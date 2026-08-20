import { Rupee } from '../components/money/Rupee.tsx'
import { Card } from '../components/ui/Card.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
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
        <PageBody>
          <div className="skeleton h-32 rounded-[1.25rem]" />
        </PageBody>
      </>
    )
  }
  return (
    <>
      <TopBar title="Break-even" />
      <PageBody>
        <p className="text-sm text-mute">{monthLabel(data.month)}</p>
        <Card accent="top" className="rounded-[1.5rem] shadow-timber">
          <SectionLabel>Pieces to cover fixed opex</SectionLabel>
          <p className="mt-2 font-mono text-4xl font-semibold text-accent">{data.unitsNeeded}</p>
          <p className="mt-2 text-sm text-mute">Sold so far: {data.unitsSold}</p>
        </Card>
        <Card accent="left">
          <div className="flex justify-between text-sm">
            <span className="text-mute">Fixed opex</span>
            <Rupee className="font-semibold" amount={data.fixedOpex} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-mute">Avg gross profit / piece</span>
            <Rupee className="font-semibold text-accent" amount={data.avgGrossProfitPerPiece} />
          </div>
        </Card>
        <p className="text-sm text-mute">
          After {data.unitsNeeded} pieces, further sales drop to the operating-profit line.
        </p>
      </PageBody>
    </>
  )
}
