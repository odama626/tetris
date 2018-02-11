import * as React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { App } from '../assets/components/index';
import { ConnectedRouter } from 'react-router-redux';
import createStore from '../assets/components/Store';
import { Provider } from 'react-redux';
import DefaultInput from './DefaultInput';
import { loadAndMerge } from '../assets/utils/LocalStorage';

declare var module;
declare var window;

const preloadedState = loadAndMerge(
  ENV.STORAGE_NAMESPACE,
  window.__preload_state__
);
delete window.__preload_state__;

const { store, history } = createStore(preloadedState);
DefaultInput(store);

function rerender() {
  hydrate(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

if (module.hot) {
  module.hot.accept('../assets/components/index', rerender);
}

rerender();
