import { useParams } from 'react-router-dom'
import { MessageSquareOff, Star, Users } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RatingDisplay } from '@/components/rating-display'
import { useTalk } from '@/hooks/use-talks'
import { useTalkComments, useTalkStats } from '@/hooks/use-talk-results'
import { formatAverage, formatTime } from '@/lib/format'

const COMMENT_TINTS = ['bg-accent/40', 'bg-secondary'] as const

export function ResultsPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: talk, isLoading: isTalkLoading } = useTalk(slug)
  const statsQuery = useTalkStats(slug ?? '')
  const commentsQuery = useTalkComments(slug ?? '')

  if (!slug) {
    return null
  }

  const stats = statsQuery.data
  const comments = commentsQuery.data
  const hasVotes = (stats?.total_votes ?? 0) > 0

  return (
    <PageShell>
      <PageHeader
        backTo="/"
        backLabel="Voltar para talks"
        title={isTalkLoading ? <Skeleton className="h-8 w-3/4" /> : (talk?.title ?? 'Resultado')}
        subtitle={talk ? `Palestrante: ${talk.speaker} · atualiza automaticamente` : undefined}
      />

      <div className="mt-8 flex flex-col gap-4">
        <Card className="flex-row items-center gap-6 p-5 sm:p-6">
          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-1.5 text-3xl font-bold text-foreground">
              <Star className="size-6 fill-primary text-primary" aria-hidden="true" />
              {statsQuery.isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                formatAverage(stats?.average_rating ?? 0)
              )}
            </div>
            <span className="text-xs text-muted-foreground">Média geral</span>
          </div>

          <div className="h-12 w-px bg-border" aria-hidden="true" />

          <div className="flex flex-1 flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-1.5 text-3xl font-bold text-foreground">
              <Users className="size-6 text-primary" aria-hidden="true" />
              {statsQuery.isLoading ? <Skeleton className="h-8 w-8" /> : (stats?.total_votes ?? 0)}
            </div>
            <span className="text-xs text-muted-foreground">Total de votos</span>
          </div>
        </Card>

        {!statsQuery.isLoading && !hasVotes ? (
          <Card className="items-center gap-2 p-5 text-center sm:p-6">
            <p className="text-sm font-medium text-foreground">Ainda sem votos</p>
            <p className="text-sm text-muted-foreground">
              Assim que alguém votar, as estatísticas aparecem aqui automaticamente.
            </p>
          </Card>
        ) : null}

        <section>
          <h2 className="text-lg font-semibold text-foreground">Comentários</h2>

          <div className="mt-4 flex flex-col gap-4">
            {commentsQuery.isLoading ? (
              <>
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </>
            ) : null}

            {!commentsQuery.isLoading && comments && comments.length === 0 ? (
              <Card className="items-center gap-2 p-5 text-center text-sm text-muted-foreground sm:p-6">
                <MessageSquareOff className="size-6" aria-hidden="true" />
                Nenhum comentário ainda.
              </Card>
            ) : null}

            {comments?.map((entry, index) => (
              <Card
                key={`${entry.created_at}-${index}`}
                className={`gap-2 p-5 sm:p-6 ${COMMENT_TINTS[index % COMMENT_TINTS.length]}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <RatingDisplay rating={entry.rating} />
                  <time
                    dateTime={entry.created_at}
                    className="shrink-0 text-xs text-muted-foreground"
                  >
                    {formatTime(entry.created_at)}
                  </time>
                </div>
                <p className="text-sm text-foreground">{entry.comment}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
