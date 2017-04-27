import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import { title, html } from './index.md';

// let openImageIcon = '../../resources/icon/open_icon.png';
// let saveImageIcon = '../../resources/icon/save_icon.png';
// let newAOIIcon = '../../resources/icon/plus_icon.png';
// let deleteAOIIcon = '../../resources/icon/delete_icon.png';
// let editAOIIcon = '../../resources/icon/edit_icon.png';

/**********************************************************
                        TOOLBOX BUTTON
***********************************************************/
class ToolBoxButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<button className={s.toolBoxButton}>
      <img className={s.toolBoxButtonIcon} src={this.props.icon}/>
    </button>);
  }
}
ToolBoxButton.propTypes = {
  icon: React.PropTypes.object
};

/**********************************************************
                           TOOLBOX
***********************************************************/
class ToolBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>

      </div>);
  }
}
ToolBox.propTypes = {

};

/**********************************************************
                        LIST OF AOIs
***********************************************************/
class ListOfAOIs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div/>);
  }
}
ListOfAOI.propTypes = {

};

/**********************************************************
                        ALARM EDITTING
***********************************************************/
class AlarmEditing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div/>);
  }
}
AlarmEditing.propTypes = {

};

/**********************************************************
                        DISPLAYED AOI
***********************************************************/
class DisplayedAOI extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div/>);
  }
}
DisplayedAOI.propTypes = {

};

/**********************************************************
                        IMAGE CONTAINER
***********************************************************/
class ImageContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div/>);
  }
}
ImageContainer.propTypes = {

};

/**********************************************************
                        AOI EDITING PAGE
***********************************************************/
class AOIEdittingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = title;
  }

  render() {
    console.log("Editing page");
    return (<div>HELLO
      <div className={s.leftPanel}>
        <ToolBox />
      </div>
      <div className={s.rightPanel}>
        <ImageContainer />
      </div>
      </div>
    );
  }

}
AOIEditingPage.propTypes = {

};

export default AOIEditingPage;
