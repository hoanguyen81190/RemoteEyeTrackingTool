import React, { PropTypes } from 'react';
import s from './AOIComponent.css';

import store from '../../core/store';

var key = require('keymaster');

class AOIComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: true,
      active: false,
    }

    //TODO tune this parameter
    this.activationThreshold = 100; //100 ms activation threshold so saccades do not activate the AOI
    this.activationTimer = 0;

    this.visibleStyle = {
      left: this.props.topLeftX+'px',
      top: this.props.topLeftY+'px',
      width: this.props.width+'px',
      height: this.props.height+'px',
    };

    this.hiddenStyle = {
      display: "hidden",
    }

    this.handleVisibilityUpdate = this.toggleVisibility.bind(this);

    this.addedFixationPoints = {
      locX: 0,
      locY: 0
    };
    this.numberOfFixationPoints = 0;

    this.eventStart = 0;
    this.eventEnd = 0;
    this.timeSinceBeginning = 0;
  }

  componentDidMount() {
    key("v", this.handleVisibilityUpdate);
  }

  componentWillUnmount(){
    key.unbind('v');
  }

  render() {
    let divStyle;
    if(this.state.visible){
      divStyle = this.visibleStyle;
    }
    else
    {
      divStyle = this.hiddenStyle;
    }

    let active = "";
    if(this.state.active){
      active = s.active;
    }
    else{
      active = s.inactive;
    }

    return (
      <div style={divStyle} className={s.aoi + " " + active}/>
    );
  }

  toggleVisibility(){
    this.setState(
      {
        visible: !this.state.visible
      }
    );
  }

  onEnter(){
    this.eventStart = this.timeSinceBeginning;
    this.setState({
      active: true,
    });
  }

  onExit(){
    this.eventEnd = this.timeSinceBeginning;

    if(this.activationTimer > this.activationThreshold){
      //TODO calculate fixation centroid instead of the average of the points
      let fixationLocX = parseFloat((this.addedFixationPoints.locX/this.numberOfFixationPoints).toFixed(1));
      let fixationLocY = parseFloat((this.addedFixationPoints.locY/this.numberOfFixationPoints).toFixed(1));

      let gazePathAction = {
        type: 'ADD_GAZE_PATH',
        gazePath: {
          category: "Fixation",
          eventStart: this.eventStart,
          eventEnd: this.eventEnd,
          eventDuration: this.eventEnd-this.eventStart,
          fixationPos: {
            posX: fixationLocX,
            posY: fixationLocY
          },
          aoiName: this.props.name,
          image: "-"
        }
      }
      store.dispatch(gazePathAction);

      console.log(store.getState().gazePath);
    }

    //Reset the state and the duration as it is no longer being looked at
    this.addedFixationPoints.locX = 0;
    this.addedFixationPoints.locY = 0;
    this.numberOfFixationPoints = 0;
    this.activationTimer = 0;
    this.eventStart = 0;
    this.eventEnd = 0;
    this.timeSinceBeginning = 0;
    this.setState({
      active: false,
    });
  }

  //Called from the timer in the StimuliComponent
  onTick(DeltaTime){
    this.timeSinceBeginning += DeltaTime;

    let gazeLoc = store.getState().gazeData;
    let result = this.isInside(gazeLoc);

    //If the AOI is not marked as looked at and the cursor is inside we call the on enter function
    if(result && !this.state.active){
      this.onEnter();
    }
    //If the AOI is marked as looked at and the cursor is outside we call the on exit function
    else if(!result && this.state.active){
      this.onExit();
    }

    if(result){
      this.addedFixationPoints.locX += gazeLoc.locX;
      this.addedFixationPoints.locY += gazeLoc.locY;
      this.numberOfFixationPoints ++;
      this.activationTimer += DeltaTime;
    }
  }

  /**
   * Check if the provided location is inside the bounding box. The method uses a circle against square collision test.
   * @param location The location to be checked.
   * @return true if the location is inside the AOI.
   */
  isInside(location) {
      let gazeRadius = store.getState().gazeCursorRadius;
      var inside = false;

      // Find the closest point to the circle within the rectangle
      let closestX = Math.max(this.props.topLeftX, Math.min((this.props.topLeftX+this.props.width), location.locX));//-gazeRadius));
      let closestY = Math.max(this.props.topLeftY, Math.min((this.props.topLeftY+this.props.height), location.locY));//-gazeRadius));

      // Calculate the distance between the circle's center and this closest point
      let distanceX = location.locX - closestX;
      let distanceY = location.locY - closestY;

      // If the distance is less than the circle's radius, an intersection occurs
      let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

      if (distanceSquared < (gazeRadius * gazeRadius)) {
          inside = true;
      }

      return inside;
  }
}

export default AOIComponent;
