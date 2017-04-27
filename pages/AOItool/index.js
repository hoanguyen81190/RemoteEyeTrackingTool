import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import { title, html } from './index.md';

class AOIEditingPage extends React.Component {

  static propTypes = {
    articles: PropTypes.arrayOf(PropTypes.shape({

    }).isRequired).isRequired,
  };

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (

    );
  }

}

export default AOIEditingPage;
