# MVP roadmap and implementation backlog

Date: 2026-10-27. Status: proposed; implementation starts only after architecture review. See [architecture](architecture.md), [evidence comparison](technology-comparison.md) and [charter](../PROJECT.md).

## Delivery gates

1. **Architecture review:** accept domain boundaries, stack candidates, publication invariants and explicit unknowns. Local reference access is verified; deployed environments and their test results are not verified.
2. **Foundation:** issues 1–3 establish delivery checks, identity and permission policies. Review the Go-rendered public-page recommendation, API contracts and exact dependency versions here.
3. **Editorial pipeline:** validate the manual path through issues 4 → 6 → 8 → 9, including a basic correction, without waiting for email or AI. Issues 5 and 7 add email and assisted drafting through the same services; both remain mandatory MVP exit gates.
4. **Public launch:** issues 9–10 deliver the public site and correction/operational gates. No unattended publishing, subscriptions, native apps, generalized crawler or recommendation engine in this scope.

Issue ordering describes dependencies, not promised dates. Estimate work after review and provider/source choices. Each issue must include focused tests for its invariants; configured tests must actually pass before its acceptance is claimed.

## First ten implementation issues

### 1. Establish Go foundation, schema history and CI

Dependencies: architecture review.

- API and worker commands build from shared domain packages; config validation fails clearly without exposing secrets.
- Select/pin router, PostgreSQL/pgx, query and migration tooling; record the choice against comparison evidence. Review Go `html/template` public rendering plus a React/Vite newsroom and choose API contract strategy before frontend scaffolding.
- A disposable PostgreSQL instance can migrate from empty and exercise the chosen rollback/forward recovery policy; migrations have one authoritative history.
- Liveness/readiness differ correctly; readiness fails when essential database access fails.
- CI runs formatting, vet/lint, unit/race tests, builds and dependency checks; configuration includes no committed secrets.

### 2. Implement identity, sessions and newsroom roles

Dependencies: 1; identity-provider and approval-role decisions.

- Editor/admin/publisher permissions are enforced server-side, including negative tests for approval, publishing, role changes and withdrawal.
- Session expiry, revocation and rotation work; cookie flags and CSRF protections cover cookie-authenticated writes; login attempts are rate limited.
- Password auth, if selected, uses an established password hashing pattern; external identity validates issuer/audience/state as appropriate.
- Privileged actions produce redacted audit records; independent-approver policy is explicit rather than assumed.

### 3. Create source registry and permission policy controls

Dependencies: 1, 2; owner-approved pilot sources.

- Registry records provenance, permission basis, retrieval methods, usage restrictions, rate/retention limits and review/expiry dates.
- Disabled, unapproved or expired policies cannot fetch or feed new generation; policy changes are audited.
- Test fixtures show that merely having an RSS URL does not bypass permission checks.
- Source owner selects a small permitted pilot set; permission evidence is reviewable without storing credentials in editorial records.

### 4. Deliver durable jobs and RSS/API/manual ingestion

Dependencies: 1, 3.

- Restart, crash and lease expiry tests recover work; retries have limits/backoff and dead-letter inspection/replay.
- A stale worker cannot acknowledge/fail a reclaimed job: updates require the current attempt's ownership token. Failed scheduled enqueue is recoverable; missed-poll catch-up policy is explicit.
- Replaying a feed/API/manual operation creates no duplicate logical source item; updates create new immutable versions.
- Downstream work and ingestion records commit together; handlers tolerate at-least-once delivery.
- Fetcher tests reject private/internal destinations and unsafe redirects; size/time/source limits and retention are enforced.
- Manual entries record attribution and evidence through the same processing pipeline.

### 5. Connect dedicated inbound email safely

Dependencies: 2, 4; approved email provider/address and submission audience.

- Authenticated webhook or mailbox adapter creates source items; duplicate delivery/replay does not create duplicate submissions.
- MIME depth, attachment size/type, spam filtering, quarantine and malware outcomes are tested; unscanned/unsafe attachments cannot reach extraction.
- Sender authentication results are stored independently from claim credibility; recipient/contact data remain private.
- Accepted email enters the common evidence/editorial queue; provider outages and rejection reasons are inspectable without logging message bodies.

### 6. Build story clusters, claims and evidence workspace

Dependencies: 4. Email from issue 5 later enters this same workspace and is an MVP exit requirement.

- Detect exact duplicates; editors can auditably merge/split event clusters without deleting provenance.
- Every material draft claim has evidence or an explicit unsupported state; supporting and contradicting links include version and locator.
- Syndicated copies are not counted as independent corroboration; stale/updated evidence is visible.
- Credibility, corroboration, completeness and readiness have separate explainable assessments.

### 7. Add Go AI adapter, draft assistance and evaluations

Dependencies: 6; provider/privacy/budget decisions.

- Go adapter validates structured outputs and resolves citations only to supplied evidence; failed validation leaves a manual workflow available.
- Quotes/numbers are checked against evidence; unsupported outputs cannot silently become publishable claims.
- Injection fixtures cannot cause arbitrary network/tool calls, role changes or publication; tests include hostile source text and email attachments.
- Enforce request/token/cost budgets and timeouts; record model/template/evidence IDs and redacted cost/latency metadata.
- Owner-approved evaluation thresholds cover unsupported claims, conflicting evidence and multilingual examples before launch.

### 8. Implement editorial review and atomic publication

Dependencies: 2, 6. AI assistance from issue 7 integrates later and remains an MVP exit requirement.

- Approve/reject/revise actions bind immutable revision, locale, actor and rationale; replacement edits require new approval.
- Approval freezes content, claim wording, evidence associations and assessment versions. Changing the latest claim/evidence record cannot alter the historical approved package; tests exercise that change.
- Authorization and readiness are checked at publication time; concurrent edit/publish tests cannot publish a stale or different revision.
- Publication pointer and outbox events commit atomically; redelivery cannot duplicate visible publication effects.
- Implement the basic correction service: create an approved replacement revision, preserve the affected revision and correction reason/notice record, and publish the replacement transactionally. Issue 9 renders the notice; issue 10 validates distribution updates, withdrawal and operations.
- Manual drafts obey the same approval policy. Validate manual entry → evidence → approval → publication record → approved correction through application services without a model provider or email adapter; issue 9 adds the public-page check. All MVP publishing is human-approved.

### 9. Deliver public news, search, taxonomy and locale model

Dependencies: 8; launch language/region and review of the proposed Go public rendering.

- Responsive public pages show categories, attribution, publication/update times and explicit locale with stable URLs.
- Complete the early manual-entry → evidence → human approval → public page → approved correction acceptance flow, rendering the correction notice produced by issue 8, without email or AI; issues 5 and 7 still gate full MVP launch.
- Search, feeds, caches and direct revision routes cannot reveal drafts, quarantined material or unpublished translations.
- Each translation links the exact original revision and requires its own review; source changes flag translation staleness.
- Validate crawlable article content, canonical/locale metadata, keyboard navigation and mobile layouts with representative articles.
- Short summaries and clearly identified AI assistance may follow the Kantan product reference; evidence links and editorial status remain central. Comments, audio and video are outside MVP unless separately approved.

### 10. Complete corrections, operations and launch checks

Dependencies: 5–9; response/retention/recovery targets.

- Corrections create approved replacements and public notices; authorized retractions suppress distribution and preserve an appropriate notice/audit trail.
- Outbox retry tests update public search/feed/cache consumers after correction or withdrawal. A publish → retract → delayed original-publish event sequence cannot restore withdrawn content; consumers enforce monotonic publication-state versions or rebuild from current state.
- Dashboards/alerts expose ingestion lag, queue failures, evidence coverage, publication errors, AI costs and correction response times.
- Backup restore drill demonstrates agreed RPO/RTO; retention expiry, evidence-unavailable markers and takedown handling are tested.
- Editorial owner accepts pilot evidence quality; authorization, injection, privacy and source-permission checks pass before launch. Record actual results, not just configured checks.

## Decisions still required

| Decision | Needed by | Default planning assumption |
|---|---|---|
| Launch market, regions and languages | 3 / 9 | Multilingual-ready schema; no language set selected |
| Pilot source list, licensing budget and permitted uses | 3 | No unapproved retrieval or blanket crawling |
| Submission audience and email provider/address | 5 | Dedicated ingress with quarantine, no open trust of sender |
| Identity provider, roles, independent reviewer rule | 2 | Server-side RBAC; all publications human-approved |
| Preferred reference baseline/router/query tooling | 1 | Go/PostgreSQL fixed direction; Kapsora's concrete stack is leading candidate |
| Public rendering and API contract | 1 / 9 | Recommend Go `html/template` public pages and reference-aligned React/Vite newsroom; approve contract strategy in foundation |
| Hosting, storage, secrets and CI deployment mechanism | 1 / 10 | Small API/worker deployment; no infrastructure provider chosen |
| Evidence/email/audit retention, deletion and takedown owner | 3 / 5 / 10 | Minimize stored raw/private material and preserve permissible attribution |
| AI provider, data-processing terms, budgets and evaluation thresholds | 7 | Go API calls; no model publication permission |
| Correction response targets and restore objectives | 10 | Must be agreed and exercised before launch |
| Commercial model and sponsored-content policy | Before launch | No subscription/paywall implementation; clear sponsorship labels |

The reassessed Kantan review includes public page/API responses and publisher declarations of editorial oversight and AI processing boundaries. Its backend source and actual control enforcement remain unverified, and visual rendering remains unavailable. It does not replace the source-grounded reference comparison or expand this change into implementation.
