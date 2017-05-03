import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
  participantId: 0,

  gazeCursorRadius: 0,
  gazeData: {
    locX: 0,
    locY: 0
  }
};

const store = createStore((state = initialState, action) => {
  switch (action.type) {
    case 'SET_PARTICIPANT_ID':
      return { ...state, participantId: action.participantId};
    case 'SET_GAZE_RADIUS':
      return { ...state, gazeCursorRadius: action.gazeRadius};
    case 'SET_GAZE_DATA':{
      return { ...state, gazeData: action.gazeData};
    }
    default:
      return state;
  }
});

export default store;
