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
    this.isCreatingNewAOI = false;
  }

  _onImageChange() {

  }
  _onAOIChange() {

  }

  getIsCreatingNewAOI() {
    return this.isCreatingNewAOI;
  }

  toggleIsCreatingNewAOI() {
    this.isCreatingNewAOI = !this.isCreatingNewAOI;
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
    EditingPageStore.toggleIsCreatingNewAOI();
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
      <ToolBoxButton icon={newAOIIcon} onClickHandler={()=>this.handleNewAOI()}/>
      <ToolBoxButton icon={deleteAOIIcon} onClickHandler={()=>this.handleDeleteAOI()}/>
      <ToolBoxButton icon={editAOIIcon} onClickHandler={()=>this.handleEditAOI()}/>
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
    this.state = {
      top: props.top,
      left: props.left,
      width: props.width,
      height: props.height
    }
  }

  setPosition(top, left) {
    this.setState({top: top, left: left});
  }
  setSize(width, height) {
    this.setState({width: width, height: height});
  }

  getPosition() {
    return {top: this.state.top, left: this.state.left};
  }

  getInformation() {
    return {top: this.state.top, left: this.state.left, width: this.state.width, height: this.state.height};
  }

  reset() {
    this.setState({
      top: 0,
      left: 0,
      width: 0,
      height: 0
    });
  }

  setInformation(style) {
    this.setState({
      top: style.top,
      left: style.left,
      width: style.width,
      height: style.height
    });
  }

  render() {
    var style = this.props.visible ? (s.AOIRectangle) : (s.AOIRectangle + ' ' + s.hiddenAOIRectangle);
    return (<div className={style}
      style={{top: this.state.top + 'px', left: this.state.left + 'px', width: this.state.width + 'px', height: this.state.height + 'px'}}/>);
  }
}
AOIOnImage.propTypes = {

};

/*******************************************************
                      IMAGE CONTAINER
********************************************************/
const NEWAOI_MOUSEDOWN = 'newaoi_mousedown';
const NEWAOI_MOUSEMOVING = 'newaoi_mousemoving';
const NEWAOI_MOUSEUP = 'newaoi_mouseup';
const NEWAOI_HIDDEN = 'newaoi_hidden';
class ImageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newaoi: NEWAOI_HIDDEN,
      listOfAOIs: []
    };

    this.AIOTopLeft = null;
    this.AIOWH = null;

    this.onImageChange = this._onImageChange.bind(this);
    this.onStartNewAOI = this._onStartNewAOI.bind(this);
    this.onDrawNewAOI = this._onDrawNewAOI.bind(this);
    this.onEndNewAOI = this._onEndNewAOI.bind(this);
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

  _onStartNewAOI(event) {

    this.setState({newAOI: NEWAOI_MOUSEDOWN});
    let top = event.nativeEvent.offsetY;
    let left = event.nativeEvent.offsetX;
    let newAOI = this.refs["newAOIRef"];
    if(newAOI) {
      newAOI.setPosition(top, left);
    }
    this.AIOTopLeft = {top: top, left: left}
    event.preventDefault();
  }

  _onDrawNewAOI(event) {
    if(this.state.newAOI === NEWAOI_MOUSEDOWN) {
      var top = event.nativeEvent.offsetY;
      var left = event.nativeEvent.offsetX;

      let newAOI = this.refs["newAOIRef"];
      if(newAOI) {
        let position = newAOI.getPosition();
        newAOI.setSize(left - position.left, top - position.top);
      }
    }
    event.preventDefault();
  }

  _onEndNewAOI(event) {
    this.setState({newAOI: NEWAOI_MOUSEUP});
    // var top = event.nativeEvent.offsetY;
    // var left = event.nativeEvent.offsetX;
    // this.AIOWH = {width: left - position.left, height: top - position.top};

    var info = this.refs["newAOIRef"].getInformation();
    this.refs["newAOIRef"].reset();
    this.state.listOfAOIs.push(info);
    var newAOI = document.getElementById("newAOIEle");
    this.setState({listOfAOIs: this.state.listOfAOIs});
    event.preventDefault();
  }

  render() {
    let img = this.state.image;
    var style = EditingPageStore.getIsCreatingNewAOI() ? (s.dragAndDropArea) : (s.normalArea);
    if(img) {
      var newAOI = this.state.newAOI === NEWAOI_MOUSEDOWN ? <AOIOnImage ref="newAOIRef" visible="true"/> : <AOIOnImage ref="newAOIRef" visible="false"/>;
    return (<div className={style}>
        <img className={s.image} src={img}
          ref="imageRef"
          onMouseDown={this.onStartNewAOI}
          onMouseMove={this.onDrawNewAOI}
          onMouseUp={this.onEndNewAOI}/>
        {newAOI}
        {this.state.listOfAOIs.map((item, index) => {
          return <AOIOnImage top={item.top} left={item.left} width={item.width} height={item.height} visible="false"/>
        })}
      </div>);
    }
    else {
      return (<div  className={style}/>);
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
