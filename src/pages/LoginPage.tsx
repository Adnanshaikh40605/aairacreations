import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.tsx'
import { Button } from '../components/ui/Button.tsx'
import { Field, Input } from '../components/ui/Field.tsx'

export interface LoginPageProps {
  className?: string
}

export function LoginPage(_props: LoginPageProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('nandini@aaira.in')
  const [password, setPassword] = useState('aaira123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[440px] flex-col justify-center bg-canvas px-5 py-10">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-mute">
        Furniture costing
      </p>
      <h1 className="mt-2 text-[1.75rem] font-semibold tracking-tight">AAIRA CREATION</h1>
      <p className="mt-2 max-w-[28ch] text-mute">
        Finished cost, showroom accounts, and real operating profit — on the floor.
      </p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <Field label="Email" error={error}>
          <Input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-8 space-y-2 text-sm text-mute">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">Demo</p>
        <button
          type="button"
          className="block min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-left"
          onClick={() => {
            setEmail('nandini@aaira.in')
            setPassword('aaira123')
          }}
        >
          Owner — nandini@aaira.in
        </button>
        <button
          type="button"
          className="block min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-left"
          onClick={() => {
            setEmail('rahul@aaira.in')
            setPassword('aaira123')
          }}
        >
          Staff, Lonavala — rahul@aaira.in
        </button>
        <p>Password for both: aaira123</p>
      </div>
    </div>
  )
}
