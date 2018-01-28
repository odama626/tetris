import * as React from 'react';
import Canvas from '../Canvas/Canvas';
import { connect, Dispatch } from 'react-redux';
import * as style from './GameBoard.scss';
import * as Actions from './Actions';
import { Actions as EventLoop } from '../EventLoopReducer';
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
    setTimeout(() => this.props.dispatch(EventLoop.start(this.draw.bind(this))), 0);
  }

  componentWillUnmount() {
    this.props.dispatch(EventLoop.pause());
  }

  shouldComponentUpdate(nextProps) {
    return !this.importantPropsMatch(this.props, nextProps);
  }

  componentDidUpdate() {
    if (this.props.gameOver) {
      this.props.dispatch(EventLoop.stop());
      this.props.dispatch(Actions.gameOver());
    }
  }

  draw() {
    const { pos, arena, tetriminos: { current, next, hold } } = this.props;
    const { next: nextController, hold: holdController } = this.props.canvasControllers;
    const { canvasStyle: { drawShadow } } = this.props.preferences;

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
    const { dispatch, score, arena, canvasControllers } = this.props;
    const { canvasStyle } = this.props.preferences;

    return (
      <div className={style.container}>
        <Canvas
          className={style.next}
          style={canvasStyle}
          width={80}
          height={80}
          scale={10}
          mountController={canvasControllers.next}
          setController={controller => dispatch(Actions.setController('next', controller))}
        />
        <Canvas
          className={style.hold}
          style={canvasStyle}
          width={80}
          height={80}
          scale={10}
          mountController={canvasControllers.hold}
          setController={controller => dispatch(Actions.setController('hold', controller))}
        />
        <Canvas
          className={style.arena}
          style={canvasStyle}
          width={200}
          height={400}
          mountController={arena}
          setController={controller => dispatch(Actions.setArenaController('arena', controller))}
        />
      </div>
    );
  }
}

export default connect(state => ({ ...state.GameBoard, preferences: state.Preferences }))(
  GameBoard
);
