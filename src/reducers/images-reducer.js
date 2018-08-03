import { ALL_IMAGES } from '../actions';

/* eslint-disable */
export default (state = {}, action) => {
  switch (action.type) {
  case ALL_IMAGES:
    return action.payload;
  default:
    return state;
  }
};
