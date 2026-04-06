import { useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import Stars from '@/components/Stars'
import VoteCard from '@/components/VoteCard'
import DistributionBar from '@/components/DistributionBar'
import { fetchVotes, fetchStats } from '@/lib/api'
import { usePolling } from '@/hooks/usePolling'
import { formatRating } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'

const TALK_META: Record<string, { title: string; speaker: string }> = {
  'sdd-sopa': { title: 'SDD: para além da sopa de letrinhas', speaker: 'Antonio Pedro Ferreira' },
  'a-definir': { title: '(a definir)', speaker: '(a definir)' },
}

export default function TalkLive() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const voteFn = useCallback(() => fetchVotes(slug!), [slug])
  const statsFn = useCallback(() => fetchStats(slug!), [slug])

  const { data: votes } = usePolling(voteFn, 5000, [slug])
  const { data: stats } = usePolling(statsFn, 5000, [slug])

  const talk = TALK_META[slug ?? ''] ?? { title: slug ?? '', speaker: '' }
  const talkUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/talk/${slug}`
    : `http://localhost:3000/talk/${slug}`

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 py-3 px-8 flex items-center gap-6">
        <Logo size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{talk.title}</h1>
          <p className="text-sm text-gray-500">{talk.speaker}</p>
        </div>
        <button
          onClick={() => navigate('/live')}
          className="text-xs text-gray-600 hover:text-gray-400 underline shrink-0"
        >
          todas as talks
        </button>
      </header>

      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feed de votos */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Votos recentes
          </h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {votes?.slice(0, 10).map((v, i) => (
              <VoteCard key={v.id} vote={v} animate={i === 0} />
            ))}
            {(!votes || votes.length === 0) && (
              <p className="text-sm text-gray-600">Aguardando votos...</p>
            )}
          </div>
        </div>

        {/* Stats grandes */}
        <div className="space-y-6">
          {stats && (
            <>
              {/* Nota média gigante */}
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Nota média</p>
                <span className="text-9xl font-black text-violet-300">
                  {formatRating(stats.average_rating)}
                </span>
                <div className="flex justify-center mt-2">
                  <Stars value={Math.round(stats.average_rating)} size="lg" />
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  {stats.total} {stats.total === 1 ? 'voto' : 'votos'}
                </p>
              </div>

              {/* Distribuição */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Distribuição
                </h3>
                <DistributionBar distribution={stats.distribution} total={stats.total} />
              </div>
            </>
          )}

          {/* QR Code */}
          <div className="text-center pt-2 border-t border-gray-800">
            <p className="text-xs text-gray-600 mb-2">Vote aí</p>
            <div className="inline-block bg-white p-3 rounded-lg">
              <QRCodeSVG value={talkUrl} size={128} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
