import type { ReactNode } from 'react'
import { BackLink } from '@/components/layout/back-link'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'

interface PageHeaderProps {
  backTo?: string
  backLabel?: string
  title: ReactNode
  subtitle?: ReactNode
}

export function PageHeader({ backTo, backLabel, title, subtitle }: PageHeaderProps) {
  return (
    <header>
      <div className="flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>

      {backTo ? (
        <BackLink to={backTo} label={backLabel ?? 'Voltar'} className="mt-4" />
      ) : null}

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </header>
  )
}
