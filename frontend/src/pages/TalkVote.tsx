import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import Stars from '@/components/Stars'
import VoteCard from '@/components/VoteCard'
import DistributionBar from '@/components/DistributionBar'
import { fetchVotes, fetchStats, submitVote } from '@/lib/api'
import { usePolling } from '@/hooks/usePolling'
import { formatRating } from '@/lib/utils'

const TALK_META: Record<string, { title: string; speaker: string }> = {
  'sdd-sopa': { title: 'SDD: para além da sopa de letrinhas', speaker: 'Antonio Pedro Ferreira' },
  'a-definir': { title: '(a definir)', speaker: '(a definir)' },
}

export default function TalkVote() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const voteFn = useCallback(() => fetchVotes(slug!), [slug])
  const statsFn = useCallback(() => fetchStats(slug!), [slug])

  const { data: votes } = usePolling(voteFn, 5000, [slug])
  const { data: stats } = usePolling(statsFn, 5000, [slug])

  const talk = TALK_META[slug ?? ''] ?? { title: slug ?? '', speaker: '' }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Selecione uma nota de 1 a 5 estrelas')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await submitVote(slug!, rating, comment)
      setSuccess(true)
      setRating(0)
      setComment('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar voto')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 py-4 px-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition-colors text-sm"
          aria-label="Voltar para home"
        >
          ← Voltar
        </button>
        <Logo size="sm" />
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-8">
        {/* Título + speaker */}
        <div>
          <h1 className="text-xl font-bold text-white leading-snug">{talk.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{talk.speaker}</p>
        </div>

        {/* Stats compactos */}
        {stats && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-violet-900/50 text-violet-300 border border-violet-800 text-sm font-semibold px-3 py-1 rounded-full">
              {formatRating(stats.average_rating)} ★ média
            </span>
            <span className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-700">
              {stats.total} {stats.total === 1 ? 'voto' : 'votos'}
            </span>
          </div>
        )}

        {/* Formulário de voto */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          {success ? (
            <div className="text-center py-4 animate-fade-in">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-lg font-semibold text-white">Voto registrado!</p>
              <p className="text-sm text-gray-400 mt-1">Obrigado pela sua avaliação</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 text-sm text-violet-400 hover:text-violet-300 underline underline-offset-4"
              >
                Votar novamente
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sua nota <span className="text-red-400">*</span>
                </label>
                <Stars
                  value={rating}
                  size="lg"
                  interactive
                  onChange={setRating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="comment">
                  Comentário
                  <span className="text-gray-500 font-normal ml-1">(opcional)</span>
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Deixe um comentário (opcional)"
                  rows={3}
                  maxLength={1000}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {submitting ? 'Enviando...' : 'Enviar voto'}
              </button>
            </form>
          )}
        </div>

        {/* Distribuição */}
        {stats && stats.total > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Distribuição de notas
            </h3>
            <DistributionBar distribution={stats.distribution} total={stats.total} />
          </div>
        )}

        {/* Feed de votos */}
        {votes && votes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Votos recentes
            </h3>
            <div className="space-y-2">
              {votes.map((vote, i) => (
                <VoteCard key={vote.id} vote={vote} animate={i === 0} />
              ))}
            </div>
          </div>
        )}

        {/* Link outra palestra */}
        <div className="text-center pb-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-violet-400 transition-colors underline underline-offset-4"
          >
            Votar em outra palestra
          </button>
        </div>
      </main>
    </div>
  )
}
