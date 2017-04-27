import React, { PropTypes } from 'react';
import s from './BlackscreenComponent.css';
import plusIcon from '../../resources/icons/black_plus_icon.png'

// import { title, html } from './index.md';

class BlackScreen extends React.Component {



  // static propTypes = {
  //   articles: PropTypes.arrayOf(PropTypes.shape({
  //
  //   }).isRequired).isRequired,
  // };

  componentDidMount() {
    this.timer = setInterval(this.nextState, 1000);
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
    console.log("One second passed");
  }
}

export default BlackScreen;
