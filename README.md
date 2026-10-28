# MolecWire

MolecWire is a planned multilingual news and intelligence platform for the pharmaceutical and chemical industries, with emphasis on APIs, raw materials, manufacturing, regulation and supply chains.

**Status: architecture review and local design prototype, 2026-10-28.**

The proposed system discovers permitted sources, records claim-level evidence, assists editors with drafts and publishes only after human approval. Inbound email and manual submissions enter the same review workflow. Corrections, retractions and publication decisions remain auditable.

## Planning documents

- [Project charter](PROJECT.md): product scope, constraints and unresolved decisions.
- [Technology comparison](docs/technology-comparison.md): verified source findings from local BioExamine and Kapsora checkouts, limitations and proposed reuse.
- [Architecture](docs/architecture.md): Go-first modular monolith, workflow, data model, security and operations.
- [MVP roadmap](docs/mvp-roadmap.md): delivery gates and the first ten implementation issues with acceptance criteria.
- [Contributor instructions](AGENTS.md): discovery rules, review boundaries and model preferences.

The [Kantan external visitor review](docs/technology-comparison.md#visitor-assessment-and-closure--2026-10-28) was completed on 2026-10-28. It records applicable presentation patterns and the importance of clear evidence-stage labels for industry news; it is not a backend or interactive UI audit.

The architecture is a proposal for review. Library versions, hosting, source permissions and launch languages require confirmation before implementation. Do not infer production readiness from the reference projects' source code.

## Local design prototype

The [prototype](work/molecwire-prototype/README.md) connects the calm feed, article detail and editorial review screens using fictional browser-local data. Start it with `node work/molecwire-prototype/server.cjs --port 4318`, then open `http://127.0.0.1:4318/`. It simulates revision approval/publication for design review; it does not implement production authentication, persistence or the Go/PostgreSQL application.

Review the planning documents before opening the foundation implementation issue. The repository uses the [Apache 2.0 license](LICENSE); third-party source content requires its own permissions.
