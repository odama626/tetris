import { for2dTruthy } from '../../utils/Utils';

export type IMatrix = number[][];
export type IMaybeMatrix = IMatrix | null;
export interface IPoint {
  x: number;
  y: number;
}

export default class Matrix {
  public static create(width, height): IMatrix {
    let matrix: IMatrix = [];
    while (height--) {
      matrix.push(new Array(width).fill(0));
    }
    return matrix;
  }

  public static rotate(matrix: IMatrix, direction: number) {
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
