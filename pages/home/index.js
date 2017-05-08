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

  testSaveExcel() {
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'save data',
          fileName: './public/experiment/test.xlsx',
          data: JSON.stringify(excelData)
      })
      // mode: 'no-cors'
    });
      fetch(request).then(function(response) {
        return response.json();
      }).then(function(j) {
        console.log(j);
      });
  }

  render() {
    return (
      <div >
        <button onClick={()=>this.handleOpenEditingPage()}>Test Editing Page</button>
        <br/>
        <button onClick={()=>this.handleOpenExperimentPage()}>Test Experiment Page</button>
        <br/>
        <button onClick={()=>this.testSaveExcel()}>Test Save Excel Data</button>
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
