import 'isomorphic-fetch';
import Actions from '../components/Login/Actions';

import { ENV } from '../../config/env';

export default store => next => action => {
  if (typeof action.type ==='undefined' || typeof action.url === 'undefined') return next(action);

  let state = store.getState();

  let [ pendingType, successType, errorType ] = action.type;

  let {
    url,
    method = 'get',
    contentType = 'application/json',
    query = {},
    data = {},
    then
  } = action;

  let req = {
    headers: {'Content-Type': contentType},
    method,
  }

  let token = window.localStorage.getItem(ENV.authToken);

  if (method.toLowerCase() === 'post') {
    req['body'] = JSON.stringify(data);
  }

  if (url.indexOf('://') < 0) {
    url = ENV.apiRoot + url;
    if (token) {
      req.headers['Authorization'] = token;
    }
  }

  next({ type: pendingType, meta: action.meta })

  if (ENV.DEPLOY_TARGET === ENV.TARGET_DEV) {
    console.log("sending fetch", url, req);
  }

  fetch(url, req)
  .then(r => {
    if (r.status === 401) {
        window.localStorage.removeItem(ENV.authToken);
        // TODO redirect to login page here
    }
    if (!r.ok) {
      throw r;
    }
    if (r.ok && successType === Actions.LOGIN.SUCCESS && r.headers.has("Authorization")) {
      window.localStorage.setItem(ENV.authToken, r.headers.get("Authorization") || '');
      return;
    }
    return r.json();
  })
  .then(data => {
    next((dispatch, getState) => {
      dispatch({ type: successType, data, meta: action.meta});
      if (then) dispatch(then);
    })
  }).catch(e => {
    next({
      type: errorType,
      error: e,
      meta: action.meta
    })
    return;
  })
}