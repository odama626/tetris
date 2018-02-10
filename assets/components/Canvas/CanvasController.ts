import Matrix, { IMatrix, IPoint } from './Matrix';
import { for2dTruthy } from '../../utils/Utils';

export interface ICanvasStyle {
  clearColor: string;
  colorTable: (string | null)[];
  canvas: Canvas2DContextAttributes;
  drawShadow?: boolean;
}

export default class CanvasController {
  private canvas: HTMLCanvasElement;
  private context;
  private scale: number;
  private matrix: IMatrix;
  private width: number;
  private height: number;
  private style: ICanvasStyle;

  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  mountCanvas(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.scale(this.scale, this.scale);
    if (this.style) {
      this.setStyle(this.style);
    }
  }

  init(width, height, scale = 20) {
    this.scale = scale;
    this.width = width;
    this.height = height;

    this.matrix = Matrix.create(width / scale, height / scale);

    this.context.scale(scale, scale);
  }

  /// Graphical functions
  setStyle(style) {
    this.style = style;

    Object.keys(style.canvas).forEach(key => (this.context[key] = style.canvas[key]));
  }

  custom(callback) {
    this.context.save();
    callback(this.context);
    this.context.restore();
  }

  write(text, pos = [0, 1.5], font = '1.5px Arial', color = 'white') {
    this.context.font = font;
    this.context.fillStyle = color;
    this.context.fillText(text, ...pos);
  }

  private defaultDrawOp(context, x, y, color) {
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }

  draw(matrix: IMatrix = this.matrix, pos?: IPoint, op = this.defaultDrawOp) {
    if (!matrix) return;
    if (matrix === this.matrix) {
      pos = { x: 0, y: 0 };
    }
    pos = pos || this.getMiddleFor(matrix);
    return for2dTruthy(matrix, (x, y) => {
      if (matrix[y][x] !== 0) {
        op(this.context, pos!.x + x, pos!.y + y, this.style.colorTable[matrix[y][x]]);
      }
    });
  }

  drawShadow(matrix: IMatrix, pos: IPoint, drawOp) {
    let shadowPos = { ...pos };
    while (!this.isCollision(matrix, shadowPos)) {
      shadowPos.y++;
    }
    shadowPos.y--;
    this.draw(matrix, shadowPos, drawOp);
  }

  clear() {
    this.context.fillStyle = this.style.clearColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /// Logical Functions
  merge(tetrimino: Matrix, pos: IPoint) {
    return for2dTruthy(tetrimino, (w, h) => {
      if (tetrimino[h][w] !== 0) {
        this.matrix[h + pos.y][w + pos.x] = tetrimino[h][w];
      }
    });
  }

  clearMatrix() {
    for (let h = 0; h < this.matrix.length; h++) {
      this.matrix[h].fill(0);
    }
  }

  isCollision(tetrimino: IMatrix, pos: IPoint) {
    return for2dTruthy(tetrimino, (x, y) => {
      return (
        tetrimino[y][x] !== 0 && (this.matrix[y + pos.y] && this.matrix[y + pos.y][x + pos.x]) !== 0
      );
    });
  }

  sweep() {
    let modifier = 0;
    this.matrix = this.matrix.reduce((newMatrix: IMatrix, row) => {
      let rowFull = row.indexOf(0) === -1;
      if (rowFull) modifier++;
      return rowFull ? [row.fill(0), ...newMatrix] : [...newMatrix, row];
    }, []);
    return modifier;
  }

  getMiddleFor(matrix: IMatrix): IPoint {
    return {
      x: (this.matrix[0].length / 2 - matrix[0].length / 2) | 0,
      y: (this.matrix.length / 2 - matrix.length / 2) | 0
    };
  }

  getMatrix() {
    return [...this.matrix];
  }
}
