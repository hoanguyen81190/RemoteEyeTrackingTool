import React, { PropTypes } from 'react';
import s from './BlackscreenComponent.css';
import plusIcon from '../../resources/icons/black_plus_icon.png'
import blackscreenData from '../../public/experiment/blackscreen_data.json'

// import { title, html } from './index.md';

class BlackScreen extends React.Component {

  constructor(){
    super();
    this.handleNextState = this.nextState.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.handleNextState, blackscreenData.timeMS);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
   }

  render() {
    return (
      <div className={s.container}>
        <img src={plusIcon} className={s.pluss} alt="plus"/>
      </div>
    );
  }

  nextState(){
    clearInterval(this.timer);
    this.props.stateCallback("Stimuli");
    return false; //Prevents bubbling of the event
  }
}

export default BlackScreen;
