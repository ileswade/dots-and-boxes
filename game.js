// Coordinates identify the starting dot of an edge, using zero-based indices.
export class Game {
  constructor(rows = 4, columns = rows) {
    if (![rows, columns].every(n => Number.isInteger(n) && n >= 1 && n <= 8)) {
      throw new RangeError('Use between 1 and 8 rows and columns of boxes.');
    }
    this.rows = rows;
    this.columns = columns;
    this.horizontal = Array.from({ length: rows + 1 }, () => Array(columns).fill(null));
    this.vertical = Array.from({ length: rows }, () => Array(columns + 1).fill(null));
    this.boxes = Array.from({ length: rows }, () => Array(columns).fill(null));
    this.player = 1;
    this.scores = [0, 0];
    this.moves = 0;
  }

  get totalEdges() { return (this.rows + 1) * this.columns + this.rows * (this.columns + 1); }
  get finished() { return this.moves === this.totalEdges; }
  get winner() {
    if (!this.finished) return null;
    return this.scores[0] === this.scores[1] ? 0 : this.scores[0] > this.scores[1] ? 1 : 2;
  }

  play(orientation, row, column) {
    if (this.finished) return { ok: false, reason: 'This game is over. Start a new game to play again.' };
    if (!['horizontal', 'vertical'].includes(orientation) || !Number.isInteger(row) || !Number.isInteger(column)) {
      return { ok: false, reason: 'Choose a valid line, row, and column.' };
    }
    const edges = this[orientation];
    if (row < 0 || row >= edges.length || column < 0 || column >= edges[row].length) {
      return { ok: false, reason: 'That line is outside the board.' };
    }
    if (edges[row][column] !== null) return { ok: false, reason: 'That line is already drawn. Choose another.' };

    const player = this.player;
    edges[row][column] = player;
    this.moves += 1;
    const adjacent = orientation === 'horizontal'
      ? [[row - 1, column], [row, column]]
      : [[row, column - 1], [row, column]];
    const completed = [];
    for (const [r, c] of adjacent) {
      if (r < 0 || r >= this.rows || c < 0 || c >= this.columns || this.boxes[r][c] !== null) continue;
      if (this.horizontal[r][c] && this.horizontal[r + 1][c] && this.vertical[r][c] && this.vertical[r][c + 1]) {
        this.boxes[r][c] = player;
        this.scores[player - 1] += 1;
        completed.push([r, c]);
      }
    }
    if (!completed.length && !this.finished) this.player = 3 - player;
    return { ok: true, player, completed, extraTurn: completed.length > 0 && !this.finished };
  }
}
