import React, { PropTypes } from 'react';
import s from './styles.css';

import openImageIcon from '../../resources/icons/open_icon.png';
import saveImageIcon from '../../resources/icons/save_icon.png';
import newAOIIcon from '../../resources/icons/plus_icon.png';
import deleteAOIIcon from '../../resources/icons/delete_icon.png';
import editAOIIcon from '../../resources/icons/edit_icon.png';

/*******************************************************
                      TOOLBOX BUTTONs
********************************************************/
class ToolBoxButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<button className={s.toolBoxButton} onClick={this.props.onClickHanlder}>
      <img className={s.toolBoxButtonIcon} src={this.props.icon}/>
    </button>);
  }
}
ToolBoxButton.propTypes = {
  icon: React.PropTypes.object.isRequired,
  onClickHanlder: React.PropTypes.object.isRequired
};

/*******************************************************
                          TOOLBOX
********************************************************/
class ToolBox extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOpenNewImage() {
    this.refs['fileUploader'].click();
  }

  handleSaveImage() {

  }

  handleNewAOI() {

  }

  handleDeleteAOI() {

  }

  handleEditAOI() {

  }

  render() {
    return (<div>
      <ToolBoxButton icon={openImageIcon} onClickHanlder={()=>this.handleOpenNewImage()}/>
      <ToolBoxButton icon={saveImageIcon} onClickHanlder={()=>this.handleSaveImage()}/>
      <ToolBoxButton icon={newAOIIcon} onClickHanlder={()=>this.newAOIIcon()}/>
      <ToolBoxButton icon={deleteAOIIcon} onClickHanlder={()=>this.deleteAOIIcon()}/>
      <ToolBoxButton icon={editAOIIcon} onClickHanlder={()=>this.editAOIIcon()}/>
      <input type="file" ref="fileUploader" accept="image/*" className={s.fileUploader}/>
    </div>);
  }
}
ToolBox.propTypes = {

};

/*******************************************************
                      LIST OF AOIs
********************************************************/
class ListOfAOIs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div/>);
  }
}
ListOfAOIs.propTypes = {

};

/*******************************************************
                       DISPLAYED AOI
********************************************************/
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

/*******************************************************
                      IMAGE CONTAINER
********************************************************/
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

/*******************************************************
                      AOI EDITING PAGE
********************************************************/
class AOIEditingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  handleChange() {

  }

  render() {
    return (<div className={s.page}>
      <div className={s.leftPanel}>
        <ToolBox/>
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
