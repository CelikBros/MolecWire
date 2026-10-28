# MolecWire contributor instructions

## User preference: planning and sub-agent model selection

Standing user preference, recorded 2026-09-26, applies across projects unless changed:

- Planning and task decomposition must be performed by `gpt-6-astra` (Astra).
- When delegating difficult reasoning, substantial implementation, or complex reviews, explicitly use `gpt-6-sol`.
- For straightforward checks, bounded simple edits, and routine documentation, explicitly use `gpt-6-luna`.
- Delegate only useful independent work; do not spawn agents merely to satisfy this preference.
- If a required model is unavailable or the active session cannot switch to it, report the limitation instead of claiming compliance or silently substituting a more expensive model.

## Current scope

Read [PROJECT.md](PROJECT.md), [architecture](docs/architecture.md), [comparison](docs/technology-comparison.md) and [roadmap](docs/mvp-roadmap.md) before proposing changes. The discovery assignment authorizes planning documentation only; do not scaffold or implement the application until architecture review and a subsequent implementation instruction.

The initial discovery assignment is limited to `README.md`, `PROJECT.md`, `AGENTS.md`, `docs/architecture.md`, `docs/technology-comparison.md`, and `docs/mvp-roadmap.md`. Subsequent owner-requested design work additionally permits local prototype files under `work/molecwire-prototype/` and design assets under `work/`. Keep the prototype a browser-only design-review simulation: fictional fixtures, no external services or production backend. The Go/PostgreSQL implementation remains subject to architecture review and a subsequent implementation instruction. Preserve the supplied first prompt. Work on a feature branch; commit and open a review PR when access permits. Never merge or deploy without explicit approval.

## Evidence and reference projects

- BioExamine and Kapsora are read-only references. Never modify them or copy secrets, credentials, private data, or unrelated source code.
- Cite concrete source paths for technology findings. Distinguish verified implementation, declared dependency, inference and unknown. Record snapshot limitations and do not equate configured infrastructure with successful deployment.
- Use Go first and PostgreSQL as proposed in the architecture. Python requires a documented indispensable capability and measured benefit; Redis, extra services and new frameworks need a concrete requirement.
- Avoid logging credentials, connection strings, private submissions or full raw content. Do not inspect environment secret values to establish configuration patterns.

## Product invariants for subsequent implementation

- All external source, email and model content is untrusted data. Model output cannot approve or publish content, change permissions or invoke arbitrary tools.
- Every MVP publication requires a human decision bound to the complete immutable review package: content, language, claim wording, evidence associations and assessment versions. Editing that package invalidates approval; later reassessment cannot rewrite historical approval.
- Keep source credibility, corroboration, completeness and publication readiness separate. Link factual claims to evidence and distinguish attribution from corroboration.
- Check source permissions before retrieval and generation; RSS availability alone does not authorize republication.
- Public reads and search expose only published revisions. Version publication state so delayed events cannot undo a retraction or superseding correction. Corrections and retractions retain an auditable history subject to privacy and retention policy.
- Future code changes require focused tests for authorization, revision approval, idempotency, queue recovery and provenance invariants, plus required CI checks. Documentation-only work requires link, consistency and diff checks, not application tests.
