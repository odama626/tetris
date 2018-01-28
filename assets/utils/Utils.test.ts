import { findIn } from './Utils';

let testObj = {
  GameBoard: {
    tick: 100,
    score: {
      best: 100,
      last: 100,
      current: 0
    }
  }
};

test('Find value and get slimmed object based on path', () => {
  expect(findIn(testObj, ['GameBoard', 'score'])).toEqual({
    GameBoard: { score: { best: 100, last: 100, current: 0 } }
  });
});
