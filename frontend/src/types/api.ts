export interface Talk {
  slug: string
  title: string
  speaker: string
  description: string
}

export interface TalkStats {
  talk_slug: string
  average_rating: number
  total_votes: number
}

export interface TalkComment {
  rating: number
  comment: string
  created_at: string
}

export interface CreateVoteInput {
  rating: number
  comment?: string
}
