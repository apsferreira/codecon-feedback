-- Migration 001: criação da tabela votes
-- UP
CREATE TABLE IF NOT EXISTS votes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talk_slug  VARCHAR(100) NOT NULL,
    rating     INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment    TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_votes_talk ON votes (talk_slug);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes (created_at DESC);

-- DOWN
-- DROP INDEX IF EXISTS idx_votes_created_at;
-- DROP INDEX IF EXISTS idx_votes_talk;
-- DROP TABLE IF EXISTS votes;
