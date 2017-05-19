import React, { PropTypes } from 'react';
import s from './styles.css';
import history from '../../core/history';
import Layout from '../../components/Layout';

import savedAOIs from '../../public/experiment/aois.json';

const EventEmitter = require('events');

import openImageIcon from '../../resources/icons/open_icon.png';
import saveImageIcon from '../../resources/icons/save_icon.png';
import newAOIIcon from '../../resources/icons/plus_icon.png';
import deleteAOIIcon from '../../resources/icons/delete_icon.png';
import editAOIIcon from '../../resources/icons/edit_icon.png';

const IMAGE_CHANGE_EVENT = 'imageChanged';
const DELETE_AOI_EVENT = 'aoiDeleted';
const WINDOW_SIZE_CHANGED_EVENT = 'windowSizeChanged';
const SWITCH_MODE = 'switchMode';
const PICKING_AOI = 'pickAOI';
const CREATE_MODE = 'CREATE_MODE';
const EDIT_MODE = 'EDIT_MODE';
const DELETE_MODE = 'DELETE_MODE';
const NONE_MODE = 'NONE';

class CEditingPageStore extends EventEmitter {
  constructor() {
    super();
    this.image = null;
    this.mode = NONE_MODE;
    this.pickedAOI = null;
    this.ratios = {
      width: 1,
      height: 1
    }
    this.AOIs = savedAOIs.AOIs;
    this.tempAOIs = [];
    this.onFinishDelete = this._onFinishDelete.bind(this);
  }

  getRatios() {
    return this.ratios;
  }

  setRatios(w, h) {
    this.ratios = {
      width: w,
      height: h
    }
    this.emit(WINDOW_SIZE_CHANGED_EVENT);
  }

  getMode() {
    return this.mode;
  }

  setMode(mode) {
    this.mode = mode;
    this.emit(SWITCH_MODE);
  }

  getImage() {
    return this.image;
  }

  addImageChangeListener(callback) {
    this.addListener(IMAGE_CHANGE_EVENT, callback);
  }
  addSwitchModeListener(callback) {
    this.addListener(SWITCH_MODE, callback);
  }
  addPickAOIListener(callback) {
    this.addListener(PICKING_AOI, callback);
  }
  addDeleteAOIListener(callback) {
    this.addListener(DELETE_AOI_EVENT, callback);
  }
  addWindowSizeChangedListener(callback) {
    this.addListener(WINDOW_SIZE_CHANGED_EVENT, callback);
  }

  removeImageChangeListener(callback) {
    this.removeListener(IMAGE_CHANGE_EVENT, callback);
  }
  removeSwitchModeListener(callback) {
    this.removeListener(SWITCH_MODE, callback);
  }
  removePickAOIListener(callback) {
    this.removeListener(PICKING_AOI, callback);
  }
  removeDeleteAOIListener(callback) {
    this.removeListener(DELETE_AOI_EVENT, callback);
  }
  removeWindowSizeChangedListener(callback){
    this.removeListener(WINDOW_SIZE_CHANGED_EVENT, callback);
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

  addAOI(aoi) {
    this.AOIs.push(aoi);
  }

  _onFinishDelete() {
    this.AOIs = this.tempAOIs;
    this.emit(DELETE_AOI_EVENT);
  }

  deleteAOI(aoi) {
    for(var i = this.AOIs.length - 1; i >= 0; i--) {
        var item = this.AOIs[i];
        if((item.top === aoi.top) && (item.left === aoi.left) &&
          (item.width === aoi.width) && (item.height === aoi.height)) {
           this.AOIs.splice(i, 1);
           break;
        }
    }
    this.tempAOIs = this.AOIs;
    this.AOIs = [];
    this.emit(DELETE_AOI_EVENT);
    window.setTimeout(this.onFinishDelete, 1);

  }


  setName(name) {
    var aoi = this.pickedAOI.getInformation();
    for(var i = 0; i < this.AOIs.length; i++) {
        var item = this.AOIs[i];
        if((item.top === aoi.top) && (item.left === aoi.left) &&
          (item.width === aoi.width) && (item.height === aoi.height)) {
           this.AOIs[i].name = name;
           this.pickedAOI.setName(name);
           break;
        }
    }
  }


  getAOIs() {
    return this.AOIs;
  }

  getAOIsJson() {
    var aois = document.getElementsByClassName('AOIRef');
    var FindReact = function(dom) {
        for (var key in dom)
            if (key.startsWith("__reactInternalInstance$")) {
                var compInternals = dom[key]._currentElement;
                var compWrapper = compInternals._owner;
                var comp = compWrapper._instance;
                return comp;
            }
        return null;
    };

    if(!aois) {
      return;
    }
    var aoisJson = {
      AOIs: []
    }

    for(var i = 0; i < aois.length; i++) {
			var item = FindReact(aois[i]);
      aoisJson.AOIs.push(item.getInformation());
    }

    return JSON.stringify(aoisJson, null, "\t");
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
          path: './public/experiment/',
          fileName: 'aois.json',
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
    EditingPageStore.setMode(CREATE_MODE);
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

  goToHomePage() {
    history.push('/');
  }

  render() {
    return (<div>
      <ToolBoxButton icon={openImageIcon} onClickHandler={()=>this.handleOpenNewImage()}/>
      <ToolBoxButton icon={saveImageIcon} onClickHandler={()=>this.handleSaveImage()}/>
      <ToolBoxButton icon={newAOIIcon} onClickHandler={()=>this.handleNewAOI()}/>
      <ToolBoxButton icon={deleteAOIIcon} onClickHandler={()=>this.handleDeleteAOI()}/>
      <ToolBoxButton icon={editAOIIcon} onClickHandler={()=>this.handleEditAOI()}/>
      <button className={s.homePageButton} onClick={this.goToHomePage}>Home Page</button>
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
    EditingPageStore.addPickAOIListener(this.onPickingAOI);
  }

  componentWillUnmount() {
    EditingPageStore.removePickAOIListener(this.onPickingAOI);
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
      EditingPageStore.setName(name.value);
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
      name: ""
    }
    this.onClickAOI = this._onClickAOI.bind(this);
    this.onWindowSizeChanged = this._onWindowSizeChanged.bind(this);
  }

  componentDidMount() {
    if(this.props.visible) {
      this.setState({name: this.props.name});
    }
    EditingPageStore.addWindowSizeChangedListener(this.onWindowSizeChanged);
  }
  componentWillUnmount() {
    EditingPageStore.removeWindowSizeChangedListener(this.onWindowSizeChanged);
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

  _onWindowSizeChanged(){
    this.forceUpdate();
  }

  _onClickAOI() {
    if(EditingPageStore.getMode() === EDIT_MODE) {
      EditingPageStore.setPickedAOI(this);
    }
    else if(EditingPageStore.getMode() === DELETE_MODE) {
      EditingPageStore.deleteAOI(this.getInformation());
    }
  }

  render() {
    var style = this.props.visible ? (s.AOIRectangle + " AOIRef") : (s.AOIRectangle + ' ' + s.hiddenAOIRectangle);
    var widthRatio = EditingPageStore.getRatios().width;
    var heightRatio = EditingPageStore.getRatios().height;
    return (<div className={style} onClick={this.onClickAOI}
      style={{top: (this.state.top*heightRatio) + '%', left: (this.state.left*widthRatio) + '%', width: (this.state.width*widthRatio) + '%', height: (this.state.height*heightRatio) + '%'}}>
      <div className={s.AOIName}>{this.props.visible? this.state.name : ""}</div>
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
      cursor: 'pointer'
    };

    this.onImageChange = this._onImageChange.bind(this);
    this.onStartNewAOI = this._onStartNewAOI.bind(this);
    this.onDrawNewAOI = this._onDrawNewAOI.bind(this);
    this.onEndNewAOI = this._onEndNewAOI.bind(this);
    this.onToggleCreatingAOI = this._onToggleCreatingAOI.bind(this);
    this.onDeleteAOI = this._onDeleteAOI.bind(this);
  }

  componentDidMount() {
    EditingPageStore.addImageChangeListener(this.onImageChange);
    EditingPageStore.addSwitchModeListener(this.onToggleCreatingAOI);
    EditingPageStore.addDeleteAOIListener(this.onDeleteAOI);
    window.addEventListener("resize", this.updateRatios.bind(this));
  }

  componentWillUnmount() {
    EditingPageStore.removeImageChangeListener(this.onImageChange);
    EditingPageStore.removeSwitchModeListener(this.onToggleCreatingAOI);
    EditingPageStore.removeDeleteAOIListener(this.onDeleteAOI);
    window.removeEventListener("resize", this.updateRatios.bind(this));
  }

  componentDidUpdate() {
    this.updateRatios();
  }

  updateRatios() {
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
    var cursor = (EditingPageStore.getMode() === CREATE_MODE) ? 'arrow' : 'pointer';
    if (cursor !== this.state.cursor) {
      this.setState({cursor: cursor});
    }
  }

  _onImageChange() {
    this.setState({image: EditingPageStore.getImage()});
  }

  _onStartNewAOI(event) {
    if(EditingPageStore.getMode() === CREATE_MODE) {
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
    if((EditingPageStore.getMode() === CREATE_MODE) && this.state.newAOI === NEWAOI_MOUSEDOWN) {
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
    if(EditingPageStore.getMode() === CREATE_MODE) {
      this.setState({newAOI: NEWAOI_MOUSEUP});
      var info = this.refs["newAOIRef"].getInformation();
      this.refs["newAOIRef"].reset();

      let img = this.refs["imageRef"];
      let w = info.width * img.clientWidth / 100;
      let h = info.height * img.clientHeight / 100;
      if (w > 5 && h > 5) {
        EditingPageStore.addAOI(info);
        this.forceUpdate();
      }
      event.preventDefault();
    }
  }

  _onDeleteAOI() {
    this.forceUpdate();
  }

  render() {

    let img = this.state.image;
    var style = (this.state.cursor === 'arrow') ? (s.dragAndDropArea) : (s.normalArea);
    if(img) {
      var newAOI = (this.state.cursor === 'arrow') ? <AOIOnImage ref="newAOIRef" visible={false}/> : null;
      return (<div className={style} ref="imgContainerRef">
          <img className={s.image} src={img}
            ref="imageRef"
            onMouseDown={this.onStartNewAOI}
            onMouseMove={this.onDrawNewAOI}
            onMouseUp={this.onEndNewAOI}/>
          {newAOI}
          {EditingPageStore.getAOIs().map((item, index) => {
            return <AOIOnImage key={index} top={item.top} left={item.left} width={item.width} height={item.height} name={item.name} visible={true}/>
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

class LeftPanel extends React.Component {
  constructor(props) {
    super(props);
    this.onSwitchingMode = this._onSwitchingMode.bind(this);
    this.state = {
      properties: false
    }
  }

  componentDidMount() {
    EditingPageStore.addSwitchModeListener(this.onSwitchingMode);
  }

  componentWillUnmount() {
    EditingPageStore.removeSwitchModeListener(this.onSwitchingMode);
  }

  _onSwitchingMode() {
    var display = (EditingPageStore.getMode() === EDIT_MODE);
    if (display != this.state.properties) {
      this.setState({properties: display});
    }
  }

  render() {
    var aoiProperties = (this.state.properties) ? <AOIProperties /> : null;
    return(<div className={s.leftPanel}>
      <ToolBox/>
      {aoiProperties}
    </div>);
  }
}
LeftPanel.propTypes = {

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
    var aoiProperties = (EditingPageStore.getMode() === EDIT_MODE) ? <AOIProperties /> : null;
    return (<Layout>
      <div className={s.page}>
      <LeftPanel />
      <div className={s.rightPanel}>
        <ImageContainer />
      </div>
      </div>
    </Layout>
    );
  }

}
AOIEditingPage.propTypes = {

};

let EditingPageStore = new CEditingPageStore();
export default AOIEditingPage;
