import * as Actions from '../GameBoard/Actions';
import { Actions as Events } from '../EventLoopReducer';
import { findIn, compareWith } from '../../utils/Utils';
import { getTetriminoType, createTetrimino } from '../Canvas/Tetriminos';
import { compress, expand, Actions as CompressedActions } from './TransformActionTypes';

const importantActions = [
  Actions.DROP,
  Actions.HARD_DROP,
  Actions.SWAP_HOLD,
  Actions.MOVE_LEFT,
  Actions.MOVE_RIGHT,
  Actions.ROTATE_CLOCKWISE,
  Actions.ROTATE_COUNTER_CLOCKWISE,
  Events.UPDATE
];

const traceTetriminoActions = [Actions.DROP, Actions.HARD_DROP, Events.UPDATE];

const startRecording = Events.START;
const stopRecording = Events.STOP;

let recordedActions: any = [];
let timeOffset;
let lastMinos, theseMinos;

const sameTetriminos = compareWith('next', 'current', 'hold');

function lastEventUpdateNotNeeded(action, lastRecorded, timeOffset) {
  if (
    action.type === Events.UPDATE &&
    lastRecorded &&
    lastRecorded.type === CompressedActions.UPDATE
  ) {
    if (action.now - timeOffset - lastRecorded.now <= 1000) {
      return true;
    }
  }
  return false;
}

function pullTetriminos(store, timeOffset) {
  const { next, current, hold } = store.getState().GameBoard.tetriminos;
  return {
    type: Actions.SET_TETRIMINOS,
    tetriminos: {
      next: getTetriminoType(next),
      current: getTetriminoType(current),
      hold: getTetriminoType(hold)
    },
    now: Date.now() - timeOffset
  };
}

export default store => next => action => {
  if (action.type === stopRecording) {
    console.log('RecordedActions', recordedActions);
  } else if (importantActions.indexOf(action.type) > -1) {
    if (
      !lastEventUpdateNotNeeded(action, recordedActions[recordedActions.length - 1], timeOffset)
    ) {
      recordedActions.push(compress({ type: action.type, now: action.now - timeOffset }));
    }
  }

  if (traceTetriminoActions.indexOf(action.type) > -1) {
    lastMinos = pullTetriminos(store, timeOffset);
  }
  next(action);
  if (action.type === startRecording) {
    timeOffset = Date.now();
    recordedActions = [compress(pullTetriminos(store, timeOffset))];
  } else if (traceTetriminoActions.indexOf(action.type) > -1) {
    theseMinos = pullTetriminos(store, timeOffset);
    if (!sameTetriminos(lastMinos.tetriminos, theseMinos.tetriminos)) {
      recordedActions.push(compress(theseMinos));
    }
  }
};

import gamePlayback from '../../../playData';

const loop = ({ dispatch, getState }) => {};

export const Playback = store => next => action => {
  next(action);
  if (action.type === Events.START) {
    let timeOffset = Date.now();
    const loop = () => {
      let delta = Date.now() - timeOffset;
      if (gamePlayback.length > 0 && gamePlayback[0].now <= delta) {
        let action = expand(gamePlayback.shift());
        if (action.type === Actions.SET_TETRIMINOS) {
          action.tetriminos = {
            next: createTetrimino(action.tetriminos.next),
            current: createTetrimino(action.tetriminos.current),
            hold: createTetrimino(action.tetriminos.hold)
          };
        }
        store.dispatch(action);
      }
      window.requestAnimationFrame(loop);
    };
    loop();
  }
};
