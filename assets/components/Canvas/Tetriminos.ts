export const TETRIMINOS = 'TOSZLJI';

import { IMatrix, IMaybeMatrix } from './Matrix';

export default () => createTetrimino(TETRIMINOS[(TETRIMINOS.length * Math.random()) | 0]);

export function createTetrimino(type): IMaybeMatrix {
  if (type === 'T') {
    return [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
  } else if (type === 'O') {
    return [[2, 2], [2, 2]];
  } else if (type === 'S') {
    return [[0, 0, 0], [0, 3, 3], [3, 3, 0]];
  } else if (type === 'Z') {
    return [[0, 0, 0], [4, 4, 0], [0, 4, 4]];
  } else if (type === 'L') {
    return [[0, 5, 0], [0, 5, 0], [0, 5, 5]];
  } else if (type === 'J') {
    return [[0, 6, 0], [0, 6, 0], [6, 6, 0]];
  } else if (type === 'I') {
    return [[0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0]];
  }
  return null;
}

export function getTetriminoType(tetrimino: IMatrix): string | null {
  if (tetrimino === null) return null;
  let colorIndex = tetrimino.reduce((acc, cur) => [...acc, ...cur], []).find(a => a > 0);
  return colorIndex ? TETRIMINOS[colorIndex - 1] : null;
}

export const PreviewMatrix = [
  [7, 5, 5, 5],
  [7, 5, 2, 2],
  [7, 0, 2, 2],
  [7, 0, 0, 4],
  [1, 0, 4, 4],
  [1, 1, 4, 6],
  [1, 6, 6, 6]
];

/**
 * Colors T, O, S, Z, L, J, I
 */

export const arraysAreEqual = (a, b) => {
  return a.length === b.length && a.reduce((acc, cur, i) => acc && cur === b[i], true);
};

export const COLORTABLE = {
  vadim: [null, 'brown', '#000080', 'darkgreen', 'teal', 'purple', 'silver', 'maroon'],
  ms: [null, 'silver', 'cyan', 'blue', 'green', 'yellow', 'magenta', 'red'],
  sega: [null, 'cyan', 'yellow', 'magenta', 'green', 'orange', 'blue', 'red'],
  soviet: [null, 'olive', 'blue', 'green', 'cyan', 'magenta', 'orange', 'red'],

  rainbow: [null, 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'magenta'],
  tigrana: [null, '#00AF87', '#5FAFD7', '#D787AF', '#D75F5F', '#FF875F', '#A8A8A8', '#8787D7']
};
