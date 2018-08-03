import { RECOGNIZE_USER, CLEAR_DISPLAY } from '../actions';

/* eslint-disable */
export default (state = {}, action) => {
  switch (action.type) {
  case RECOGNIZE_USER:
    const finalData = {
      name: '',
      faceID: '',
      message: '',
    };

    if (action.payload.Errors) {
      finalData.message = 'error';
    } else if (action.payload.images['0'].transaction.status === 'success') {
      finalData.name = action.payload.images['0'].transaction.subject_id;
      finalData.faceID = action.payload.images['0'].transaction.face_id;
      finalData.message = 'success';
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
