import * as React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { App } from '../assets/components/index';
import { renderToString } from 'react-dom/server';
import Tags from './HtmlTags';

export const discernFile = (req, res, next) => {
  let r = /(\/)(?!.*\/).*/g;
  let match = r.exec(req.originalUrl);
  req.render_page = !(match && match[0].indexOf('.') > 0);
  next();
};

export const discernMobile = (req, res, next) => {
  req.mobile_client = req.headers['user-agent'].includes('Mobi');
  next();
};

export const renderApp = (url, store) =>
  renderToString(
    <Provider store={store}>
      <StaticRouter location={url} context={{}}>
        <App />
      </StaticRouter>
    </Provider>
  );

export const renderHtml = (app, state) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>title</title>
      ${Tags.styles}
    </head>
    <body>
    <div id='root'>${app}</div>
    <script>
      window.__preload_state__ = ${JSON.stringify(state).replace(
        /</g,
        '\u003c'
      )}
    </script>
    ${Tags.scripts}
    </body>
  </html>
`;

export const desktopStateStub = { bounds: { width: 1300 } };
