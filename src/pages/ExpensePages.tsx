import { Plus } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api/index.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { Rupee } from '../components/money/Rupee.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { EmptyState } from '../components/ui/EmptyState.tsx'
import { Field, Input, Select, TextArea } from '../components/ui/Field.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useExpenses, useMarketing, useShowrooms, useToken } from '../hooks/useApi.ts'
import type { ExpenseGroup } from '../types.ts'

const GROUPS: ExpenseGroup[] = [
  'showroom',
  'staff',
  'marketing',
  'operations',
  'office',
  'finance',
  'other',
]

const CATS: Record<ExpenseGroup, string[]> = {
  showroom: ['Rent', 'Electricity', 'Maintenance', 'Security', 'Cleaning'],
  staff: ['Salary', 'Bonus', 'Commission', 'Travel'],
  marketing: ['Google', 'Meta', 'Offline', 'Printing', 'Influencer', 'Website'],
  operations: ['Transport', 'Packaging', 'Courier', 'Repair'],
  office: ['Software', 'Internet', 'Phone', 'Stationery'],
  finance: ['Bank charges', 'Loan interest', 'Payment gateway'],
  other: ['Miscellaneous'],
}

export interface ExpensesPageProps {
  className?: string
}

export function ExpensesPage(_props: ExpensesPageProps) {
  const { data } = useExpenses({ month: '2026-08' })
  const { data: budgets } = useMarketing({ month: '2026-08' })
  const marketingSpend = (data ?? [])
    .filter((e) => e.group === 'marketing')
    .reduce((s, e) => s + e.amount, 0)
  const budget = (budgets ?? []).reduce((s, b) => s + b.budget, 0)
  const total = (data ?? []).reduce((s, e) => s + e.amount, 0)

  return (
    <>
      <TopBar
        title="Expenses"
        action={
          <Link to="/expenses/new" className="flex h-11 w-11 items-center justify-center" aria-label="Add expense">
            <Plus size={22} />
          </Link>
        }
      />
      <PageBody>
        <Card accent="top" className="rounded-[1.5rem] shadow-timber">
          <SectionLabel>August 2026</SectionLabel>
          <p className="mt-1 font-mono text-2xl font-semibold text-accent">
            <Rupee amount={total} compact />
          </p>
          {budget ? (
            <p className="mt-2 text-sm text-mute">
              Marketing budget <Rupee className="text-ink" amount={budget} /> · spent{' '}
              <Rupee className="text-ink" amount={marketingSpend} /> · remaining{' '}
              <Rupee className="font-semibold text-accent" amount={budget - marketingSpend} />
            </p>
          ) : null}
        </Card>
        {(data ?? []).length === 0 ? (
          <EmptyState
            message="No expenses logged this month. Add rent, salary, or marketing spend."
            action={
              <Link
                to="/expenses/new"
                className="flex min-h-11 items-center justify-center rounded-[0.875rem] bg-accent font-semibold text-on-accent"
              >
                Add expense
              </Link>
            }
          />
        ) : (
          <ul className="space-y-2">
            {(data ?? []).map((e, i) => (
              <li key={e.id} className="enter-row" style={{ ['--index' as string]: i }}>
                <Card padded={false} accent="left" className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <p className="font-medium">{e.category}</p>
                    <p className="text-xs capitalize text-mute">
                      {e.group} · {e.incurredOn}
                    </p>
                  </div>
                  <Rupee className="font-semibold" amount={e.amount} />
                </Card>
              </li>
            ))}
          </ul>
        )}
      </PageBody>
    </>
  )
}

export interface AddExpensePageProps {
  className?: string
}

export function AddExpensePage(_props: AddExpensePageProps) {
  const { user } = useAuth()
  const token = useToken()
  const { data: showrooms } = useShowrooms()
  const qc = useQueryClient()
  const [group, setGroup] = useState<ExpenseGroup>('showroom')
  const [category, setCategory] = useState('Rent')
  const [amount, setAmount] = useState(0)
  const [showroomId, setShowroomId] = useState(user?.showroomId ?? '')
  const [date, setDate] = useState('2026-08-20')
  const [note, setNote] = useState('')

  const mutate = useMutation({
    mutationFn: () =>
      api.createExpense(token, {
        showroomId: user?.role === 'staff' ? user.showroomId! : showroomId,
        group,
        category,
        amount,
        incurredOn: date,
        note,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses'] }),
  })

  return (
    <>
      <TopBar title="Add expense" backTo="/expenses" />
      <form
        className="space-y-3 px-4 pt-3"
        onSubmit={(e) => {
          e.preventDefault()
          mutate.mutate()
        }}
      >
        {user?.role === 'owner' ? (
          <Field label="Showroom">
            <Select value={showroomId} onChange={(e) => setShowroomId(e.target.value)}>
              {(showrooms ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.city}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field label="Group">
          <Select
            value={group}
            onChange={(e) => {
              const g = e.target.value as ExpenseGroup
              setGroup(g)
              setCategory(CATS[g][0])
            }}
          >
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATS[group].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Amount">
          <Input className="font-mono" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </Field>
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Note">
          <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <Button type="submit" disabled={mutate.isPending}>
          {mutate.isSuccess ? 'Saved' : 'Save expense'}
        </Button>
      </form>
    </>
  )
}
