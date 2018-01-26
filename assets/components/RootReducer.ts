import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Login from './Login/Reducer';
import Header from './Header/Reducer';
import Home from './Home/Reducer';
import GameBoard from './GameBoard/Reducer';
import GameLoop from './GameLoopReducer';

const initialWindowState = {
  width: ENV.BUILD_TARGET === 'client' ? window.innerWidth : 0,
  height: ENV.BUILD_TARGET === 'client' ? window.innerHeight : 0,
  tabletBreakpoint: 1299,
  phoneBreakpoint: 896
};

const SCREEN_RESIZE = 'WINDOW_SCREEN_RESIZE';

export function attachResizeListener(store) {
  if (ENV.BUILD_TARGET === 'client') {
    let timer;
    window.addEventListener('resize', e => {
      // assuming a large number of components will be using screen size
      // only dispatch the action after the resize has finished
      clearTimeout(timer);
      timer = setTimeout(() => {
        store.dispatch(screenResize(window.innerWidth, window.innerHeight));
      }, 250);
    });
  }
}

const phoneBreakpoint = 896,
  tabletBreakpoint = 1299;
const screenResize = (width, height) => ({
  type: SCREEN_RESIZE,
  width,
  height
});
const setBounds = (width, height) => ({
  width,
  height,
  tabletBreakpoint,
  phoneBreakpoint,
  mobile: width < phoneBreakpoint,
  tablet: width < tabletBreakpoint
});

function bounds(state = initialWindowState, action) {
  switch (action.type) {
    case SCREEN_RESIZE:
      return { ...state, ...setBounds(action.width, action.height) };
    case '@@router/LOCATION_CHANGE':
      return { ...state, ...setBounds(window.innerWidth, window.innerHeight) };
  }
  return state;
}

function pathHistory(state = [], action) {
  if (action.type === 'PATH_TRACKING') {
    let lastPath = state[0];
    return lastPath === action.path ? state : [action.path, ...state];
  }
  return state;
}

export default combineReducers({
  Login,
  bounds,
  Header,
  Home,
  GameBoard,
  GameLoop,
  router: routerReducer
});
