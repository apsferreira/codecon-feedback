import { useQuery } from '@tanstack/react-query'
import { fetchTalkComments, fetchTalkStats } from '@/api/talks'

const POLL_INTERVAL_MS = 4000

export function useTalkStats(slug: string) {
  return useQuery({
    queryKey: ['talk-stats', slug],
    queryFn: () => fetchTalkStats(slug),
    refetchInterval: POLL_INTERVAL_MS,
  })
}

export function useTalkComments(slug: string) {
  return useQuery({
    queryKey: ['talk-comments', slug],
    queryFn: () => fetchTalkComments(slug),
    refetchInterval: POLL_INTERVAL_MS,
  })
}
