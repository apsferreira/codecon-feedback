import { Link } from 'react-router-dom'
import { BarChart3, ChevronRight, Mic2 } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { Logo } from '@/components/layout/logo'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTalks } from '@/hooks/use-talks'

const CARD_TINTS = [
  'bg-accent/40',
  'bg-secondary',
] as const

export function TalksListPage() {
  const { data: talks, isLoading, isError } = useTalks()

  return (
    <PageShell>
      <header>
        <Logo />
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Talks do evento
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Escolha uma palestra para avaliar. O voto é anônimo e leva poucos segundos.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </>
        ) : null}

        {isError ? (
          <Card className="border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive sm:p-6">
            Não foi possível carregar as talks. Verifique sua conexão e tente novamente.
          </Card>
        ) : null}

        {!isLoading && !isError && talks && talks.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground sm:p-6">
            Nenhuma talk disponível no momento.
          </Card>
        ) : null}

        {talks?.map((talk, index) => (
          <Card
            key={talk.slug}
            className={`gap-3 p-5 sm:p-6 ${CARD_TINTS[index % CARD_TINTS.length]}`}
          >
            <Link to={`/talks/${talk.slug}/vote`} className="block">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground">{talk.title}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mic2 className="size-3.5 shrink-0" aria-hidden="true" />
                    {talk.speaker}
                  </p>
                  {talk.description ? (
                    <p className="mt-3 text-sm text-muted-foreground">{talk.description}</p>
                  ) : null}
                </div>
                <ChevronRight
                  className="mt-1 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
              </div>
            </Link>

            <Button asChild variant="outline" size="sm" className="mt-1 w-full sm:w-auto">
              <Link to={`/talks/${talk.slug}/results`}>
                <BarChart3 className="size-3.5" aria-hidden="true" />
                Ver resultado ao vivo
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
