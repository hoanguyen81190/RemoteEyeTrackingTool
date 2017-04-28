import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  trueKey: "z",
  falseKey: "x",
  alarmKey: "space",
  instructionsKey: "enter",
  hsiOrder: null,
  hsiData: null,
  gazeData: {
    locX: 0,
    locY: 0
  }
};

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case 'SET_INPUT_KEYS':
      return { ...state, trueKey: action.trueKey,
        falseKey: action.falseKey,
        alarmKey: action.alarmKey,
        instructionsKey: action.instructionsKey};
    case 'SET_HSI_ORDER':
      return { ...state, hsiOrder: action.hsiOrder};
    case 'SET_HSI_DATA':
      return { ...state, hsiOrder: action.hsiData};
    case 'SET_GAZE_DATA':
      return { ...state, gazeData: action.gazeData};
    default:
      return state;
  }
});



export default store;
