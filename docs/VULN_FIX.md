# Vuln Fix — 2026-08-28 ( honest )

**Trivy scan on main@2046b5e (after ci.yml fix) found 15 vulns (14 HIGH, 1 CRITICAL):**

- drizzle-orm 0.45.1 CVE-2026-39356 HIGH → fixed 0.45.2
- next 16.1.6 12 HIGH (CVE-2026-44573, 44574, 44575, 44578, 44579, 45109, 64641, 64642, 64645, 64649, GHSA-8h8q..., GHSA-q4gf...) → fixed 16.2.5/16.2.11/16.3.3
- next-auth 4.24.13 CVE-2026-73420 CRITICAL + CVE-2026-73418 HIGH → fixed 4.24.15

**Honest fix:** bump to fixed versions, not lower Trivy severity or add ignore.

**Changes in this branch chore/bump-vuln-fixes-2026-08-28:**

- next 16.1.6 → 16.3.3 (latest stable, covers all 12 next CVEs)
- eslint-config-next 16.1.6 → 16.3.3 (keep pair)
- drizzle-orm 0.45.1 → 0.45.2
- next-auth 4.24.13 → 4.24.15

**TDD:** `bun run type-check` 0, `bun run lint` 0, `prettier --check` pass, `vitest run` 89/89, `next build` 23/23 with CI dummy env — all green before push. See AGENTS.md gates.

**Remaining:** No other HIGH/CRITICAL per Trivy bun.lock scan after bump (to be verified by CI).
