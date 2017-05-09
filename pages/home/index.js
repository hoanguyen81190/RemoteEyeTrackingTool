import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

import s from './styles.css';
import { title, html } from './index.md';

import store from '../../core/store';
import history from '../../core/history';

import excelData from '../../ExperimentDataExample.json';

class HomePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  // componentDidMount() {
  //   document.title = title;
  // }

  handleOpenEditingPage() {
    history.push('/AOIEditingPage');
  }

  handleOpenExperimentPage() {
    history.push('/Experiment');
  }

  handleOpenQuestionPage() {
    history.push('/QuestionEditingPage');
  }

  render() {
    return (
      <div >
        <button onClick={()=>this.handleOpenEditingPage()}>Editing Areas of Interest</button>
        <br/>
        <button onClick={()=>this.handleOpenQuestionPage()}>Add New Question</button>
        <br/>
        <button onClick={()=>this.handleOpenExperimentPage()}>Test Experiment Page</button>

      </div>);
  }

  // componentDidUpdate(prevProps, prevState){
  //
  // }

  // toggleFullscreen() {
  //   if ((document.fullScreenElement && document.fullScreenElement !== null) ||
  //    (!document.mozFullScreen && !document.webkitIsFullScreen)) {
  //     if (document.documentElement.requestFullScreen) {
  //       document.documentElement.requestFullScreen();
  //     } else if (document.documentElement.mozRequestFullScreen) {
  //       document.documentElement.mozRequestFullScreen();
  //     } else if (document.documentElement.webkitRequestFullScreen) {
  //       document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  //     }
  //   } else {
  //     if (document.cancelFullScreen) {
  //       document.cancelFullScreen();
  //     } else if (document.mozCancelFullScreen) {
  //       document.mozCancelFullScreen();
  //     } else if (document.webkitCancelFullScreen) {
  //       document.webkitCancelFullScreen();
  //     }
  //   }
  // }
}
HomePage.propTypes = {

};

export default HomePage;
