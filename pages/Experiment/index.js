import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './index.css';
import BlackScreen from './BlackscreenComponent';
import wamp from '../../core/wamp.js';

class Experiment extends React.Component {

  // static propTypes = {
  //   articles: PropTypes.arrayOf(PropTypes.shape({
  //
  //   }).isRequired).isRequired,
  // };

  componentDidMount() {

  }

  render() {
    return (
      <Layout>
        <div className={s.container}><BlackScreen /></div>
      </Layout>
    );
  }

}

export default Experiment;
