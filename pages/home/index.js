import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';

import s from './styles.css';
import { title, html } from './index.md';

import store from '../../core/store';
import history from '../../core/history';


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

  render() {
    return (<div ><button onClick={()=>this.handleOpenEditingPage()}>Test Editing Page</button></div>);
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
