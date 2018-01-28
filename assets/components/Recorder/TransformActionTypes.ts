import * as GameBoardActions from '../GameBoard/Actions';
import { Actions as Events } from '../EventLoopReducer';

export class Actions {
  public static DROP = 'D';
  public static HARD_DROP = 'HD';
  public static MOVE_LEFT = 'L';
  public static MOVE_RIGHT = 'R';
  public static ROTATE_CLOCKWISE = 'F';
  public static ROTATE_COUNTER_CLOCKWISE = 'B';
  public static SWAP_HOLD = 'S';
  public static SET_TETRIMINOS = 'T';
  public static UPDATE = '_';
}

function getCompressedType(type) {
  switch (type) {
    case GameBoardActions.DROP:
      return Actions.DROP;
    case GameBoardActions.HARD_DROP:
      return Actions.HARD_DROP;
    case GameBoardActions.MOVE_LEFT:
      return Actions.MOVE_LEFT;
    case GameBoardActions.MOVE_RIGHT:
      return Actions.MOVE_RIGHT;
    case GameBoardActions.ROTATE_CLOCKWISE:
      return Actions.ROTATE_CLOCKWISE;
    case GameBoardActions.ROTATE_COUNTER_CLOCKWISE:
      return Actions.ROTATE_COUNTER_CLOCKWISE;
    case GameBoardActions.SWAP_HOLD:
      return Actions.SWAP_HOLD;
    case GameBoardActions.SET_TETRIMINOS:
      return Actions.SET_TETRIMINOS;
    case Events.UPDATE:
      return Actions.UPDATE;
  }
}

export function compress(action) {
  return { ...action, type: getCompressedType(action.type) };
}

function getExpandedType(type) {
  switch (type) {
    case Actions.DROP:
      return GameBoardActions.DROP;
    case Actions.HARD_DROP:
      return GameBoardActions.HARD_DROP;
    case Actions.MOVE_LEFT:
      return GameBoardActions.MOVE_LEFT;
    case Actions.MOVE_RIGHT:
      return GameBoardActions.MOVE_RIGHT;
    case Actions.ROTATE_CLOCKWISE:
      return GameBoardActions.ROTATE_CLOCKWISE;
    case Actions.ROTATE_COUNTER_CLOCKWISE:
      return GameBoardActions.ROTATE_CLOCKWISE;
    case Actions.SWAP_HOLD:
      return GameBoardActions.SWAP_HOLD;
    case Actions.SET_TETRIMINOS:
      return GameBoardActions.SET_TETRIMINOS;
    case Actions.UPDATE:
      return Events.UPDATE;
  }
}

export function expand(action) {
  return { ...action, type: getExpandedType(action.type) };
}
