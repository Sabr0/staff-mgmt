import { combineReducers } from 'redux';
import users from './users';
import curUser from './curUser';
import curDR from './curDR';

const reducers = combineReducers({
  users,
  curUser,
  curDR,
});

export default reducers;
