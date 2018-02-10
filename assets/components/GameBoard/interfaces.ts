import CanvasController from '../Canvas/CanvasController'
import { IMaybeMatrix, IPoint } from '../Canvas/Matrix';
import { IPreferences } from '../Preferences/interfaces';

export type Dispatch = (Function) => void;

export interface IGameBoard {
  lastTick: number;
  tickRate: number;
  canvasControllers: {
    arena: CanvasController | null;
    hold: CanvasController | null;
    next: CanvasController | null;
  }
  gameInProgress: boolean;
  gameOver: boolean;
  pos: IPoint;
  allowSwap: boolean;
  lastLines: number;
  tetriminos: {
    next: IMaybeMatrix;
    hold: IMaybeMatrix;
    current: IMaybeMatrix;
  },
  tetriminoJustGenerated: boolean;
  score: {
    best: number;
    current: number;
    last: number;
  }
}

export interface GameBoardProps extends IGameBoard {
  setDrawFunction: (Function) => void;
  setCanvasController: (string, CanvasController) => void;
  preferences: IPreferences;
  showNext: boolean;
  showHold: boolean;
}

export interface GameProps {
  gameBoard: IGameBoard;
  playbackBoard: IGameBoard;
  preferences: IPreferences;
  dispatch: Dispatch;
}