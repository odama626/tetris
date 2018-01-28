import generateTetrimino from '../Canvas/Tetriminos';
import Matrix from '../Canvas/Matrix';
import { initialState } from './Reducer';

const scoreModifier = [0, 40, 100, 300, 1200];

const nextTetrimino = ({ next, current }) => ({
  current: next,
  next: generateTetrimino()
});

export const cleanupBoard = ({
  score: { best, current, last },
  arena,
  canvasControllers,
  ...state
}) => {
  arena.clearMatrix();
  return {
    ...initialState(),
    arena,
    canvasControllers,
    score: {
      last: current,
      best: current > best ? current : best,
      current: 0
    }
  };
};

export const addCanvasController = ({ canvasControllers, ...state }, { canvas, controller }) => ({
  ...state,
  canvasControllers: {
    ...canvasControllers,
    [canvas]: controller
  }
});

const updateScore = ({ current, best }, linesCleared, lastLines) => {
  current += scoreModifier[linesCleared] * (lastLines === 4 ? 100 : 1);
  return { current, best };
};

export const update = state => (state.delta - state.tickRate > 0 ? drop(state) : state);

export const rotate = (state, direction: number) => {
  let offset = 1,
    tetrimino = [...state.tetriminos.current];
  let { pos } = state;
  const { arena } = state;
  const initialPos = pos.x;
  Matrix.rotate(tetrimino, direction);
  while (arena.isCollision(tetrimino, pos)) {
    pos.x += offset;
    offset = -(offset > 0 ? offset + 1 : offset - 1);
    if (offset > tetrimino[0].length) {
      pos.x = initialPos;
      return rotate(
        {
          ...state,
          pos,
          tetriminos: { ...state.tetriminos, current: tetrimino }
        },
        -direction
      );
    }
  }
  return {
    ...state,
    pos,
    tetriminos: { ...state.tetriminos, current: tetrimino }
  };
};

export const move = (state, move) => {
  const { arena, pos: { x, y }, tetriminos: { current } } = state;
  return arena.isCollision(current, { x: x + move, y })
    ? state
    : { ...state, pos: { x: x + move, y } };
};

export const swapHold = state => {
  if (!state.allowSwap) return state;
  const { hold, current, next } = state.tetriminos;
  return {
    ...state,
    allowSwap: false,
    tetriminos: {
      current: hold || next,
      next: hold ? next : generateTetrimino(),
      hold: current
    }
  };
};

export const hardDrop = state => {
  let nextState = state;
  while (!nextState.tetriminoJustGenerated) {
    nextState = drop(nextState);
  }
  return nextState;
};

export const drop = state => {
  const { tetriminos, arena, now } = state;
  let { pos: { x, y }, score, lastLines } = state;
  y++;

  // If there isn't a collision we're done
  if (!arena.isCollision(tetriminos.current, { x, y })) {
    return {
      ...state,
      pos: { x, y },
      lastTick: now,
      tetriminoJustGenerated: false
    };
  }

  y--;
  arena.merge(tetriminos.current, { x, y });

  let linesCleared = arena.sweep();
  let nextMinos = { ...tetriminos, ...nextTetrimino(tetriminos) };
  let pos = { x: arena.getMiddleFor(nextMinos.current).x, y: 0 };
  let gameOver = arena.isCollision(nextMinos.current, pos);
  if (gameOver) console.error('Game Over');

  return {
    ...state,
    lastTick: now,
    score: {
      ...score,
      ...updateScore(score, linesCleared, lastLines)
    },
    allowSwap: true,
    tetriminos: nextMinos,
    pos,
    gameOver,
    tetriminoJustGenerated: true,
    gameInProgress: !gameOver
  };
};
