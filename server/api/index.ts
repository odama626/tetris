import * as express from 'express';
import * as passport from 'passport';
import * as mongoose from 'mongoose';

import User from './models/User';

const env: IEnvironment = require('../../config/envLoader').node();

// Setup database connection
mongoose.connect(env.MONGO_URL);


// Set up passport strategy
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const app = express();

app.listen(env.apiPort, () => console.log('Tetris Api listening on port '+env.apiPort));

