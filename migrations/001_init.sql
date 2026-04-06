CREATE TABLE IF NOT EXISTS talks (
    slug VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    speaker VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    talk_slug VARCHAR(100) NOT NULL REFERENCES talks(slug),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_talk_slug ON feedbacks(talk_slug);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);

-- Seed: palestras do evento
INSERT INTO talks (slug, title, speaker, description) VALUES
    ('sdd-sopa', 'SDD: para alem da sopa de letrinhas', 'Antonio Pedro Ferreira', 'Spec Driven Development na pratica com show me the code ao vivo'),
    ('a-definir', 'Palestra 2 (a definir)', 'A definir', 'Detalhes em breve')
ON CONFLICT (slug) DO NOTHING;
