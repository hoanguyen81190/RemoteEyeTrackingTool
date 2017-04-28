import React from 'react';
import Layout from '../../components/Layout';
import s from './index.css';

//The experiment components
import Instructions from './InstructionsComponent';
import BlackScreen from './BlackscreenComponent';
import Stimuli from './StimuliComponent';

//The gaze cursor
import GazeCursor from './GazeCursor';

// import wamp from '../../core/wamp';

class Experiment extends React.Component {

  // static propTypes = {
  //   articles: PropTypes.arrayOf(PropTypes.shape({
  //
  //   }).isRequired).isRequired,
  // };

  constructor() {
    super();

    this.handleStateUpdate = this.changeState.bind(this);

    this.state = {
      type: "Instructions",
      taskCounter: -1
    };
  }

  changeState(newState){

    switch(newState){
      case "Stimuli" : {
        this.setState({
          type: newState,
          taskCounter: this.state.taskCounter++
        });
        break;
      }
      case "default" : {
        this.setState({
          type: newState
        });
        break;
      }
    }

    console.log(newState);
    this.setState({
      type: newState
    });
  }

  componentDidMount() {

  }

  componentWillMount() {

  }

  render() {
    var componentToRender;

    switch(this.state.type){
      case "Instructions" : {
        componentToRender = <Instructions stateCallback={this.handleStateUpdate} instructions='Please determine if "Valve 1" is opened or closed'/>;
        break;
      }
      case "Blackscreen" : {
        componentToRender = <BlackScreen stateCallback={this.handleStateUpdate}/>;
        break;
      }
      case "Stimuli" : {
        componentToRender = <Stimuli stateCallback={this.handleStateUpdate} instructions='Please determine if "Valve 1" is opened or closed'/>;
        break;
      }
      case "default" : {
        componentToRender = null;
        break;
      }
    }

    return (
      <Layout>
        <GazeCursor />
        <div className={s.container}>{componentToRender}</div>

      </Layout>
    );
  }

}

export default Experiment;
