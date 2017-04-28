import React, { PropTypes } from 'react';
import s from './GazeCursor.css';

import store from '../../core/store';

var key = require('keymaster');

class GazeCursor extends React.Component {
  constructor(){
    super();
    this.state = {
      visibile: true,
      locX: 0,
      locY: 0
    }
    this.handleCursorVisibility = this.toggleVisibility.bind(this);
    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);
    this.cursorRadius = 40;
  }

  componentDidMount() {
    key.setScope('stimuli');
    key('g', this.handleCursorVisibility);
    this.timer = setInterval(this.handleGazeLocUpdate, 2); //Update the gaze cursor location every 8ms
  }

  componentWillUnmount(){
    clearInterval(this.timer);
    key.unbind('g');
  }

  render() {
    let cursor = null;
    if(this.state.visible){
      cursor = <div className={s.gazeCursor} id="gazeCursorDiv"/>;
    }

    return (
      cursor
    );
  }

  updateCursorLocation(){
    let gazeLoc = store.getState().gazeData;

    //Only draw the cursor if it is visible
    if(this.state.visible){
      var cursorDiv = document.getElementById("gazeCursorDiv");
      cursorDiv.style.left = gazeLoc.locX+'px';
      cursorDiv.style.top = gazeLoc.locY+'px';
      cursorDiv.style.width = "80px";
      cursorDiv.style.height = "80px";
    }

    this.setState({
      locX: gazeLoc.locX,
      locY: gazeLoc.locY
    })
  }

  toggleVisibility(){
    console.log("Gaze cursor visibility: " + !this.state.visible);
    this.setState(
      {
        visible: !this.state.visible
      }
    );
  }
}

export default GazeCursor;
