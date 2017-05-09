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
      widthRatio: 1,
      heightRatio: 1,
      visibleStyle: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      }
    }

    this.name = this.props.name;

    //TODO tune this parameter
    this.activationThreshold = 150; //100 ms activation threshold so saccades do not activate the AOI
    this.activationTimer = 0;

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

  setContainerSizeBox(wr, hr, w, h, t, l) {
    this.containerSizeBox = {
      width: w,
      height: h
    };
    var left = this.props.topLeftX*wr*w/100 + l;
    var top = this.props.topLeftY*hr*h/100 + t;
    var width = this.props.width*wr*w/100;
    var height = this.props.height*hr*h/100;

    this.setState({visibleStyle: {
      top: top,
      left: left,
      width: width,
      height: height
    }});
  }

  render() {
    let divStyle;
    if(this.state.visible){
      let visStyle = {
        top: this.state.visibleStyle.top + 'px',
        left: this.state.visibleStyle.left + 'px',
        width: this.state.visibleStyle.width + 'px',
        height: this.state.visibleStyle.height + 'px'
      };

      divStyle = visStyle;
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

      let gazePathAction =
      {
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

      console.log("OnExitAOI");
      console.log(this.activationTimer);

      this.props.gazeDataCallback(gazePathAction)
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

    if(result.inside){
      this.addedFixationPoints.locX += gazeLoc.locX;
      this.addedFixationPoints.locY += gazeLoc.locY;
      this.numberOfFixationPoints ++;
      this.activationTimer += DeltaTime;
    }

    return result;
  }

  isActive(){
    return this.state.active;
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


      let closestX = Math.max(this.state.visibleStyle.left, Math.min((this.state.visibleStyle.left+this.state.visibleStyle.width), location.locX));//-gazeRadius));
      let closestY = Math.max(this.state.visibleStyle.top, Math.min((this.state.visibleStyle.top+this.state.visibleStyle.height), location.locY));//-gazeRadius));

      // Calculate the distance between the circle's center and this closest point
      let distanceX = location.locX - closestX;
      let distanceY = location.locY - closestY;

      // If the distance is less than the circle's radius, an intersection occurs
      let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

      if (distanceSquared < (gazeRadius * gazeRadius)) {
          inside = true;
      }

      let result = {
        inside: inside,
        distance: distanceSquared
      }

      return result;
  }
}

export default AOIComponent;
