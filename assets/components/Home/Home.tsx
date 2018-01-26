import * as React from 'react';
import { connect } from 'react-redux';
import GameBoard from '../GameBoard/GameBoard';

export default connect(state => ({...state.Home}))(() => (
  <div>
    <GameBoard />
  </div>
))

