import assert from 'node:assert/strict';
import { test } from 'node:test';

import { bracketFromMatches, type PublicMatch } from './bracket.ts';

const m = (phase: string, sortOrder: number, a: string, b: string, scoreA: number, scoreB: number, matchKind = 'standard'): PublicMatch => ({
  phase,
  sortOrder,
  a,
  b,
  scoreA,
  scoreB,
  winner: scoreA > scoreB ? a : b,
  matchKind,
});

const top4 = [m('final', 0, 'Ana', 'Duda', 2, 1), m('semi', 1, 'Cris', 'Duda', 0, 2), m('semi', 0, 'Ana', 'Bia', 2, 0)];

test('chave de 4: fases da 1ª à final, em ordem, com campeão', () => {
  const b = bracketFromMatches(top4);
  assert.ok(b);
  assert.equal(b.size, 4);
  assert.deepEqual(b.columns.map((c) => c.phase), ['semi', 'final']);
  assert.deepEqual(b.columns[0].matches.map((x) => x.a), ['Ana', 'Cris']);
  assert.equal(b.champion, 'Ana');
});

test('palco antigo (fase "primeira") não vira chave', () => {
  const old = [m('final', 0, 'A', 'B', 2, 1), m('semi', 0, 'A', 'C', 2, 0), m('semi', 1, 'B', 'D', 2, 0), ...[0, 1, 2, 3].map((i) => m('primeira', i, 'x', 'y', 2, 0))];
  assert.equal(bracketFromMatches(old), null);
});

test('repescagem, fase incompleta ou ordem com buraco → null (vira lista)', () => {
  assert.equal(bracketFromMatches([...top4.slice(1), m('final', 0, 'Ana', 'Duda', 2, 1, 'repechage')]), null);
  assert.equal(bracketFromMatches(top4.slice(0, 2)), null);
  assert.equal(bracketFromMatches([m('final', 0, 'Ana', 'Duda', 2, 1), m('semi', 0, 'Cris', 'Duda', 0, 2), m('semi', 2, 'Ana', 'Bia', 2, 0)]), null);
  assert.equal(bracketFromMatches([]), null);
});

test('chave de 8 usa quartas, semi e final', () => {
  const q = [0, 1, 2, 3].map((i) => m('quartas', i, `a${i}`, `b${i}`, 2, 0));
  const s = [m('semi', 0, 'a0', 'a1', 2, 0), m('semi', 1, 'a2', 'a3', 0, 2)];
  const b = bracketFromMatches([...q, ...s, m('final', 0, 'a0', 'a3', 1, 2)]);
  assert.deepEqual(b?.columns.map((c) => c.matches.length), [4, 2, 1]);
  assert.equal(b?.champion, 'a3');
});
