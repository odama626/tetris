import * as React from 'react';
import { connect } from 'react-redux';
import Game from '../GameBoard/Game';

export default connect(state => ({...state.Home}))(() => (
  <div>
    <Game />
  </div>
))

