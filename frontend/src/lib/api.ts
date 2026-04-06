export interface Talk {
  slug: string
  title: string
  speaker: string
  description: string
}

export interface Vote {
  id: string
  talk_slug: string
  rating: number
  comment: string
  created_at: string
}

export interface VoteStats {
  talk_slug: string
  talk_title: string
  total: number
  average_rating: number
  distribution: Record<string, number>
}

const BASE = '/api/v1'

export async function fetchTalks(): Promise<Talk[]> {
  const res = await fetch(`${BASE}/talks`)
  if (!res.ok) throw new Error('Erro ao buscar talks')
  return res.json()
}

export async function fetchVotes(slug: string): Promise<Vote[]> {
  const res = await fetch(`${BASE}/votes?talk=${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error('Erro ao buscar votos')
  return res.json()
}

export async function fetchStats(slug: string): Promise<VoteStats> {
  const res = await fetch(`${BASE}/votes/stats?talk=${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error('Erro ao buscar stats')
  return res.json()
}

export async function fetchAllStats(): Promise<VoteStats[]> {
  const res = await fetch(`${BASE}/votes/stats/all`)
  if (!res.ok) throw new Error('Erro ao buscar stats')
  return res.json()
}

export async function submitVote(talkSlug: string, rating: number, comment: string): Promise<void> {
  const res = await fetch(`${BASE}/votes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ talk_slug: talkSlug, rating, comment }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? 'Erro ao enviar voto')
  }
}
