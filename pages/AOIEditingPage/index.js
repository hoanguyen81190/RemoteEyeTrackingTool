import React, { PropTypes } from 'react';
import s from './styles.css';
// import FileInput from 'react-file-input';

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
    console.log("Open new Image");
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
      <ToolBoxButton icon={saveImageIcon}/>
      <ToolBoxButton icon={newAOIIcon}/>
      <ToolBoxButton icon={deleteAOIIcon}/>
      <ToolBoxButton icon={editAOIIcon}/>
      {/* <form>
        <FileInput name="myImage"
                   accept=".png,.gif"
                   placeholder="My Image"
                   className="inputClass"
                   onChange={this.handleChange} />
      </form> */}
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
