ALTER TABLE talks ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

UPDATE talks SET display_order = 1 WHERE slug = 'sdd-sopa';
UPDATE talks SET display_order = 2 WHERE slug = 'escalando-nodejs';
