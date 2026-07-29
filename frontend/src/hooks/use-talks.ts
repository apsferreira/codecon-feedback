import { useQuery } from '@tanstack/react-query'
import { fetchTalks } from '@/api/talks'
import type { Talk } from '@/types/api'

export function useTalks() {
  return useQuery({
    queryKey: ['talks'],
    queryFn: fetchTalks,
  })
}

export function useTalk(slug: string | undefined) {
  const talksQuery = useTalks()
  const talk: Talk | undefined = talksQuery.data?.find((t) => t.slug === slug)

  return { ...talksQuery, data: talk }
}
