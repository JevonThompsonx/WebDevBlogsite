CREATE INDEX IF NOT EXISTS posts_published_created_at_idx
  ON posts (published, created_at DESC);

CREATE INDEX IF NOT EXISTS posts_updated_at_idx
  ON posts (updated_at DESC);
