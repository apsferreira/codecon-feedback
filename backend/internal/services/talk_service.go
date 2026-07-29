package services

import (
	"context"

	"codecon-feedback/backend/internal/models"
	"codecon-feedback/backend/internal/repositories"
)

type TalkService struct {
	talks *repositories.TalkRepository
}

func NewTalkService(talks *repositories.TalkRepository) *TalkService {
	return &TalkService{talks: talks}
}

func (s *TalkService) List(ctx context.Context) ([]models.Talk, error) {
	return s.talks.List(ctx)
}
