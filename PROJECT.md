# MolecWire — Project Charter & Initial Technical Brief

**Status:** Discovery / architecture definition
**Repository:** `CelikBros/MolecWire`
**Product:** MolecWire
**Document version:** 0.2 — 2026-10-27
**Primary language of this document:** English

> **Discovery update:** Local BioExamine and Kapsora source trees were inspected on 2026-10-27. Both use Go and PostgreSQL/pgx. Findings, concrete paths and limitations are in [technology-comparison.md](docs/technology-comparison.md). Kapsora has a heavily modified worktree; observations are not a clean-release or production audit. [Architecture](docs/architecture.md) and the [first ten implementation issues](docs/mvp-roadmap.md) are proposals for review. No application is implemented.

## 1. Vision

MolecWire is a trustworthy, multilingual intelligence and news platform for the global pharmaceutical and chemical industries, with particular emphasis on active pharmaceutical ingredients (APIs), pharmaceutical raw materials, intermediates, manufacturing, regulatory changes, supply chains, and market developments.

It will discover relevant developments from many sources, distinguish reported claims from independently verified facts, assemble source-linked editorial drafts, and publish through explicit, auditable editorial policies. Human editors must also be able to author, review, correct, retract, and publish content. News submitted to a dedicated email address must enter the same ingestion and verification pipeline.

The goal is **high-quality industry intelligence**, not indiscriminate content aggregation or automated rewriting of copyrighted articles.

## 2. Initial users

- API and pharmaceutical raw-material manufacturers and distributors
- Pharmaceutical procurement, supply-chain and regulatory teams
- Chemical-industry analysts and technical professionals
- Editors and administrators of MolecWire

## 3. Core coverage

- APIs, intermediates, excipients, and pharmaceutical raw materials
- Chemical manufacturing and industrial chemical supply chains
- Regulatory agencies, legislation, inspections, recalls and compliance news
- Production capacities, plant openings/closures, disruptions, trade restrictions
- Market developments, partnerships, mergers and acquisitions
- Quality, safety, pharmacopoeia and technical developments where newsworthy

Initial coverage and launch languages need product confirmation. Design for multilingual publication; do not assume a specific language set or paywall model.

## 4. Content acquisition

Support these ingestion channels:

1. **Source monitoring:** RSS/Atom feeds, official agency announcements, licensed news APIs, company press releases, selected public pages where permitted.
2. **Dedicated email inbox:** Messages and attachments from a configured address; safely parse and classify them. Sender identity alone is not evidence that statements are true.
3. **Manual newsroom:** Admin/editor creation, links, notes, uploads and updates.
4. **Future connectors:** Expand only after validating source terms, reliability and ongoing maintenance cost.

Every ingested item should capture provenance: original URL or message identifier, source name, author/publisher if available, retrieved/published timestamps, language, extracted factual claims, and processing history.

## 5. Processing workflow

**Discover → Ingest → Normalize → Deduplicate / Cluster → Classify → Assess Evidence → Draft → Editorial Decision → Publish → Monitor / Correct**

### Key requirements

- Deduplicate same-source updates and cluster multi-source reporting on the same event.
- Distinguish **source credibility**, **claim corroboration**, **article completeness** and **publication readiness**; avoid a single unexplainable “truth score.”
- Preserve original source references, timestamps, and claim-to-evidence links.
- Explicitly flag single-source reports, conflicting information, stale claims, speculation and unverifiable assertions.
- Separate facts, attributed claims, inference, and editorial context.
- Generate original summaries/synthesis rather than reproducing protected source text.
- Maintain idempotent ingestion, retry policies, backoff, and rate limiting.
- Require human approval for every MVP publication, including translations and substantive corrections; high-impact, low-confidence or disputed items require explicit attention to unresolved evidence.
- Allow editorial corrections, takedowns/retractions, version history, and source updates.
- Do not launch fully unattended publishing until an explicit risk policy, evaluations, and operational safeguards are approved.

## 6. Publication and editorial principles

- No invented quotes, data, organizations, regulatory decisions, or citations.
- No assertion that AI “proved” a news item true; present evidence and uncertainty honestly.
- Link readers to primary sources whenever feasible; clearly attribute secondary reporting.
- Clearly distinguish press releases, sponsored content, analysis and independent reporting.
- Comply with copyright, licensing, website terms, privacy, email-security rules and applicable laws.
- Require explicit roles and permissions for publishing, edits, retractions and rule changes.
- Every publication decision and AI processing step must be auditable.
- Approval binds the exact immutable revision and locale. Replacement edits require new approval; only an explicit published revision pointer may appear in public pages, search or feeds.

## 7. Preferred technical direction (provisional)

**Backend: Go-first modular monolith.** Source inspection confirms Go in both references. Use separate API and worker entrypoints sharing application/domain packages. Kapsora's chi/pgx/sqlc/golang-migrate conventions are the leading concrete stack candidate; BioExamine's standard ServeMux and handwritten SQL are a smaller alternative. Confirm the choice at architecture review, rather than copying unrelated modules.

**Database: PostgreSQL.** Keep the schema and indexing strategy reviewable. Reuse proven database patterns from existing projects where appropriate.

**Frontend:** React/TypeScript with Vite is the reference-aligned newsroom candidate. Public article rendering must support crawlable content, stable URLs and locale metadata; select its rendering strategy during foundation review. Next.js is not an approved requirement.

**Async jobs and scheduling:** PostgreSQL durable jobs with leases, bounded retries and idempotent handlers, plus a transactional publication outbox. Kapsora implements a relevant outbox/worker pattern; BioExamine's separate worker is currently idle. Delivery is at least once. Redis is not needed by the initial proposal.

**AI/LLM:** Prefer calling model APIs or compatible inference services directly from Go when possible. Introduce a small Python service only if a specific indispensable Python-only capability, with measured benefits, justifies its operational cost. Do not create a Python backend by default.

**Infrastructure:** Deployment, CI/CD, secrets management, logging, monitoring, object storage and authentication must follow the current team standards after inspection.

**Mobile:** Plan responsive web first and evaluate dedicated mobile applications after the initial newsroom/publication workflow is validated.

## 8. Suggested domain boundaries (not mandatory microservices)

- `sources`: source catalog, retrieval policies, access terms and trust metadata
- `ingestion`: RSS/API/web/email/manual inbound processing
- `stories`: normalization, deduplication, events and evidence records
- `editorial`: drafting, approvals, article revisions and publication states
- `ai`: model invocation, prompt versions, structured outputs, evaluation traces
- `publishing`: public API, feeds, taxonomy, SEO and multilingual distribution
- `identity`: users, roles, sessions and audit trail
- `operations`: task scheduling, job observability, alerts and cost controls

Favor a **modular monolith** initially unless the reference repositories or concrete scaling needs justify separate services.

## 9. Initial conceptual entities

`users`, `roles`, `sources`, `source_items`, `ingestion_jobs`, `story_clusters`, `claims`, `evidence_links`, `drafts`, `articles`, `article_revisions`, `editorial_decisions`, `categories`, `tags`, `translations`, `email_submissions`, `ai_runs`, `audit_events`.

These are conceptual, not an approved database schema. The final schema should be driven by actual workflows and the existing team's PostgreSQL practices.

## 10. MVP requirements

- Admin login and role-based access
- Configurable source registry and a small pilot set of permitted, reputable sources
- RSS/API source ingestion plus manual entry
- Dedicated inbound-email processing with spam/malware and sender-trust controls
- Deduplication and source-linked story workspace
- AI-assisted draft generation with provenance and uncertainty indicators
- Editorial queue, approval, reject, revise and publish
- Public responsive news pages, categories, search and attribution
- Basic multilingual-ready data model
- Audit logs, metrics, error alerts, rate limits and cost visibility
- Corrections and article revision history

Not in initial MVP unless separately approved: native mobile apps, automatic mass publication, paid subscriptions, trading/price forecasts, complex recommendation engines, or a generalized web-scale crawler.

## 11. Security, reliability and quality

- Validate and sanitize external HTML, email payloads, attachments and extracted content.
- Treat source content and incoming emails as **untrusted**; defend against prompt injection.
- Limit crawling to authorized/permitted sources, respect rate limits and contractual terms.
- Implement least-privilege access, secure secret handling, backups, migrations and recovery procedures.
- Keep raw/source material retention under a defined policy; avoid unnecessary personal data.
- Provide structured logs, distributed trace identifiers where needed, and searchable failure reports.
- Measure ingestion completeness, duplicate rate, claim/source traceability, human review effort, publish errors, AI cost, and correction frequency.

## 12. Work to do first in Codex (mandatory discovery gate)

Before selecting a framework or generating application code:

1. Locate **BioExamine** and **Kapsora** in the accessible GitHub account or local workspace; confirm repository names/paths and access.
2. Inspect actual files, not just README descriptions: `go.mod`, `package.json`, migrations, Dockerfiles, Compose configs, CI files, deployment configs and representative application directories, as available.
3. Produce a concise, cited-by-file **technology comparison**: languages, Go frameworks, API patterns, PostgreSQL drivers/ORM/query tooling, migration tooling, queues, caching, auth, frontend, logging, testing, deployment and code organization.
4. Mark each finding **verified**, **inferred**, or **unknown**. Do not fabricate undocumented conventions.
5. Recommend the MolecWire stack by prioritizing consistency with the existing proven codebase; explain deviations and tradeoffs.
6. If those repositories are inaccessible, document the blocker and continue with a provisional Go-first architecture, clearly marking all assumptions.
7. **Do not modify BioExamine or Kapsora.** Never copy secrets, environment values, personal data or proprietary business logic into MolecWire.

## 13. Milestones (proposed)

**Phase 0 — Discovery / architecture:** Analyze reference repositories; create technology decision record, threat model, domain model and MVP backlog.

**Phase 1 — Foundation:** Set up repository structure, Go service, database migrations, authentication, CI/CD and observability.

**Phase 2 — Editorial MVP:** Manual entry, pilot RSS/API sources, dedicated email ingestion, deduplication, source-linked drafts, review and public publication. Email is required before MVP exit.

**Phase 3 — Controlled operations:** Expand approved sources, strengthen evaluations and quality dashboards, and exercise correction/retraction, retention and recovery procedures. Human publication approval remains mandatory throughout MVP.

**Phase 4 — Expansion:** Multilingual workflows, personalization/distribution, mobile app feasibility and commercial features.

## 14. Open product decisions

- Which country/region and primary language at launch?
- Which sources and feeds are licensed/permitted and most important?
- Will external submissions be public, partner-only or staff-only?
- Which news categories require mandatory human sign-off?
- Which existing reference project (BioExamine or Kapsora) is the preferred architectural baseline?
- What infrastructure, hosting and identity providers are currently standardized?
- Is the platform free, subscription-based or a hybrid?

## 15. Immediate acceptance criteria

Architecture work is complete only when Codex can provide:

- A source-file-grounded comparison of BioExamine and Kapsora, **or** a precise access-blocker note
- A proposed Go-first technology stack with rationale and explicit unknowns
- An MVP functional scope and phased delivery plan
- A data-flow diagram or equivalent clear description
- Security, source provenance, copyright and editorial approval requirements
- A proposed repository structure and next implementation tasks

**Do not start broad implementation before reviewing the architecture.**

## 16. Public product reference

At the owner's request, [Kantan News](https://kantan.news/) was inspected as an additional product reference on 2026-10-27. The public metadata and search-indexed article examples show a relevant news-feed, AI-disclosure and source-link presentation pattern. Live visual rendering was unavailable; backend, permissions and editorial review enforcement were not verified. See the [bounded Kantan review](docs/technology-comparison.md#kantan-news-public-product-reference) for observations and limits. Its content accuracy is not assumed and its features do not automatically expand MVP scope.
