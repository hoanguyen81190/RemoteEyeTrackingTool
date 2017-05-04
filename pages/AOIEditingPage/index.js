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
const TOGGLE_CREATING_AOI = 'toggleCreatingAOI';
const PICKING_AOI = 'pickAOI';
const EDIT_MODE = 'EDIT_MODE';
const DELETE_MODE = 'DELETE_MODE';
const NONE_MODE = 'NONE';

class CEditingPageStore extends EventEmitter {
  constructor() {
    super();
    this.addImageChangeListener(this._onImageChange);
    this.addAOIChangeListener(this._onAOIChange);
    this.addToggleCreatingAOI(this._onToggleCreatingAOI);
    this.image = null;
    this.AOIs = [];
    this.isCreatingNewAOI = false;
    this.mode = NONE_MODE;
    this.pickedAOI = null;
    this.ratios = {
      width: 1,
      height: 1
    }
  }

  getRatios() {
    return this.ratios;
  }

  setRatios(w, h) {
    this.ratios = {
      width: w,
      height: h
    }
  }

  _onImageChange() {

  }
  _onAOIChange() {

  }

  _onToggleCreatingAOI() {

  }

  addAOI(aoi) {
    this.AOIs.push(aoi);
  }
  removeAOI(aoi) {
    this.AOIs.remove(aoi);
  }

  getMode() {
    return this.mode;
  }

  setMode(mode) {
    this.mode = mode;
    if(mode !== 'CREATE_AOI') {
      this.isCreatingNewAOI = false;
      this.emit(TOGGLE_CREATING_AOI);
    }
  }

  getIsCreatingNewAOI() {
    return this.isCreatingNewAOI;
  }

  toggleIsCreatingNewAOI() {
    this.isCreatingNewAOI = !this.isCreatingNewAOI;
    this.emit(TOGGLE_CREATING_AOI);
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
  addToggleCreatingAOI(callback) {
    this.addListener(TOGGLE_CREATING_AOI, callback);
  }
  addPickAOI(callback) {
    this.addListener(PICKING_AOI, callback);
  }

  removeImageChangeListener(callback) {
    this.removeListener(IMAGE_CHANGE_EVENT, callback);
  }
  removeAOIChangeListener(callback) {
    this.removeListener(AOI_CHANGE_EVENT, callback);
  }
  removeToggleCreatingAOI(callback) {
    this.removeListener(TOGGLE_CREATING_AOI, callback);
  }
  removePickAOI(callback) {
    this.removeListener(PICKING_AOI, callback);
  }

  getPickedAOI() {
    return this.pickedAOI;
  }

  setPickedAOI(aoi) {
    this.pickedAOI = aoi;
    this.emit(PICKING_AOI);
  }

  emitImageChange(img) {
    if(img) {
      this.image = img;
      this.emit(IMAGE_CHANGE_EVENT);
    }
  }
  // addAOI(AOI) {
  //   this.AOIs.push(AOI);
  //   this.emit(AOI_CHANGE_EVENT);
  // }
  deleteAOI(AOI) {
    this.AOIs.remove(AOI);
    this.emit(AOI_CHANGE_EVENT);
  }
  editAOI(AOI) {
    this.emit(AOI_CHANGE_EVENT);
  }

  getAOIsJson() {
    var text = "{ \n \"AOIs\" : [ \n"
    this.AOIs.map((item, index) => {
      text += JSON.stringify(item.getInformation()) + ",";
    });
    text += "\n ] \n }";
    return text;
  }

  saveAOIsToFile() {
    var text = this.getAOIsJson();
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'save aois',
          fileName: './resources/images/aois.json',
          data: text,
      })
      // mode: 'no-cors'
    });
      fetch(request).then(function(response) {
        return response.json();
      }).then(function(j) {
        console.log(j);
      });
  }

  destroyClickedElement(event) {
      document.body.removeChild(event.target);
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
  icon: React.PropTypes.string.isRequired,
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
    EditingPageStore.saveAOIsToFile();
  }

  handleNewAOI() {
    EditingPageStore.toggleIsCreatingNewAOI();
  }

  handleDeleteAOI() {
    EditingPageStore.setMode(DELETE_MODE);
  }

  handleEditAOI() {
    EditingPageStore.setMode(EDIT_MODE);
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
    this.onPickingAOI = this._onPickingAOI.bind(this);
    this.handleSubmitOnClick = this._handleSubmitOnClick.bind(this);
  }

  componentDidMount() {
    EditingPageStore.addPickAOI(this.onPickingAOI);
  }

  componentWillUnmount() {
    EditingPageStore.removePickAOI(this.onPickingAOI);
  }

  _onPickingAOI() {
    var name = this.refs["nameRef"];
    if(name) {
      name.value = EditingPageStore.getPickedAOI().getName();
    }
  }

  _handleSubmitOnClick() {
    var name = this.refs["nameRef"];
    if(name) {
      EditingPageStore.getPickedAOI().setName(name.value);
    }
  }

  render() {
    return (<div>
      <div>Area Of Interest</div>
      <span>Name: <input type="text" ref="nameRef"/></span>
      <button onClick={this.handleSubmitOnClick}>Submit</button>
    </div>);
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
      height: props.height,
      widthRatio: 1,
      heightRatio: 1,
      name: ""
    }
    this.onClickAOI = this._onClickAOI.bind(this);
  }

  componentDidMount() {
    if(this.props.visible) {
      EditingPageStore.addAOI(this);
    }
  }
  // componentWillUnmount() {
  //   if(this.props.visible) {
  //     EditingPageStore.removeAOI(this);
  //   }
  // }
  setRatios(width, height) {
    this.setState({widthRatio: width, heightRatio: height});
  }

  getName() {
    return this.state.name;
  }

  setName(name) {
    this.setState({name: name});
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
    return {
      top: this.state.top,
      left: this.state.left,
      width: this.state.width,
      height: this.state.height,
      name: this.state.name};
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

  _onClickAOI() {
    if(EditingPageStore.getMode() === EDIT_MODE) {
      EditingPageStore.setPickedAOI(this);
    }
  }

  render() {
    var style = this.props.visible ? (s.AOIRectangle) : (s.AOIRectangle + ' ' + s.hiddenAOIRectangle);
    var widthRatio = EditingPageStore.getRatios().width;
    var heightRatio = EditingPageStore.getRatios().height;
    return (<div className={style} onClick={this.onClickAOI}
      style={{top: (this.state.top*heightRatio) + '%', left: (this.state.left*widthRatio) + '%', width: (this.state.width*widthRatio) + '%', height: (this.state.height*heightRatio) + '%'}}>
      {this.props.visible? this.state.name : ""}
    </div>);
  }
}
AOIOnImage.propTypes = {
  visible: React.PropTypes.bool.isRequired
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
      listOfAOIs: [],
      cursor: 'pointer'
    };

    this.AIOTopLeft = null;
    this.AIOWH = null;

    this.onImageChange = this._onImageChange.bind(this);
    this.onStartNewAOI = this._onStartNewAOI.bind(this);
    this.onDrawNewAOI = this._onDrawNewAOI.bind(this);
    this.onEndNewAOI = this._onEndNewAOI.bind(this);
    this.onToggleCreatingAOI = this._onToggleCreatingAOI.bind(this);
  }

  componentDidMount() {
    EditingPageStore.addImageChangeListener(this.onImageChange);
    EditingPageStore.addToggleCreatingAOI(this.onToggleCreatingAOI);
  }

  componentWillUnmount() {
    EditingPageStore.removeImageChangeListener(this.onImageChange);
    EditingPageStore.removeToggleCreatingAOI(this.onToggleCreatingAOI);
  }

  componentDidUpdate() {
    let img = this.refs["imageRef"];
    let imgContainer = this.refs["imgContainerRef"];
    if(img && imgContainer) {
      let ratios = EditingPageStore.getRatios();
      let w = img.clientWidth/imgContainer.clientWidth;
      let h = img.clientHeight/imgContainer.clientHeight;
      if(ratios.width != w || ratios.height != h) {
        EditingPageStore.setRatios(w, h);
      }
    }
  }

  _onToggleCreatingAOI() {
    this.setState({cursor: (EditingPageStore.getIsCreatingNewAOI() ? 'arrow' : 'pointer')});
  }

  _onImageChange() {
    this.setState({image: EditingPageStore.getImage()});
  }

  _onStartNewAOI(event) {
    if(EditingPageStore.getIsCreatingNewAOI()) {
      this.setState({newAOI: NEWAOI_MOUSEDOWN});
      let top = event.nativeEvent.offsetY;
      let left = event.nativeEvent.offsetX;
      let img = this.refs["imageRef"];
      let newAOI = this.refs["newAOIRef"];
      if(newAOI && img) {
        let t = (top/img.clientHeight) * 100;
        let l = (left/img.clientWidth) * 100;
        newAOI.setPosition(t, l);
      }
      event.preventDefault();
    }
  }

  _onDrawNewAOI(event) {
    if(EditingPageStore.getIsCreatingNewAOI() && this.state.newAOI === NEWAOI_MOUSEDOWN) {
      var top = event.nativeEvent.offsetY;
      var left = event.nativeEvent.offsetX;
      let img = this.refs["imageRef"];
      let newAOI = this.refs["newAOIRef"];
      if(newAOI && img) {
        let t = (top/img.clientHeight) * 100;
        let l = (left/img.clientWidth) *100;
        let position = newAOI.getPosition();
        newAOI.setSize(l - position.left, t - position.top);
      }
    }
    event.preventDefault();
  }

  _onEndNewAOI(event) {
    if(EditingPageStore.getIsCreatingNewAOI()) {
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
  }

  render() {
    let img = this.state.image;
    var style = (this.state.cursor === 'arrow') ? (s.dragAndDropArea) : (s.normalArea);
    if(img) {
      var newAOI = <AOIOnImage ref="newAOIRef" visible={false}/>;
    return (<div className={style} ref="imgContainerRef">
        <img className={s.image} src={img}
          ref="imageRef"
          onMouseDown={this.onStartNewAOI}
          onMouseMove={this.onDrawNewAOI}
          onMouseUp={this.onEndNewAOI}/>
        {newAOI}
        {this.state.listOfAOIs.map((item, index) => {
          return <AOIOnImage top={item.top} left={item.left} width={item.width} height={item.height} visible={true}/>
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
        <AOIProperties />
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
