import * as merge from 'mixin-deep';

import { initialState } from '../GameBoard/Reducer';
import { Actions as EventLoop } from '../EventLoopReducer';
import { setCanvasController, hardDrop } from '../GameBoard/UpdateLogic';
import playData from './playData';

// Types
import { IGameBoard } from '../GameBoard/interfaces';
import CanvasController from '../Canvas/CanvasController';

export class Actions {
  public static SET_CANVAS_CONTROLLER = 'PLAYBACK_SET_CANVAS_CONTROLLER';

  public static setCanvasController(canvas: string, controller: CanvasController) {
    return {
      type: Actions.SET_CANVAS_CONTROLLER,
      canvas,
      controller
    }
  }
}

const initialTick = Date.now();

const shouldMerge = state => {
  return state.tetriminos && state.tetriminos.next && state.tetriminos.current && !state.tetriminos.hold
}

const update = state => {
  if (playData.length > 0 && playData[0].now <= state.now - initialTick) {
    let mergableState = playData.shift();

    
    if (shouldMerge(mergableState)) {
      state = hardDrop(state);
    }
    
    return merge(state, mergableState);
  }
  return state;
}


export default (state: IGameBoard = initialState(), action) => {
  switch (action.type) {
    case Actions.SET_CANVAS_CONTROLLER:
      return setCanvasController(state, action);
    case EventLoop.UPDATE:
      return update({
        ...state,
        now: action.now,
        delta: action.now - state.lastTick,
        tetriminoJustGenerated: false
      })
  }
  return state;
}