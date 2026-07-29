package services

import (
	"context"

	"codecon-feedback/backend/internal/models"
	"codecon-feedback/backend/internal/repositories"
)

// ErrTalkNotFound é reexportado do repositório para uso pelos handlers,
// mantendo a camada de handlers desacoplada de detalhes de persistência.
var ErrTalkNotFound = repositories.ErrTalkNotFound

type VoteService struct {
	talks *repositories.TalkRepository
	votes *repositories.VoteRepository
}

func NewVoteService(talks *repositories.TalkRepository, votes *repositories.VoteRepository) *VoteService {
	return &VoteService{talks: talks, votes: votes}
}

// RegisterVote registra um voto anônimo para a talk, validando previamente
// que a talk existe.
func (s *VoteService) RegisterVote(ctx context.Context, talkSlug string, rating int, comment *string) error {
	exists, err := s.talks.Exists(ctx, talkSlug)
	if err != nil {
		return err
	}
	if !exists {
		return ErrTalkNotFound
	}

	return s.votes.Create(ctx, talkSlug, rating, comment)
}

// Stats retorna as estatísticas agregadas de uma talk, validando previamente
// que a talk existe.
func (s *VoteService) Stats(ctx context.Context, talkSlug string) (models.TalkStats, error) {
	exists, err := s.talks.Exists(ctx, talkSlug)
	if err != nil {
		return models.TalkStats{}, err
	}
	if !exists {
		return models.TalkStats{}, ErrTalkNotFound
	}

	return s.votes.Stats(ctx, talkSlug)
}

// Comments retorna o feed de comentários de uma talk, validando previamente
// que a talk existe.
func (s *VoteService) Comments(ctx context.Context, talkSlug string) ([]models.CommentEntry, error) {
	exists, err := s.talks.Exists(ctx, talkSlug)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, ErrTalkNotFound
	}

	return s.votes.Comments(ctx, talkSlug)
}
