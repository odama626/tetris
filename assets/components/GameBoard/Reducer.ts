import generateTetrimino, { COLORTABLE } from '../Canvas/Tetriminos';
import * as Actions from './Actions';
import { Actions as EventLoop } from '../EventLoopReducer';
import {
  addCanvasController,
  swapHold,
  rotate,
  update,
  drop,
  hardDrop,
  move,
  cleanupBoard
} from './UpdateLogic';

export const initialState = () => ({
  lastTick: 0,
  tickRate: 1000,
  arena: null,
  canvasControllers: {
    hold: null,
    next: null
  },
  gameInProgress: true,
  gameOver: false,
  pos: { x: 0, y: 0 },
  allowSwap: true,
  lastLines: 0,
  tetriminos: {
    next: generateTetrimino(),
    current: generateTetrimino(),
    hold: null
  },
  tetriminoJustGenerated: false,
  score: { best: 0, current: 0, last: 0 }
});

export default (state = initialState(), action) => {
  switch (action.type) {
    case Actions.SET_ARENA_CONTROLLER:
      return {
        ...state,
        [action.canvas]: action.controller,
        pos: {
          x: action.controller.getMiddleFor(state.tetriminos.current).x,
          y: 0
        }
      };
    case Actions.SET_CONTROLLER:
      return addCanvasController(state, action);
    case EventLoop.UPDATE:
      return update({
        ...state,
        now: action.now,
        delta: action.now - state.lastTick,
        tetriminoJustGenerated: false
      });
    case Actions.DROP:
      let now = Date.now();
      return drop({ ...state, now, delta: now - state.lastTick });
    case Actions.HARD_DROP:
      return hardDrop(state);
    case Actions.MOVE_LEFT:
      return move(state, -1);
    case Actions.MOVE_RIGHT:
      return move(state, 1);
    // Handle input
    case Actions.ROTATE_CLOCKWISE:
      return rotate(state, -1);
    case Actions.ROTATE_COUNTER_CLOCKWISE:
      return rotate(state, 1);
    case Actions.SWAP_HOLD:
      // TODO same collision checks as rotation to prevent new piece being outside of arena
      return swapHold(state);
    case Actions.GAME_OVER:
      return cleanupBoard(state);
    case Actions.SET_TETRIMINOS:
      return {
        ...state,
        tetriminos: {
          ...state.tetriminos,
          ...action.tetriminos
        }
      };
  }
  return state;
};
