const EventEmitter = require('events');

const PICK_TRIAL = 'pick trial';
const PICK_BLOCK_INSTRUCTIONS = 'pick block instructions';
class EventSystem extends EventEmitter {
  constructor() {
    super();
    this.pickedTrial = null;
    this.blockInstructions = null;
    // this.editedQuestion = null;
    this.refID = null;
  }

  addPickTrialListener(callback) {
    this.addListener(PICK_TRIAL, callback);
  }

  removePickTrialListener(callback) {
    this.removeListener(PICK_TRIAL, callback);
  }

  pickTrial(trial) {
    this.pickedTrial = trial;
    this.emit(PICK_TRIAL);
  }

  setActiveRefID(refID, className){
    console.log(this.refID);
    if(this.refID !== null){
      let prevActive = document.getElementById(this.refID);
      if(prevActive){
        console.log("classname removed");
        prevActive.classList.remove(className);
      }
    }

    let newActive = document.getElementById(refID);
    if(newActive){
      newActive.classList.add(className);
    }
    this.refID = refID;
  }

  getPickedTrial() {
    return this.pickedTrial;
  }

  addPickBIListener(callback) {
    this.addListener(PICK_BLOCK_INSTRUCTIONS, callback);
  }

  removePickBIListener(callback) {
    this.removeListener(PICK_BLOCK_INSTRUCTIONS, callback);
  }

  pickBI(blockInstructions) {
    console.log('pick BI', blockInstructions);
    this.blockInstructions = blockInstructions;
    this.emit(PICK_BLOCK_INSTRUCTIONS);
  }

  getEditedBlockInstruction() {
    return this.blockInstructions;
  }
}

let eventSystem = new EventSystem();
export default eventSystem;
