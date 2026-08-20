import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api/index.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { Rupee } from '../components/money/Rupee.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { Field, Input, Select, TextArea } from '../components/ui/Field.tsx'
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
          <Link to="/expenses/new" className="text-sm font-semibold text-accent">
            Add
          </Link>
        }
      />
      <div className="space-y-4 px-4">
        <Card>
          <p className="text-sm text-mute">August 2026</p>
          <p className="text-2xl font-semibold">
            <Rupee amount={total} compact />
          </p>
          {budget ? (
            <p className="mt-2 text-sm text-mute">
              Marketing budget <Rupee amount={budget} /> · spent <Rupee amount={marketingSpend} /> ·
              remaining <Rupee amount={budget - marketingSpend} />
            </p>
          ) : null}
        </Card>
        <ul className="space-y-2">
          {(data ?? []).map((e) => (
            <li key={e.id}>
              <Card padded={false} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">{e.category}</p>
                  <p className="text-xs capitalize text-mute">
                    {e.group} · {e.incurredOn}
                  </p>
                </div>
                <Rupee amount={e.amount} />
              </Card>
            </li>
          ))}
        </ul>
      </div>
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
        className="space-y-4 px-4"
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
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
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
