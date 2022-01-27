import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';

export const rootReducer = combineReducers({
  firestore: firestoreReducer,
});
