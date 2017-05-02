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
  participantId: 0,
  gazeCursorRadius: 0,
  gazeData: {
    locX: 0,
    locY: 0
  },
  gazePath: [],
  keyResponses: []
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
    case 'SET_GAZE_RADIUS':
      return { ...state, gazeCursorRadius: action.gazeRadius};
    case 'ADD_GAZE_PATH':
      handleGazePath(state, action);
      return { ...state};
    case 'ADD_KEY_RESPONSE':
      handleKeyResponse(state, action);
      return { ...state};
    default:
      return state;
  }
});

function handleGazePath(state, action){
  if(state.gazePath.length > 0){
    let prevAction = state.gazePath[state.gazePath.length-1];
    console.log(prevAction);
    if(prevAction.category === "Fixation" && action.gazePath.category=== "Fixation"){
      let saccade = {
          category: "Saccade",
          eventStart: prevAction.eventEnd,
          eventEnd: action.gazePath.eventStart,
          eventDuration: action.gazePath.eventStart-prevAction.eventEnd,
          fixationPos: {
            posX: "-",
            posY: "-"
          },
          aoiName: "-",
          image: "-",
          participantId: state.participantId
      }
      state.gazePath.push(saccade);
    }
  }

  action.gazePath.participantId = state.participantId;
  state.gazePath.push(action.gazePath);
}

function handleKeyResponse(state, action){
  action.keyResponse.participantId = state.participantId;
  state.keyResponses.push(action.keyResponse);
}


export default store;
