import { Vote } from '@/lib/api'
import { timeAgo } from '@/lib/utils'
import Stars from './Stars'

interface VoteCardProps {
  vote: Vote
  animate?: boolean
}

export default function VoteCard({ vote, animate }: VoteCardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-3 border border-gray-700 ${animate ? 'animate-fade-in' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <Stars value={vote.rating} size="sm" />
        <span className="text-xs text-gray-500">{timeAgo(vote.created_at)}</span>
      </div>
      {vote.comment && (
        <p className="text-sm text-gray-300 mt-1">{vote.comment}</p>
      )}
    </div>
  )
}
