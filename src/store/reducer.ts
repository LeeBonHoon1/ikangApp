import {combineReducers} from 'redux';

import userSlice from '../slices/user';
import firebaseSlice from '../slices/firebase';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  firebase: firebaseSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
