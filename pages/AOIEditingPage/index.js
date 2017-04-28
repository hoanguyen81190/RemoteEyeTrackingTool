import React, { PropTypes } from 'react';
import s from './styles.css';
const EventEmitter = require('events');

import openImageIcon from '../../resources/icons/open_icon.png';
import saveImageIcon from '../../resources/icons/save_icon.png';
import newAOIIcon from '../../resources/icons/plus_icon.png';
import deleteAOIIcon from '../../resources/icons/delete_icon.png';
import editAOIIcon from '../../resources/icons/edit_icon.png';

const IMAGE_CHANGE_EVENT = 'imageChanged';
const AOI_CHANGE_EVENT = 'aoiChanged';
class CEditingPageStore extends EventEmitter {
  constructor() {
    super();
    this.addImageChangeListener(this._onImageChange);
    this.addAOIChangeListener(this._onAOIChange);
    this.image = null;
    this.AOIs = [];
  }

  _onImageChange() {

  }
  _onAOIChange() {

  }

  getImage() {
    return this.image;
  }

  addImageChangeListener(callback) {
    this.addListener(IMAGE_CHANGE_EVENT, callback);
  }
  addAOIChangeListener(callback) {
    this.addListener(AOI_CHANGE_EVENT, callback);
  }

  removeImageChangeListener(callback) {
    this.removeListener(IMAGE_CHANGE_EVENT, callback);
  }
  removeAOIChangeListener(callback) {
    this.removeListener(AOI_CHANGE_EVENT, callback);
  }

  emitImageChange(img) {
    if(img) {
      this.image = img;
      this.emit(IMAGE_CHANGE_EVENT);
    }
  }
  addAOI(AOI) {
    this.AOIs.push(AOI);
    this.emit(AOI_CHANGE_EVENT);
  }
  deleteAOI(AOI) {
    this.AOIs.remove(AOI);
    this.emit(AOI_CHANGE_EVENT);
  }
  editAOI(AOI) {
    this.emit(AOI_CHANGE_EVENT);
  }
}

/*******************************************************
                      TOOLBOX BUTTONs
********************************************************/
class ToolBoxButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.onClickHandler);
    return (<button className={s.toolBoxButton} onClick={this.props.onClickHandler}>
      <img className={s.toolBoxButtonIcon} src={this.props.icon}/>
    </button>);
  }
}
ToolBoxButton.propTypes = {
  icon: React.PropTypes.object.isRequired,
  onClickHandler: React.PropTypes.function
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

  handleChosenFile(args) {
    if(args.target.files && args.target.files[0]) {
      var reader = new FileReader();
      reader.onloadend = function () {
        EditingPageStore.emitImageChange(reader.result);
      };

      reader.readAsDataURL(args.target.files[0]);
    }
  }

  render() {
    return (<div>
      <ToolBoxButton icon={openImageIcon} onClickHandler={()=>this.handleOpenNewImage()}/>
      <ToolBoxButton icon={saveImageIcon} onClickHandler={()=>this.handleSaveImage()}/>
      <ToolBoxButton icon={newAOIIcon} onClickHandler={()=>this.newAOIIcon()}/>
      <ToolBoxButton icon={deleteAOIIcon} onClickHandler={()=>this.deleteAOIIcon()}/>
      <ToolBoxButton icon={editAOIIcon} onClickHandler={()=>this.editAOIIcon()}/>
      <input type="file" ref="fileUploader" accept="image/*"
        onChange={this.handleChosenFile}
        className={s.fileUploader}/>
    </div>);
  }
}
ToolBox.propTypes = {

};

/*******************************************************
                      LIST OF AOIs
********************************************************/
class AOIProperties extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div/>);
  }
}
AOIProperties.propTypes = {

};

/*******************************************************
                       DISPLAYED AOI
********************************************************/
class AOIOnImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div/>);
  }
}
AOIOnImage.propTypes = {

};

/*******************************************************
                      IMAGE CONTAINER
********************************************************/
class ImageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };

    this.onImageChange = this._onImageChange.bind(this);
  }

  componentDidMount() {
    EditingPageStore.addImageChangeListener(this.onImageChange);
  }

  componentWillUnmount() {
    EditingPageStore.removeImageChangeListener(this.onImageChange);
  }

  _onImageChange() {
    this.setState({image: EditingPageStore.getImage()});
  }

  render() {
    let img = this.state.image;
    if(img) {
      return (<div>
        <img className={s.image} src={img}/>
      </div>);
    }
    else {
      return (<div/>);
    }
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

let EditingPageStore = new CEditingPageStore();
export default AOIEditingPage;
