export default store => next => action => {
  if (
    typeof action.type === 'undefined' ||
    action.saveLocally !== true ||
    typeof action.namespace === 'undefined'
  )
    return next(action);

  next(action);
};
