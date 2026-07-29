import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-svh bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">{children}</div>
    </div>
  )
}
