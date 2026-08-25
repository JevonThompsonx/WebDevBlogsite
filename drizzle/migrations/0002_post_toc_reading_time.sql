-- Precompute table-of-contents and reading time at write-time (perf).
-- Adding as NOT NULL with safe defaults so existing rows are backfilled
-- without a separate migration step.
ALTER TABLE posts
  ADD COLUMN toc TEXT NOT NULL DEFAULT '[]';

ALTER TABLE posts
  ADD COLUMN reading_time INTEGER NOT NULL DEFAULT 1;
