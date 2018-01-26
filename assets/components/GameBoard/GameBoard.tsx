import * as React from 'react';
import Canvas from '../Canvas/Canvas';
import { connect, Dispatch } from 'react-redux';
import * as sass from './GameBoard.scss';
import * as Actions from './Actions';
import { Actions as GameLoop } from '../GameLoopReducer';
import { compareWith } from '../../utils/Utils';

// Types
import CanvasController, { iCanvasStyle } from '../Canvas/CanvasController';
import { iMatrix, iPoint } from '../Canvas/Matrix';

class GameBoard extends React.Component<any, {}> {
  private importantPropsMatch = compareWith(
    'arena',
    'gameInProgress',
    'score',
    'tetriminos',
    'gameOver'
  );
  componentDidMount() {
    setTimeout(() => this.props.dispatch(GameLoop.start(this.draw.bind(this))), 0);
  }

  componentWillUnmount() {
    this.props.dispatch(GameLoop.pause());
  }

  shouldComponentUpdate(nextProps) {
    return !this.importantPropsMatch(this.props, nextProps);
  }

  componentDidUpdate() {
    if (this.props.gameOver) {
      this.props.dispatch(GameLoop.stop());
      this.props.dispatch(Actions.gameOver());
    }
  }

  draw() {
    const { pos, arena, tetriminos: { current, next, hold }, style: { drawShadow } } = this.props;
    const { next: nextController, hold: holdController } = this.props.canvasControllers;

    arena.clear();
    if (drawShadow) {
      arena.drawShadow(current, pos, (context, x, y, color) => {
        context.fillStyle = color;
        context.globalAlpha = 0.2;
        context.fillRect(x, y, 1, 1);
        context.globalAlpha = 1;
        context.strokeStyle = color;
        context.lineWidth = 0.03;
        context.strokeRect(x, y, 1, 1);
      });
    }
    arena.draw(current, pos);
    arena.draw();

    nextController.clear();
    nextController.draw(next);
    nextController.write('Next');

    holdController.clear();
    holdController.draw(hold);
    holdController.write('Hold');
  }

  render() {
    const { dispatch, style, score, arena, canvasControllers } = this.props;
    return (
      <div className={sass.container}>
        <div>
          <Canvas
            style={style}
            width={70}
            height={70}
            scale={10}
            mountController={canvasControllers.next}
            setController={controller => dispatch(Actions.setController('next', controller))}
          />
          <Canvas
            style={style}
            width={70}
            height={70}
            scale={10}
            mountController={canvasControllers.hold}
            setController={controller => dispatch(Actions.setController('hold', controller))}
          />
        </div>
        <div>
          <Canvas
            style={style}
            width={200}
            height={400}
            mountController={arena}
            setController={controller => dispatch(Actions.setArenaController('arena', controller))}
          />
        </div>
      </div>
    );
  }
}

export default connect(state => ({ ...state.GameBoard }))(GameBoard);
