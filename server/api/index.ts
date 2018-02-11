import * as express from 'express';
import * as http from 'http';
import { IEnvironment } from '../../config/env';
const env: IEnvironment = require('../../config/envLoader').node();
const app = express();

app.listen(env.apiPort, () => console.log('Tetris Api listening on port '+env.apiPort));


