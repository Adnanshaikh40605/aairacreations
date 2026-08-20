import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav.tsx'

export interface AppShellProps {
  children?: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-frame min-h-[100dvh] bg-canvas">
      <div className="pb-24">{children ?? <Outlet />}</div>
      <BottomNav />
    </div>
  )
}
