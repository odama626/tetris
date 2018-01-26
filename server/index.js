import http from 'http';
import app from './server';

const server = http.createServer(app);
const port = ENV.port;

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));

if (module.hot) {
  let currentApp = app;
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}