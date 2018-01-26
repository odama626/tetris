import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header/Header';
import Main from './Main';
import { Switch, Route } from 'react-router-dom';

import 'es6-promise/auto';

import '../scss/global.scss';

export class App extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div>
          <Header />
          <Main />
      </div>
    );
  }
}