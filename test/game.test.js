import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../game.js';

test('legal moves alternate; illegal and duplicate moves never mutate state', () => {
  const game = new Game(2);
  assert.equal(game.play('horizontal', 0, 0).ok, true);
  assert.equal(game.player, 2);
  for (const move of [['horizontal', 0, 0], ['horizontal', 3, 0], ['vertical', 0, 3], ['vertical', -1, 0], ['boxes', 0, 0], ['horizontal', 0.5, 0], ['horizontal', '0', 0]]) {
    const before = JSON.stringify(game);
    assert.equal(game.play(...move).ok, false);
    assert.equal(JSON.stringify(game), before);
  }
  assert.equal(game.play('vertical', 1, 2).ok, true);
  assert.equal(game.player, 1);
});

test('the fourth-edge player owns a mixed-color box and gets another turn', () => {
  const game = new Game(2);
  game.play('horizontal', 0, 0);
  game.play('vertical', 0, 0);
  game.play('horizontal', 1, 0);
  const result = game.play('vertical', 0, 1);
  assert.deepEqual(result.completed, [[0, 0]]);
  assert.equal(result.extraTurn, true);
  assert.equal(game.player, 2);
  assert.deepEqual(game.scores, [0, 1]);
  assert.equal(game.boxes[0][0], 2);
});

test('one shared edge can close two boxes; final move ends play and announces winner', () => {
  const game = new Game(1, 2);
  for (const move of [['horizontal', 0, 0], ['horizontal', 0, 1], ['horizontal', 1, 0], ['horizontal', 1, 1], ['vertical', 0, 0], ['vertical', 0, 2]]) game.play(...move);
  const result = game.play('vertical', 0, 1);
  assert.equal(result.completed.length, 2);
  assert.deepEqual(game.scores, [2, 0]);
  assert.equal(game.finished, true);
  assert.equal(game.winner, 1);
  assert.equal(result.extraTurn, false);
  const before = JSON.stringify(game);
  assert.equal(game.play('vertical', 0, 1).ok, false);
  assert.equal(JSON.stringify(game), before);
});

test('tie and fresh game state', () => {
  const game = new Game(1, 2);
  for (const move of [['horizontal', 0, 0], ['horizontal', 1, 0], ['vertical', 0, 0], ['vertical', 0, 2], ['vertical', 0, 1], ['horizontal', 0, 1], ['horizontal', 1, 1]]) game.play(...move);
  assert.deepEqual(game.scores, [1, 1]);
  assert.equal(game.winner, 0);
  const fresh = new Game(1, 2);
  assert.equal(fresh.player, 1); assert.equal(fresh.moves, 0);
  assert.equal(fresh.finished, false); assert.equal(fresh.winner, null);
  assert.deepEqual(fresh.scores, [0, 0]);
  assert.ok([...fresh.horizontal.flat(), ...fresh.vertical.flat(), ...fresh.boxes.flat()].every(x => x === null));
});

test('all supported UI sizes preserve scoring invariants through 80 shuffled complete games', () => {
  let seed = 20260914;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (const size of [2, 3, 4, 5]) for (let trial = 0; trial < 20; trial++) {
    const game = new Game(size);
    const edges = [];
    for (const orientation of ['horizontal', 'vertical']) game[orientation].forEach((row, r) => row.forEach((_, c) => edges.push([orientation, r, c])));
    for (let i = edges.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [edges[i], edges[j]] = [edges[j], edges[i]]; }
    edges.forEach((edge, index) => {
      const player = game.player;
      const priorScore = game.scores[player - 1];
      const result = game.play(...edge);
      assert.equal(result.ok, true);
      assert.equal(game.moves, index + 1);
      assert.equal(game.scores[player - 1], priorScore + result.completed.length);
      assert.equal(game.scores[0] + game.scores[1], game.boxes.flat().filter(Boolean).length);
      if (!game.finished) assert.equal(game.player, result.completed.length ? player : 3 - player);
    });
    assert.equal(game.finished, true);
    assert.equal(game.scores[0] + game.scores[1], size * size);
  }
});

test('invalid board dimensions are rejected', () => {
  for (const size of [0, -1, 9, 2.5, NaN, '4']) assert.throws(() => new Game(size), RangeError);
});
