import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Actions as EventLoop } from '../EventLoopReducer';
import Gameboard from './GameBoard';

// TODO pull up Gameboard logic and Redux state, allow reuse of gameboard

class Game extends React.Component<any, {}> {
  private gameBoard: GameBoard;
  componentdDidMount() {}
}
