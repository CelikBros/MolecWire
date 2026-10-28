# MolecWire local design prototype

This prototype connects the selected calm-feed visual direction to article detail and editorial review. All stories, sources, people and publication states are fictional. It is a local interface review, not the production Go/PostgreSQL application.

## Open

From the repository root, with Node.js installed:

```powershell
node work/molecwire-prototype/server.cjs --port 4318
```

Open <http://127.0.0.1:4318/> on this computer. The server binds only to `127.0.0.1`, serves only `dist/`, and stops after 30 minutes without requests. Press Ctrl+C in the launching terminal to stop it sooner. To restart it later, run the same command. The static `dist/index.html` also supports direct file opening; bookmark persistence may be unavailable under browser file-origin restrictions.

No package installation or external services are required. Locally verified Node version: 24.18.0.

## Review flow

1. Search/filter the feed, load additional stories explicitly and save bookmarks.
2. Open a story and inspect source context, unknowns and revision history.
3. Open the editor for the capacity-plan example. It begins at public v2 and draft v3.
4. Review the complete draft package, approve it, then publish as a separate action. Approval alone does not alter the public story.
5. Change content, claim wording, evidence association/source version or assessment. Saving creates another draft revision and requires fresh approval; previously published content and historical approvals remain separate.

Editorial state lives in memory and resets on refresh. Only bookmark IDs use namespaced browser storage, with a fallback when storage is unavailable. Use the reset control for another deterministic review. No live account, email, AI call or external publication is involved.

## Verification

Run from the repository root:

```powershell
node --test work/molecwire-prototype/tests/model.test.cjs work/molecwire-prototype/tests/server.test.cjs
```

The checks cover revision approval/invalidation, source and historical snapshot separation, published-state isolation, duplicate publication, and the local server's directory boundary/loopback configuration. They do not establish production authorization, database transactions, concurrent worker behavior or browser rendering quality.
