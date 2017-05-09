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

  componentDidMount() {
    document.title = "Eyetracking Tool";
  }

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
      <Layout><div className={s.container}>
        <div className={s.buttonsWrapper}>
          <button className={s.button} onClick={()=>this.handleOpenEditingPage()}>Test Editing Page</button>
          <button className={s.button} onClick={()=>this.handleOpenExperimentPage()}>Test Experiment Page</button>
        </div>
        <button className={s.fullscreenButton} onClick={()=>this.toggleFullscreen()}>Fullscreen</button>
    </div></Layout>
    );
  }

  toggleFullscreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
     (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
}
HomePage.propTypes = {

};

export default HomePage;
