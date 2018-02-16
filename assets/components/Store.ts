import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { Actions as EventLoop } from './EventLoopReducer';
import thunk from 'redux-thunk';

import RootReducer, { attachResizeListener } from './RootReducer';
import { Format } from '../utils/Utils';
import Rest from '../utils/Rest';
import LocalStorage from '../utils/LocalStorage';
import Recorder, { Playback } from './Recorder/Recorder';

let localStorage = LocalStorage(ENV.STORAGE_NAMESPACE);

let mw = [Rest, localStorage, Recorder, Playback, thunk];

// Add logging to dev environment
if (ENV.DEPLOY_TARGET === ENV.TARGET_DEV) {
  const logger = store => next => action => {
    if (action.type !== EventLoop.UPDATE) console.log('dispatching', action);
    let result = next(action);
    if (action.type !== EventLoop.UPDATE) console.log('next state', store.getState());
    return result;
  };

  const crashReporter = store => next => action => {
    try {
      return next(action);
    } catch (err) {
      console.error('Exception!', err);
      throw err;
    }
  };
  mw = [...mw, logger, crashReporter];
}

const titleSetter = store => next => action => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    let title = action.payload.pathname.replace(/[^a-zA-Z0-9 |:-]/g, ' ');
    document.title = Format.capitalize(title.trim());
  }
  next(action);
};
mw = [...mw, titleSetter];

export default (preloadedState = {}) => {
  const history = ENV.BUILD_TARGET === 'client' ? createBrowserHistory() : createMemoryHistory();
  const middleware = applyMiddleware(...mw, routerMiddleware(history));
  const store = createStore(RootReducer, preloadedState, middleware);
  attachResizeListener(store);
  return { store, history: history };
};
