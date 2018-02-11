import * as merge from 'mixin-deep';
import { findIn } from './Utils';

export default (namespace) => store => next => action => {
  if (typeof action.type === 'undefined' || typeof action.saveLocally === 'undefined')
    return next(action);

  next(action);
  let mergableState = findIn(store.getState(), action.saveLocally);
  save(namespace, mergableState);
};

export function save(namespace, update) {
  let currentStorage = load(namespace);
  let toStore = merge(currentStorage, update);
  console.log('save to local storage', toStore);
  localStorage.setItem(namespace, JSON.stringify(toStore));
}

export function load(namespace) {
  let storage = localStorage.getItem(namespace);
  if (!storage) return {};
  return JSON.parse(storage);
}

export function loadAndMerge(namespace, mergeTo) {
  return merge(mergeTo, load(namespace));
}
