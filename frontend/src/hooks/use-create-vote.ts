import { useMutation } from '@tanstack/react-query'
import { createVote } from '@/api/talks'
import type { CreateVoteInput } from '@/types/api'

export function useCreateVote(slug: string) {
  return useMutation({
    mutationFn: (input: CreateVoteInput) => createVote(slug, input),
  })
}
