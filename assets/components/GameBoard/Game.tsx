import * as React from 'react';
import { connect, Dispatch } from 'react-redux';


import * as Actions from './Actions';
import { Actions as EventLoop } from '../EventLoopReducer';
import Gameboard from './GameBoard';
import { GameProps } from './interfaces';

import * as style from './Game.scss';

// TODO pull up Gameboard logic and Redux state, allow reuse of gameboard

class Game extends React.Component<GameProps, {}> {
  private gameBoard: () => void;
  private playback: () => void;

  componentDidMount() {
    const { dispatch } = this.props;
    setTimeout(() => dispatch(EventLoop.start(this.gameBoard)), 0);
  }
  componentWillUnmount() {
    this.props.dispatch(EventLoop.pause());
  }

  componentDidUpdate() {
    const { gameBoard: { gameOver }, dispatch } = this.props;
    if (gameOver) {
      dispatch(EventLoop.stop());
      dispatch(Actions.gameOver());
    }
  }

  render() {
    const { preferences, gameBoard, dispatch, playbackBoard } = this.props;
    return (
      <div className={style.container}>
        <div>
          <Gameboard
            showNext={true}
            showHold={true}
            setCanvasController={(canvas, controller) => dispatch(Actions.setCanvasController(canvas, controller))}
            setDrawFunction={gameboard => (this.gameBoard = gameboard)}
            preferences={preferences}
            {...gameBoard}
          />
        </div>
        <div>
          <Gameboard
            showNext={false}
            showHold={false}
            setCanvasController={(canvas, controller) => console.log(canvas, controller)}
            setDrawFunction={draw => (this.playback = draw)}
            {...playbackBoard}
            preferences={preferences}
          />
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  gameBoard: state.GameBoard,
  preferences: state.Preferences,
  playbackBoard: state.PlaybackBoard
}))(Game);
