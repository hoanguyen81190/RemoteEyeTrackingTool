const EventEmitter = require('events');

const PICK_TRIAL = 'pick trial';
const PICK_BLOCK_INSTRUCTIONS = 'pick block instructions';
const RELOAD_PAGE = 'reload page';
class EventSystem extends EventEmitter {
  constructor() {
    super();
    this.pickedTrial = null;
    this.blockInstructions = null;
    // this.editedQuestion = null;
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

  addReloadPageListener(callback) {
    this.addListener(RELOAD_PAGE, callback);
  }

  removeReloadPageListener(callback) {
    this.removeListener(RELOAD_PAGE, callback);
  }

  reloadPage() {
    this.emit(RELOAD_PAGE);
  }
}

let eventSystem = new EventSystem();
export default eventSystem;
