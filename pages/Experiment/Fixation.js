import React, { PropTypes } from 'react';
import s from './Fixation.css';

import store from '../../core/store';

var key = require('keymaster');

class Fixation extends React.Component {
  constructor(){
    super();
    this.state = {
      visibile: true,
      locX: 0,
      locY: 0,
      duration: 0,
      timestamp: 0
    }
    this.handleVisibility = this.toggleVisibility.bind(this);
    this.handleUpdate = this.updateData.bind(this);
    this.fixationRadius = 50;

    // let radiusAction = {
    //   type: 'SET_GAZE_RADIUS',
    //   gazeRadius: this.cursorRadius
    // }
    // store.dispatch(radiusAction);
  }

  componentDidMount() {
    key.setScope('stimuli');
    key('f', this.handleVisibility);
    this.timer = setInterval(this.handleUpdate, 4.5); //Update the gaze cursor location every 2ms
  }

  componentWillUnmount(){
    clearInterval(this.timer);
    key.unbind('f');
  }

  render() {
    let cursor = null;
    if(this.state.visible){
      cursor = <div className={s.fixation} id="fixationDiv"/>;
    }

    return (
      cursor
    );
  }

  updateData(){
    let fixation = store.getState().fixation;
    //Only draw the cursor if it is visible
    if(this.state.visible){
      var fixationDiv = document.getElementById("fixationDiv");
      let radius = fixation.duration/50;
      fixationDiv.style.left = (fixation.locX-radius)+'px';
      fixationDiv.style.top = (fixation.locY-radius)+'px';
      fixationDiv.style.width = radius*2+"px";
      fixationDiv.style.height = radius*2+"px";
    }

    this.setState({
      locX: fixation.locX,
      locY: fixation.locY,
      duration: fixation.duration,
      timestamp: fixation.timestamp
    })
  }

  toggleVisibility(){
    console.log("Fixation visibility: " + !this.state.visible);
    this.setState(
      {
        visible: !this.state.visible
      }
    );
  }
}

export default Fixation;
