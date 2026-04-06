import { useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import Stars from '@/components/Stars'
import DistributionBar from '@/components/DistributionBar'
import { fetchAllStats } from '@/lib/api'
import { usePolling } from '@/hooks/usePolling'
import { formatRating } from '@/lib/utils'

const EVENT_DATE = 'Abril 2026'

export default function Home() {
  const navigate = useNavigate()
  const { data: allStats } = usePolling(fetchAllStats, 5000)

  const maxAvg = Math.max(...(allStats?.map((s) => s.average_rating) ?? [1]), 1)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 py-5 px-4 text-center">
        <Logo size="lg" />
        <p className="text-gray-400 mt-1 text-sm font-medium tracking-wide">
          Codecon Meetup Salvador · {EVENT_DATE}
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-8">
        <h2 className="text-lg font-semibold text-gray-300">Palestras da noite</h2>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {allStats?.map((stats) => (
            <div
              key={stats.talk_slug}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:border-violet-700 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-white text-base leading-snug">{stats.talk_title}</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {/* speaker não vem no stats, buscar das talks hardcoded */}
                  {stats.talk_slug === 'sdd-sopa' ? 'Antonio Pedro Ferreira' : '(a definir)'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Stars value={Math.round(stats.average_rating)} size="sm" />
                <span className="text-2xl font-bold text-violet-300">
                  {formatRating(stats.average_rating)}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {stats.total} {stats.total === 1 ? 'voto' : 'votos'}
                </span>
              </div>

              <DistributionBar distribution={stats.distribution} total={stats.total} />

              <button
                onClick={() => navigate(`/talk/${stats.talk_slug}`)}
                className="mt-auto w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                Votar nessa palestra
              </button>
            </div>
          ))}

          {!allStats && (
            <>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-64 animate-pulse" />
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-64 animate-pulse" />
            </>
          )}
        </div>

        {/* Ranking comparativo */}
        {allStats && allStats.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Ranking ao vivo
            </h3>
            <div className="space-y-3">
              {[...allStats]
                .sort((a, b) => b.average_rating - a.average_rating)
                .map((s) => (
                  <div key={s.talk_slug}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 truncate max-w-[70%]">{s.talk_title}</span>
                      <span className="text-violet-300 font-bold">{formatRating(s.average_rating)}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                        style={{ width: `${maxAvg > 0 ? (s.average_rating / maxAvg) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Link modo apresentação */}
        <div className="text-center">
          <button
            onClick={() => navigate('/live')}
            className="text-sm text-gray-500 hover:text-violet-400 transition-colors underline underline-offset-4"
          >
            Modo apresentação (telão)
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        Vote aí — construído ao vivo com SDD por Antonio Pedro
      </footer>
    </div>
  )
}
