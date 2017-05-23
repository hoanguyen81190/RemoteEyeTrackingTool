import { createStore } from 'redux';

const initialState = {
  participantId: 0,

  gazeCursorRadius: 0,
  gazeData: {
    locX: 0,
    locY: 0
  },
  fixation: {
    locX: 0,
    locY: 0,
    duration: 0,
    timestamp: 0
  },

  widthRatio: 1,
  heightRatio: 1,

  trialStartTimestamp: null,

  calibrationAccuracy: {
    calX: -1,
    calY: -1
  },

  calibrationComponent: null,
  calibrationSettings: {
    calMethod: "best",
    animSpeed: "fast",
    accPoints: "semiauto",
    display: "display2"
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
    case 'SET_FIXATION_DATA':{
      return { ...state, fixation: action.fixation};
    }
    case 'SET_AOI_RATIOS': {
      return {...state, widthRatio: action.widthRatio, heightRatio: action.heightRatio};
    }
    case 'SET_CAL_COMP': {
      return {...state, calibrationComponent: action.calComp};
    }
    case 'SET_TRIAL_START_TS': {
      console.log("STORE RECIEVED TIMESTAMP");
      return {...state, trialStartTimestamp: action.timestamp};
    }
    case 'SET_CALIBRATION_SETTINGS': {
      return {...state, calibrationSettings: action.calibrationSettings};
    }
    case 'SET_CALIBRATION_RESULT': {
      if(state.calibrationComponent){
        state.calibrationComponent.setAccuracyResult(action.calResult);
      }
      return {...state, calibrationAccuracy: action.calResult};
    }
    default:
      return state;
  }
});

export default store;
