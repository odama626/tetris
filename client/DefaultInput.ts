import { InputActions } from '../assets/components/GameBoard/Actions';

const inputs = {
  moveLeft: [37, 65],
  moveRight: [39, 68],
  hardDrop: [38, 87],
  drop: [40, 83],
  rotate: [81],
  rotateReverse: [69],
  swapHold: [32]
};

export default ({ dispatch }) => {
  window.addEventListener('keydown', ({ keyCode }) => {
    let inputActions = Object.keys(inputs).filter(
      input => inputs[input].indexOf(keyCode) !== -1
    );
    inputActions.forEach(inputAction => dispatch(InputActions[inputAction]()));
  });
};
