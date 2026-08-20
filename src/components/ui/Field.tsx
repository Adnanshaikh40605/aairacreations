import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn.ts'

export interface FieldProps {
  label: string
  children: ReactNode
  error?: string
}

export function Field({ label, children, error }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mute">
        {label}
      </span>
      {children}
      {error ? <span className="text-sm text-sold">{error}</span> : null}
    </label>
  )
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        'min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[0.9375rem] text-ink outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas',
        className,
      )}
    />
  )
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={cn(
        'min-h-12 w-full rounded-xl border border-border bg-surface px-3 text-[0.9375rem] text-ink outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas',
        className,
      )}
    >
      {children}
    </select>
  )
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-24 w-full rounded-xl border border-border bg-surface px-3 py-3 text-[0.9375rem] text-ink outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas',
        className,
      )}
    />
  )
}
