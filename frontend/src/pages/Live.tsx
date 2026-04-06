import { useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import Stars from '@/components/Stars'
import VoteCard from '@/components/VoteCard'
import DistributionBar from '@/components/DistributionBar'
import { fetchAllStats, fetchVotes, type Vote } from '@/lib/api'
import { usePolling } from '@/hooks/usePolling'
import { formatRating } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

const HOME_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

export default function Live() {
  const navigate = useNavigate()
  const { data: allStats } = usePolling(fetchAllStats, 5000)

  // Feed unificado
  const [feed, setFeed] = useState<Vote[]>([])

  useEffect(() => {
    let cancelled = false
    const loadFeed = async () => {
      try {
        const slugs = ['sdd-sopa', 'a-definir']
        const results = await Promise.all(slugs.map(s => fetchVotes(s)))
        const merged = results
          .flat()
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 10)
        if (!cancelled) setFeed(merged)
      } catch {
        // silencioso
      }
    }
    loadFeed()
    const t = setInterval(loadFeed, 5000)
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-8 flex items-center justify-between">
        <Logo size="lg" />
        <p className="text-gray-500 text-sm">Codecon Meetup Salvador · Ao vivo</p>
        <button
          onClick={() => navigate('/')}
          className="text-xs text-gray-600 hover:text-gray-400 underline"
        >
          sair
        </button>
      </header>

      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cards das talks */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Stats ao vivo
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {allStats?.map((stats) => (
              <div
                key={stats.talk_slug}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3 cursor-pointer hover:border-violet-700 transition-colors"
                onClick={() => navigate(`/talk/${stats.talk_slug}/live`)}
              >
                <p className="text-sm text-gray-400 leading-snug">{stats.talk_title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-violet-300">
                    {formatRating(stats.average_rating)}
                  </span>
                  <span className="text-gray-500 text-sm">{stats.total} votos</span>
                </div>
                <Stars value={Math.round(stats.average_rating)} size="md" />
                <DistributionBar distribution={stats.distribution} total={stats.total} />
              </div>
            ))}

            {!allStats && (
              <>
                <div className="bg-gray-900 rounded-xl p-5 h-48 animate-pulse" />
                <div className="bg-gray-900 rounded-xl p-5 h-48 animate-pulse" />
              </>
            )}
          </div>
        </div>

        {/* Feed + QR */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Feed de votos
          </h2>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {feed.map((v, i) => (
              <VoteCard key={v.id} vote={v} animate={i === 0} />
            ))}
            {feed.length === 0 && (
              <p className="text-sm text-gray-600">Aguardando votos...</p>
            )}
          </div>

          {/* QR Code */}
          <div className="mt-auto pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600 mb-2">Escaneie para votar</p>
            <div className="inline-block bg-white p-2 rounded-lg">
              <QRCodeSVG value={HOME_URL} size={96} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
