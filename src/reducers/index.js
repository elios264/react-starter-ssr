//import {combineReducers} from 'redux';

export const rootReducer = (state = { message: '' }, action) => {

  switch (action.type) {
    case 'SET_EMOJI': return { message: action.message };
    default: return state;
  }

};