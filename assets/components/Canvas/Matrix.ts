import { for2dTruthy } from '../../utils/Utils';

export type iMatrix = number[][];
export interface iPoint {
  x: number;
  y: number;
}

export default class Matrix {
  public static create(width, height): iMatrix {
    let matrix: iMatrix = [];
    while (height--) {
      matrix.push(new Array(width).fill(0));
    }
    return matrix;
  }

  public static rotate(matrix: iMatrix, direction: number) {
    let y, x;
    for (y = 0; y < matrix.length; y++) {
      for (x = 0; x < y; x++) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    if (direction > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
    return matrix;
  }
}
