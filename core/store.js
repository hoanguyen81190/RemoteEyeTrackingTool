import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  trueKey: "z",
  falseKey: "x",
  alarmKey: "space",
  instructionsKey: "enter",
};

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case 'SET_INPUT_KEYS':
      return { ...state, trueKey: action.trueKey,
        falseKey: action.falseKey,
        alarmKey: action.alarmKey,
        instructionsKey: action.instructionsKey};
    default:
      return state;
  }
});



export default store;
