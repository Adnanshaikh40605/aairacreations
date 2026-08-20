import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../api/index.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { Rupee } from '../components/money/Rupee.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Card } from '../components/ui/Card.tsx'
import { EmptyState } from '../components/ui/EmptyState.tsx'
import { Field, Input, Select } from '../components/ui/Field.tsx'
import { PageBody } from '../components/ui/PageBody.tsx'
import { TopBar } from '../components/layout/TopBar.tsx'
import { useShowrooms, useStaff, useToken } from '../hooks/useApi.ts'

export interface StaffPageProps {
  className?: string
}

export function StaffPage(_props: StaffPageProps) {
  const { user } = useAuth()
  const { data } = useStaff()
  const { data: showrooms } = useShowrooms()
  const token = useToken()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('Sales Executive')
  const [showroomId, setShowroomId] = useState(showrooms?.[0]?.id ?? '')
  const [salary, setSalary] = useState(25000)
  const [joiningDate, setJoiningDate] = useState('2026-08-01')

  const mutate = useMutation({
    mutationFn: () =>
      api.createStaff(token, { name, designation, showroomId, salary, joiningDate }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['staff'] })
      setOpen(false)
    },
  })

  return (
    <>
      <TopBar
        title="Staff"
        action={
          user?.role === 'owner' ? (
            <button type="button" className="text-sm font-semibold" onClick={() => setOpen(true)}>
              Add
            </button>
          ) : null
        }
      />
      <PageBody>
        {(data ?? []).length === 0 ? (
          <EmptyState message="No staff on this list yet." />
        ) : (
          <ul className="space-y-2">
            {(data ?? []).map((s, i) => (
              <li key={s.id} className="enter-row" style={{ ['--index' as string]: i }}>
                <Card accent="left">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-mute">
                        {s.designation} · {showrooms?.find((x) => x.id === s.showroomId)?.city}
                      </p>
                    </div>
                    {user?.role === 'owner' ? (
                      <Rupee className="text-sm font-semibold text-accent" amount={s.salary} />
                    ) : (
                      <span className="inline-flex min-h-7 items-center rounded-full bg-chip px-2.5 text-xs font-semibold capitalize text-mute">
                        {s.status}
                      </span>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </PageBody>
      {open && user?.role === 'owner' ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 bg-ink/40"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <form
            className="app-frame fixed inset-x-0 bottom-16 z-30 rounded-t-3xl border border-border bg-surface p-4 pt-3"
            onSubmit={(e) => {
              e.preventDefault()
              mutate.mutate()
            }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-chip" />
            <p className="mb-3 font-semibold">Add staff</p>
            <div className="space-y-3">
              <Field label="Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Designation">
                <Input value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </Field>
              <Field label="Showroom">
                <Select value={showroomId} onChange={(e) => setShowroomId(e.target.value)}>
                  {(showrooms ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.city}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Monthly salary">
                <Input className="font-mono" type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} />
              </Field>
              <Field label="Joining date">
                <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </form>
        </>
      ) : null}
    </>
  )
}
