import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
// const EventEmitter = require('events');
// class EventStore extends EventEmitter {
//   addFixationListener(callback) {
//     this.addListener('NEW FIXATION', callback);
//   }
//   removeFixationListener(callback) {
//     this.removeListener('NEW FIXATION', callback);
//   }
//   addNewFixation() {
//     this.emit('NEW FIXATION');
//   }
// }
// let eventStore = new EventStore();

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

  trialStartTimestamp: null
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
    case 'SET_TRIAL_START_TS': {
      console.log("STORE RECIEVED TIMESTAMP");
      return {...state, trialStartTimestamp: action.timestamp};
    }
    default:
      return state;
  }
});

export default store;
