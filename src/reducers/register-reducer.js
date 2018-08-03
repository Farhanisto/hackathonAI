import { REGISTER_USER, CLEAR_DISPLAY } from '../actions';

/* eslint-disable */
export default (state = {}, action) => {
  switch (action.type) {
  case REGISTER_USER:
    const finalData = {
      name: '',
      faceID: '',
      message: '',
      email: '',
    };

    if (action.payload.Errors) {
      finalData.message = 'error';
    } else if (action.payload.images['0'].transaction.status === 'success') {
      finalData.message = 'success';
      finalData.email = action.user;
    } else if (action.payload.images['0'].transaction.status === 'failure') {
      finalData.message = 'failure';
    }
    return finalData;
  case CLEAR_DISPLAY:
    return {};
  default:
    return state;
  }
};
