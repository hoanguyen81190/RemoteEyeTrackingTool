import React from 'react';
import s from './calibrationComponent.css';

import {publishEvent} from './wampPublisher';

//Used for the trial instructions
class CalibrationComponent extends React.Component {
  constructor(props){
    super(props);
    this.handleCalibration = this.onCalibration.bind(this);
  }

  onCalibration(){
    let calMethod;
    switch(document.getElementById("calMethod").value){
      case "best":{
        calMethod = 9;
        break;
      }
      case "balanced":{
        calMethod = 5;
        break;
      }
      case "fastest":{
        calMethod = 2;
        break;
      }
      default:{
        calMethod = 5;
        break;
      }
    }

    let animSpeed;
    switch(document.getElementById("animSpeed").value){
      case "fast":{
        animSpeed = 1;
        break;
      }
      case "normal":{
        animSpeed = 0;
        break;
      }
      default:{
        animSpeed = 0;
        break;
      }
    }

    let acceptMethod;
    switch(document.getElementById("acceptPoints").value){
      case "manually":{
        acceptMethod = 0;
        break;
      }
      case "semiauto":{
        acceptMethod = 1;
        break;
      }
      case "fullauto":{
        acceptMethod = 2;
        break;
      }
      default:{
        acceptMethod = 1;
        break;
      }
    }

    let selectedDisplay;
    switch(document.getElementById("selDisplay").value){
      case "display1":{
        selectedDisplay = 0;
        break;
      }
      case "display2":{
        selectedDisplay = 1;
        break;
      }
      default:{
        selectedDisplay = 0;
        break;
      }
    }

    let msg = [calMethod, animSpeed, acceptMethod, selectedDisplay];
    publishEvent('onCalibration', msg);
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.formWrapper}>
          <div className={s.calText}>Calibration Options</div>
          <div className={s.selectionOptions}>
            <div className={s.selectLabel}>Calibration Method
              <select className={s.selectOption} name="Calibration Method" id="calMethod">
                <option value="best">Best</option>
                <option value="balanced" defaultValue>Balanced</option>
                <option value="fastest">Fastest</option>
              </select>
            </div>
            <div className={s.selectLabel}>Animation Speed
              <select className={s.selectOption} name="Animation Speed" id="animSpeed">
                <option value="fast">Fast</option>
                <option value="normal" defaultValue>Normal</option>
              </select>
            </div>
            <div className={s.selectLabel}>Accept Points
              <select className={s.selectOption} name="Accept Points" id="acceptPoints">
                <option value="manually">Manually</option>
                <option value="semiauto" defaultValue>Semi-automatically</option>
                <option value="fullauto">Automatically</option>
              </select>
            </div>
            <div className={s.selectLabel}>Select Display
              <select className={s.selectOption} name="Select Display" id="selDisplay">
                <option value="display1" defaultValue>Display 1</option>
                <option value="display2">Display 2</option>
              </select>
            </div>
            <button className={s.calibrateButton} onClick={this.handleCalibration}>Calibrate</button>
        </div>

        </div>
      </div>
    );
  }
}

export default CalibrationComponent;
