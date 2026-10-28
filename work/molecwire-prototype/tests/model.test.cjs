const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../dist/model.js');
const reviewed = state => M.setReviewed(state, true).state;
const approve = state => { const result = M.approveDraft(reviewed(state)); assert(result.ok, result.reason); return result.state; };
const save = (state, patch) => { const result = M.saveDraft(state, patch); assert(result.ok, result.reason); return result.state; };

test('review checkbox and approval never publish on their own', () => {
  const state = M.createDemo();
  assert.equal(M.getPublished(state, 'capacity').publishedVersion, 2);
  assert.equal(state.editor.draftVersion, 3);
  assert(M.listPublished(state).length >= 8);
  assert.equal(M.approveDraft(state).ok, false);
  const checked = reviewed(state);
  assert.equal(M.publishDraft(checked).ok, false);
  const approved = approve(state);
  assert.equal(M.getPublished(approved, 'capacity').publishedVersion, 2);
  assert.equal(approved.editor.approved.revision, 3);
  assert.equal(approved.editor.approved.package.sourceSnapshot.id, 'src-a-v1');
  assert(approved.editor.approved.package.sourceSnapshot.summary);
});

test('every material package edit invalidates approval without changing public content', () => {
  const patches = [
    {title:'Yeni taslak başlığı'}, {summary:'Yeni taslak özeti'}, {body:'Yeni taslak metni'},
    {claimWording:'Değişen iddia'}, {evidenceId:'src-a-v2'}, {evidenceRelation:'Yeni kanıt ilişkisi'},
    {credibility:'Yeni kaynak değerlendirmesi'}, {corroboration:'Yeni bağımsız destek notu'},
    {completeness:'Yeni eksik bilgisi'}, {readiness:'Yeni editör gerekçesi'}
  ];
  for (const patch of patches) {
    const approved = approve(M.createDemo());
    const beforePublic = JSON.stringify(M.getPublished(approved, 'capacity'));
    const beforeHistory = JSON.stringify(approved.editor.approvalHistory);
    const changed = save(approved, patch);
    assert.equal(changed.editor.draftVersion, 4);
    assert.equal(changed.editor.approved, null);
    assert.equal(changed.editor.reviewed, false);
    assert.equal(M.publishDraft(changed).ok, false);
    assert.equal(JSON.stringify(M.getPublished(changed, 'capacity')), beforePublic);
    assert.equal(JSON.stringify(changed.editor.approvalHistory), beforeHistory, 'Historical approval stays intact');
    assert(changed.editor.approvalHistory.length > 0);
  }
});

test('reverting a saved edit creates another revision and never restores approval', () => {
  const state = approve(M.createDemo());
  const originalTitle = state.editor.draft.title;
  const changed = save(state, { title:'Doğrudan görünmemeli' });
  const reverted = save(changed, { title:originalTitle });
  assert.equal(reverted.editor.draftVersion, 5);
  assert.equal(reverted.editor.approved, null);
  assert.equal(M.publishDraft(reverted).ok, false);
});

test('discarding an unsaved edit does not manufacture another revision', () => {
  const state = approve(M.createDemo());
  state.editor.dirty = true;
  state.editor.reviewed = false;
  const result = M.saveDraft(state, { title:state.editor.draft.title });
  assert(result.ok && result.noop);
  assert.equal(result.state.editor.draftVersion, 3);
  assert.equal(result.state.editor.dirty, false);
  assert.equal(result.state.editor.approved.revision, 3);
  assert.equal(result.state.editor.approvalHistory.length, 1);
});

test('published packages and historical approvals remain separate from later drafts', () => {
  let state = approve(M.createDemo());
  const first = M.publishDraft(state);
  assert(first.ok);
  state = first.state;
  const publicV3 = JSON.stringify(M.getPublished(state, 'capacity'));
  const approvalV3 = JSON.stringify(state.editor.approvalHistory);
  const count = state.editor.publishCount;
  const historyLength = M.getPublished(state, 'capacity').history.length;
  const duplicate = M.publishDraft(state);
  assert(duplicate.ok && duplicate.noop);
  assert.equal(duplicate.state.editor.publishCount, count);
  assert.equal(M.getPublished(duplicate.state, 'capacity').history.length, historyLength);
  state = save(state, { evidenceId:'src-a-v2', readiness:'Yeni kanıtla yeniden değerlendirme', corroboration:'Güncellenen bağımsız destek değerlendirmesi' });
  assert.equal(JSON.stringify(M.getPublished(state, 'capacity')), publicV3);
  assert.equal(JSON.stringify(state.editor.approvalHistory), approvalV3);
  state = approve(state);
  const v4 = M.publishDraft(state);
  assert(v4.ok);
  const published = M.getPublished(v4.state, 'capacity');
  assert.equal(published.publishedVersion, 4);
  assert.equal(published.sources[0].id, 'src-a-v2');
  assert.equal(published.independence, 'Güncellenen bağımsız destek değerlendirmesi');
  assert.equal(typeof published.assessments.version, 'number');
  assert(published.assessments.version > 1);
  assert.equal(JSON.stringify(v4.state.editor.approvalHistory[0]), JSON.stringify(JSON.parse(approvalV3)[0]));
});

test('read results are copies and publication rejects dirty or mismatched packages', () => {
  let state = approve(M.createDemo());
  const read = M.getPublished(state, 'capacity');
  read.title = 'Read copy changed'; read.sources[0].summary = 'Read source changed';
  assert.notEqual(M.getPublished(state, 'capacity').title, read.title);
  assert.notEqual(M.getPublished(state, 'capacity').sources[0].summary, read.sources[0].summary);
  const dirty = structuredClone(state); dirty.editor.dirty = true;
  assert.equal(M.publishDraft(dirty).ok, false);
  const locale = structuredClone(state); locale.editor.locale = 'English';
  assert.equal(M.publishDraft(locale).ok, false);
  const mismatch = structuredClone(state); mismatch.editor.draft.claimWording = 'Unapproved claim';
  assert.equal(M.publishDraft(mismatch).ok, false);
  state = save(state, { title:'' });
  assert.equal(M.approveDraft(reviewed(state)).ok, false);
  assert.equal(M.getPublished(M.reset(), 'capacity').publishedVersion, 2);
});
