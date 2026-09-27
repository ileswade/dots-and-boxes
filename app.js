import { Game } from './game.js';

const $ = id => document.getElementById(id);
let game = new Game();
const board = $('board');
let edgeButtons = [];

function fillOptions(select, count) {
  const previous = Number(select.value) || 1;
  select.replaceChildren(...Array.from({ length: count }, (_, i) => new Option(String(i + 1), String(i + 1))));
  select.value = String(Math.min(previous, count));
}

function updateCoordinates() {
  const horizontal = $('direction').value === 'horizontal';
  fillOptions($('row'), game.rows + (horizontal ? 1 : 0));
  fillOptions($('column'), game.columns + (horizontal ? 0 : 1));
  highlightSelection();
}

function highlightSelection() {
  for (const button of edgeButtons) {
    button.classList.toggle('selected', button.dataset.orientation === $('direction').value
      && Number(button.dataset.row) === Number($('row').value) - 1
      && Number(button.dataset.column) === Number($('column').value) - 1);
  }
}

function buildBoard() {
  board.replaceChildren();
  edgeButtons = [];
  board.style.gridTemplateColumns = `24px repeat(${game.columns}, 16px minmax(0, 1fr)) 16px`;
  board.style.gridTemplateRows = `24px repeat(${game.rows}, 16px minmax(0, 1fr)) 16px`;
  const place = (element, row, column) => {
    element.style.gridRow = row;
    element.style.gridColumn = column;
    board.append(element);
  };
  for (let r = 0; r <= game.rows; r++) {
    const label = document.createElement('span'); label.className = 'axis'; label.textContent = r + 1;
    place(label, 2 + r * 2, 1);
    for (let c = 0; c <= game.columns; c++) {
      if (r === 0) {
        const label = document.createElement('span'); label.className = 'axis'; label.textContent = c + 1;
        place(label, 1, 2 + c * 2);
      }
      const dot = document.createElement('span'); dot.className = 'dot'; dot.setAttribute('aria-hidden', 'true');
      place(dot, 2 + r * 2, 2 + c * 2);
      if (c < game.columns) makeEdge('horizontal', r, c, 2 + r * 2, 3 + c * 2);
      if (r < game.rows) makeEdge('vertical', r, c, 3 + r * 2, 2 + c * 2);
      if (r < game.rows && c < game.columns) {
        const box = document.createElement('span'); box.className = 'box'; box.id = `box-${r}-${c}`;
        place(box, 3 + r * 2, 3 + c * 2);
      }
    }
  }
  function makeEdge(orientation, row, column, gridRow, gridColumn) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `edge ${orientation}`;
    Object.assign(button.dataset, { orientation, row, column });
    button.addEventListener('click', () => move(orientation, row, column));
    edgeButtons.push(button); place(button, gridRow, gridColumn);
  }
  updateCoordinates();
}

function render() {
  for (const button of edgeButtons) {
    const { orientation, row, column } = button.dataset;
    const owner = game[orientation][row][column];
    button.dataset.owner = owner || '';
    button.setAttribute('aria-label', `${orientation} line, row ${Number(row) + 1}, column ${Number(column) + 1}${owner ? `, drawn by Player ${owner}` : ''}`);
    // Keep focus on the last move; aria-disabled prevents occupied edges from changing state.
    button.setAttribute('aria-disabled', String(Boolean(owner) || game.finished));
  }
  game.boxes.forEach((row, r) => row.forEach((owner, c) => {
    const box = $(`box-${r}-${c}`); box.dataset.owner = owner || ''; box.textContent = owner ? `P${owner}` : '';
    box.setAttribute('aria-label', `Box row ${r + 1}, column ${c + 1}${owner ? `, Player ${owner}` : ', unclaimed'}`);
  }));
  for (const player of [1, 2]) {
    $(`score${player}`).textContent = game.scores[player - 1];
    $(`player${player}`).classList.toggle('active', !game.finished && player === game.player);
    $(`turn${player}`).textContent = game.finished ? (game.winner === 0 ? 'Tie' : game.winner === player ? 'Winner' : '') : game.player === player ? 'Your turn' : '';
  }
  board.dataset.player = game.player;
  $('board-size').textContent = `${game.rows} × ${game.columns} boxes`;
  $('remaining').textContent = `${game.totalEdges - game.moves} lines left`;
  $('draw').disabled = game.finished;
  if (game.finished) $('status').textContent = game.winner === 0
    ? `A tie! Both players claimed ${game.scores[0]} boxes. Start a new game for a rematch.`
    : `Player ${game.winner} wins, ${Math.max(...game.scores)} to ${Math.min(...game.scores)}! Start a new game for a rematch.`;
}

function move(orientation, row, column) {
  const result = game.play(orientation, row, column);
  if (!result.ok) { $('status').textContent = result.reason; return; }
  $('status').textContent = result.completed.length
    ? `Player ${result.player} claimed ${result.completed.length} ${result.completed.length === 1 ? 'box' : 'boxes'}. Take another turn!`
    : `Player ${game.player}'s turn. Choose a line.`;
  render();
}

$('direction').addEventListener('change', updateCoordinates);
for (const id of ['row', 'column']) $(id).addEventListener('change', highlightSelection);
$('move-form').addEventListener('submit', event => {
  event.preventDefault();
  move($('direction').value, Number($('row').value) - 1, Number($('column').value) - 1);
});
$('restart').addEventListener('click', () => {
  game = new Game(Number($('size').value));
  buildBoard(); render(); $('status').textContent = 'Fresh board. Player 1 goes first.';
});
buildBoard(); render(); $('status').textContent = "Player 1 goes first. Let's connect some dots.";
