import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BarChart3, CheckCircle2 } from 'lucide-react'
import { PageShell } from '@/components/layout/page-shell'
import { PageHeader } from '@/components/layout/page-header'
import { RatingInput } from '@/components/rating-input'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTalk } from '@/hooks/use-talks'
import { useCreateVote } from '@/hooks/use-create-vote'
import { ApiError } from '@/api/client'

export function VotePage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: talk, isLoading: isTalkLoading } = useTalk(slug)
  const createVote = useCreateVote(slug ?? '')

  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [ratingError, setRatingError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!slug) {
    return null
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (rating === null) {
      setRatingError(true)
      return
    }
    setRatingError(false)

    createVote.mutate(
      { rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          setSubmitted(true)
          toast.success('Voto registrado com sucesso!')
        },
        onError: (error) => {
          const message =
            error instanceof ApiError ? error.message : 'Falha ao registrar o voto.'
          toast.error(message)
        },
      }
    )
  }

  return (
    <PageShell>
      <PageHeader
        backTo="/"
        backLabel="Voltar para talks"
        title={isTalkLoading ? <Skeleton className="h-8 w-3/4" /> : (talk?.title ?? 'Talk')}
        subtitle={talk ? `Palestrante: ${talk.speaker}` : undefined}
      />

      <div className="mt-8">
        {submitted ? (
          <Card className="items-center gap-4 p-5 text-center sm:p-6">
            <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Obrigado pelo voto!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sua avaliação foi registrada anonimamente.
              </p>
            </div>
            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/">Voltar para talks</Link>
              </Button>
              <Button asChild className="w-full font-semibold sm:w-auto">
                <Link to={`/talks/${slug}/results`}>
                  <BarChart3 className="size-4" aria-hidden="true" />
                  Ver resultado ao vivo
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <Label htmlFor="rating-group">Sua nota</Label>
                <div id="rating-group" className="mt-3">
                  <RatingInput
                    value={rating}
                    onChange={(value) => {
                      setRating(value)
                      setRatingError(false)
                    }}
                    disabled={createVote.isPending}
                    error={ratingError}
                  />
                </div>
                {ratingError ? (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    Selecione uma nota de 1 a 5 antes de enviar.
                  </p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="comment">Comentário (opcional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="O que você achou da talk?"
                  rows={4}
                  disabled={createVote.isPending}
                  className="mt-3"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-semibold"
                disabled={createVote.isPending}
              >
                {createVote.isPending ? 'Enviando...' : 'Enviar voto'}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
