import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home/Home';
// import Login from './Login/Login';
import Preferences from './Preferences/Preferences';
import P404 from './404/404';

// import VariableRoutes from './VariableRoutes';

export default class Main extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div className="mainContent">
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route path="/login" component={Login} /> */}
          <Route path="/preferences" component={Preferences} />

          {/* <Route path='*' component={P403}/> */}
          <Route component={P404} />
        </Switch>
      </div>
    );
  }
}
