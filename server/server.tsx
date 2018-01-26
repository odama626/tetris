import * as express from 'express';
import compression from 'compression';
import * as serveStatic from 'serve-static';
import {
  discernMobile,
  discernFile,
  renderApp,
  renderHtml,
  desktopStateStub
} from './Utils';
import createStore from '../assets/components/Store';

const app = express();

app.use('/res', serveStatic('assets/res'));
app.use('/res', serveStatic('bin/'));
app.use(discernFile);
app.use(discernMobile);

app.get('/*', (req, res) => {
  // Work around to allow sending files
  if (!req.render_page) return res.send('');
  console.log(req.url);

  let initialState: any = req.mobile_client ? { Home: {} } : desktopStateStub;
  let siteData = {};
  // fetch(ENV.backendApi+'/site/load?url=wwmach.com')
  // .then(res => res.json())
  // .then(siteData => {
  // console.log(siteData);
  initialState.Home = {
    ...initialState.Home,
    initialData: siteData
  };
  let { store, history } = createStore(initialState);
  let application = renderApp(req.url, store);
  let preloadState = store.getState();

  res.send(renderHtml(application, preloadState));
  // })
});
export default app;
