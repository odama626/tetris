import { diff } from 'deep-object-diff';
import * as Actions from '../GameBoard/Actions';
import { Actions as Events } from '../EventLoopReducer';

const importantActions = [
  Actions.DROP,
  Actions.HARD_DROP,
  Actions.SWAP_HOLD,
  Actions.MOVE_LEFT,
  Actions.MOVE_RIGHT,
  Actions.ROTATE_CLOCKWISE,
  Actions.ROTATE_COUNTER_CLOCKWISE,
  Events.UPDATE,
  Events.START
];

let originalState: any, nextState: any, change: any;
let recorded: any[];
let delta;

function removeTimings(state) {
  return {
    ...state,
    now: undefined,
    delta: undefined,
    lastTick: undefined
  };
}

function cleanInitialState(originalState) {
  let state = { ...originalState };
  delete state.arena;
  delete state.canvasControllers;
  delete state.delta;
  delete state.lastTick;
  return state;
}

function updateTetriminos(nextState, diff) {
  Object.keys(diff).forEach(key => {
    diff[key] = nextState && nextState[key] ? [...nextState[key]] : null;
  });
}

export default store => next => action => {
  if (importantActions.indexOf(action.type) === -1) return next(action);

  if (action.type === Events.START) {
    recorded = [];
    delta = Date.now();
    originalState = cleanInitialState(store.getState().GameBoard);
    originalState.now = 0;
    recorded.push(originalState);
    return next(action);
  }

  originalState = removeTimings(store.getState().GameBoard);
  next(action);
  nextState = removeTimings(store.getState().GameBoard);
  change = diff(originalState, nextState);

  if (
    action.type === Actions.ROTATE_CLOCKWISE ||
    action.type === Actions.ROTATE_COUNTER_CLOCKWISE
  ) {
    // Deep-object-diff doesn't pick up matrix rotations
    // stub current tetrimino to guarantee we record the rotation
    change['tetriminos'] = { current: true };
  }

  if (Object.keys(change).length === 0) return;

  if (change['tetriminos']) {
    updateTetriminos(nextState.tetriminos, change.tetriminos);
  }

  change.now = Date.now() - delta;
  recorded.push({ ...change });
  // console.log('recorder', recorded);
};

export const Playback = store => next => action => {
  next(action);
};
