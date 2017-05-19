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
      mode: "Home"
    }

    this.onModifyExperiment = this.modifyExperimentClicked.bind(this);
    this.onBack = this.backClicked.bind(this);
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

  modifyExperimentClicked(){
    this.setState({
      mode: "ModifyExperiment"
    });
  }

  backClicked(){
    this.setState({
      mode: "Home"
    });
  }

  render() {
    let buttons = null;
    switch(this.state.mode){
      case "Home":{
        buttons =
          <div className={s.buttonsWrapper}>
            <button className={s.button} onClick={this.onModifyExperiment}>Modify Experiment</button>
            <button className={s.button} onClick={()=>this.handleOpenExperimentPage()}>Run Experiment</button>
          </div>;
        break;
      }
      case "ModifyExperiment":{
        buttons =
          <div className={s.buttonsWrapper}>
              <button className={s.button} onClick={()=>this.handleOpenEditingPage()}>Edit Areas Of Interest</button>
              <button className={s.button} onClick={()=>this.handleOpenQuestionPage()}>Add New Questions</button>
              <button className={s.button} onClick={this.onBack}>Back</button>
          </div>;
        break;
      }
      default: {
        break;
      }
    }

    return (
      <Layout><div className={s.container}>
        {buttons}
        <button className={s.fullscreenButton} onClick={()=>this.toggleFullscreen()}>Fullscreen</button>
    </div></Layout>
    );
  }

  // <div className={s.buttonsWrapper}>
  //   <button className={s.button} onClick={()=>this.handleOpenExperimentPage()}>Start New Experiment</button>
  //   <button className={s.button} onClick={()=>this.handleOpenEditingPage()}>Edit Areas Of Interest</button>
  //   <button className={s.button} onClick={()=>this.handleOpenQuestionPage()}>Add New Questions</button>
  // </div>

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
