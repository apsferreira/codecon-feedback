CREATE TABLE IF NOT EXISTS talks (
    slug VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    speaker VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    talk_slug VARCHAR(100) NOT NULL REFERENCES talks(slug),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_votes_talk_slug_created_at ON votes (talk_slug, created_at DESC);

INSERT INTO talks (slug, title, speaker, description) VALUES
    ('sdd-sopa', 'SDD: para alem da sopa de letrinhas', 'Antonio Pedro Ferreira', 'Spec Driven Development na pratica'),
    ('escalando-nodejs', 'Escalando Node.js: Do Event Loop a Alta Concorrencia', 'Gabriel Santana', 'Engenheiro de Software na Revoluti')
ON CONFLICT (slug) DO NOTHING;
