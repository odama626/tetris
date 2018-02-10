import * as React from 'react';
import Canvas from '../Canvas/Canvas';
import { connect, Dispatch } from 'react-redux';
import * as style from './GameBoard.scss';
import { compareWith } from '../../utils/Utils';

// Types
import CanvasController from '../Canvas/CanvasController';
import { IMatrix } from '../Canvas/Matrix';
import { IGameBoard, GameBoardProps } from './interfaces';

export default class GameBoard extends React.Component<GameBoardProps, {}> {
  private importantPropsMatch = compareWith('arena', 'gameInProgress', 'score', 'tetriminos', 'gameOver');
  componentDidMount() {
    this.props.setDrawFunction(this.draw.bind(this));
  }

  shouldComponentUpdate(nextProps) {
    return !this.importantPropsMatch(this.props, nextProps);
  }

  draw() {
    const { pos, tetriminos: { current, next, hold }, showNext, showHold } = this.props;
    const { arena, next: nextController, hold: holdController } = this.props.canvasControllers;
    const { canvasStyle: { drawShadow } } = this.props.preferences;
    if (!arena) return;

    arena.clear();
    if (drawShadow) {
      arena.drawShadow(current!, pos, (context, x, y, color) => {
        context.fillStyle = color;
        context.globalAlpha = 0.2;
        context.fillRect(x, y, 1, 1);
        context.globalAlpha = 1;
        context.strokeStyle = color;
        context.lineWidth = 0.03;
        context.strokeRect(x, y, 1, 1);
      });
    }
    arena.draw(current!, pos);
    arena.draw();

    if (nextController && showNext) {
      nextController.clear();
      nextController.draw(next!);
      nextController.write('Next');
    }

    if (holdController && showHold) {
      holdController.clear();
      holdController.draw(hold!);
      holdController.write('Hold');
    }
  }

  render() {
    const { score, setCanvasController } = this.props;
    const { arena, next, hold } = this.props.canvasControllers;
    const { canvasStyle } = this.props.preferences;

    return (
      <div className={style.container}>
        <Canvas
          className={style.next}
          style={canvasStyle}
          width={80}
          height={80}
          scale={10}
          mountController={next}
          setController={controller => setCanvasController('next', controller)}
        />
        <Canvas
          className={style.hold}
          style={canvasStyle}
          width={80}
          height={80}
          scale={10}
          mountController={hold}
          setController={controller => setCanvasController('hold', controller)}
        />
        <Canvas
          className={style.arena}
          style={canvasStyle}
          width={200}
          height={400}
          mountController={arena}
          setController={controller => setCanvasController('arena', controller)}
        />
      </div>
    );
  }
}
