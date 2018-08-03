import { combineReducers } from 'redux';

// calling the default reducer to create a link
import registerReducer from './register-reducer';
import recognizeReducer from './recognize-reducer';
import imagesReducer from './images-reducer';

const rootReducers = combineReducers({
  // add reducer files references here
  regData: registerReducer,
  detData: recognizeReducer,
  registeredUsers: imagesReducer,
});

export default rootReducers;
