import { apiRequest } from '@/api/client'
import type { CreateVoteInput, Talk, TalkComment, TalkStats } from '@/types/api'

export function fetchTalks(): Promise<Talk[]> {
  return apiRequest<Talk[]>('/api/talks')
}

export function createVote(slug: string, input: CreateVoteInput): Promise<void> {
  return apiRequest<void>(`/api/talks/${encodeURIComponent(slug)}/votes`, {
    method: 'POST',
    body: input,
  })
}

export function fetchTalkStats(slug: string): Promise<TalkStats> {
  return apiRequest<TalkStats>(`/api/talks/${encodeURIComponent(slug)}/stats`)
}

export function fetchTalkComments(slug: string): Promise<TalkComment[]> {
  return apiRequest<TalkComment[]>(`/api/talks/${encodeURIComponent(slug)}/comments`)
}
