# MolecWire

MolecWire is a planned multilingual news and intelligence platform for the pharmaceutical and chemical industries, with emphasis on APIs, raw materials, manufacturing, regulation and supply chains.

**Status: architecture review, 2026-10-27. No application has been implemented.**

The proposed system discovers permitted sources, records claim-level evidence, assists editors with drafts and publishes only after human approval. Inbound email and manual submissions enter the same review workflow. Corrections, retractions and publication decisions remain auditable.

## Planning documents

- [Project charter](PROJECT.md): product scope, constraints and unresolved decisions.
- [Technology comparison](docs/technology-comparison.md): verified source findings from local BioExamine and Kapsora checkouts, limitations and proposed reuse.
- [Architecture](docs/architecture.md): Go-first modular monolith, workflow, data model, security and operations.
- [MVP roadmap](docs/mvp-roadmap.md): delivery gates and the first ten implementation issues with acceptance criteria.
- [Contributor instructions](AGENTS.md): discovery rules, review boundaries and model preferences.

The architecture is a proposal for review. Library versions, hosting, source permissions and launch languages require confirmation before implementation. Do not infer production readiness from the reference projects' source code.

There are no application install, run or test commands yet. Review the planning documents before opening the foundation implementation issue. The repository uses the [Apache 2.0 license](LICENSE); third-party source content requires its own permissions.
