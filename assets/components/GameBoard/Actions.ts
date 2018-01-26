import generateTetrimino from '../Canvas/Tetriminos';

export const SET_CONTROLLER = 'GAMEBOARD_SET_CONTROLLER';
export const SET_ARENA_CONTROLLER = 'GAMEBOARD_SET_ARENA_CONTROLLER';
export const GAME_OVER = 'GAMEBOARD_GAME_OVER';

export const SET_COLORTABLE = 'PREFERENCES_SET_COLORTABLE';

export const DROP = 'INPUT_ACTION_DROP';
export const HARD_DROP = 'INPUT_ACTION_HARD_DROP';
export const SWAP_HOLD = 'INPUT_ACTION_SWAP_HOLD';
export const MOVE_RIGHT = 'INPUT_ACTION_MOVE_RIGHT';
export const MOVE_LEFT = 'INPUT_ACTION_MOVE_LEFT';
export const ROTATE_CLOCKWISE = 'INPUT_ACTION_ROTATE_CLOCKWISE';
export const ROTATE_COUNTER_CLOCKWISE = 'INPUT_ACTION_ROTATE_COUNTER_CLOCKWISE';
export const PAUSE = 'INPUT_ACTION_PAUSE';

export class InputActions {
  static drop = () => ({ type: DROP });
  static hardDrop = () => ({ type: HARD_DROP });
  static moveRight = () => ({ type: MOVE_RIGHT });
  static moveLeft = () => ({ type: MOVE_LEFT });
  static swapHold = () => ({ type: SWAP_HOLD });
  static rotate = () => ({ type: ROTATE_CLOCKWISE });
  static rotateReverse = () => ({ type: ROTATE_COUNTER_CLOCKWISE });
  static pause = () => ({ type: PAUSE });
}

export const setController = (canvas, controller) => ({
  type: SET_CONTROLLER,
  canvas,
  controller
});

export const setArenaController = (canvas, controller) => ({
  type: SET_ARENA_CONTROLLER,
  canvas,
  controller
});

export const setColorTable = colorTable => ({
  type: SET_COLORTABLE,
  colorTable
});

export const gameOver = () => ({ type: GAME_OVER });
