import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import history from '../../core/history';

import eventSystem from './QuestionPageEvents';

const stimuliFolder = './public/experiment/stimuli/';
const stimuliFolderImages = 'experiment/stimuli/';

var idCounter = 0;

class Trial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.trial.image.split('.')[0] + '_json'
    };
    this.deleteTrial = this.onDeleteTrial.bind(this);
    this.refID = "Trial" + idCounter++;
  }

  pickTrial() {
    eventSystem.pickTrial(this.getInfo());
    eventSystem.setActiveRefID(this.refID , s.activeClickable);
  }

  getInfo() {
    return {
      hsiID: this.props.hsiID.split('HSI')[1],
      questionID: this.props.questionID.split('Question')[1],
      trial: this.props.trial
    }
  }

  onDeleteTrial() {
    let path = './public/experiment/stimuli/' + this.props.hsiID + '/' + this.props.questionID;
    let fileName = this.props.trial.image.split('.')[0] + '_data.json';
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'delete stimuli data',
          path: path,
          fileName: fileName
      })
      // mode: 'no-cors'
    });
      fetch(request).then(function(response) {
        return response.json();
      }).then(function(j) {
        eventSystem.reloadPage();
      });
  }

  render() {


    return(<div id={this.refID} className={s.itemWrapper + " " + s.trialText}><div onClick={this.pickTrial.bind(this)} className={s.clickable}>Trial {this.state.name}</div><div className={s.deleteIcon} onClick={this.deleteTrial}><div className={s.iconText}>X</div></div></div>);
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.question = this.props.question;
    this.editBlockInstructions = this.onEditBlockInstructions.bind(this);
    this.deleteQuestion = this.onDeleteQuestion.bind(this);
    this.refID = "Question" + idCounter++;
  }

  onEditBlockInstructions() {
    eventSystem.pickBI(this.getInfo());
    eventSystem.setActiveRefID(this.refID , s.activeClickable);
  }

  getInfo() {
    return {
      hsiID: this.props.hsiID,
      question: this.props.question
    }
  }

  onDeleteQuestion() {
    let path = './public/experiment/stimuli/' + this.props.hsiID;
    let fileName = this.props.question.question;
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'delete stimuli data',
          path: path,
          fileName: fileName
      })
      // mode: 'no-cors'
    });
      fetch(request).then(function(response) {
        return response.json();
      }).then(function(j) {
        eventSystem.reloadPage();
      });
  }

  render() {
    let hsiID = this.props.hsiID;
    let question = this.props.question;

    return(<div >
          <div id={this.refID} className={s.itemWrapper + " " + s.questionText}><div className={s.clickable} onClick={this.editBlockInstructions}> {question.question}</div><div className={s.deleteIcon} onClick={this.deleteQuestion}><div className={s.iconText}>X</div></div></div>
          {/* <div >Block Instructions</div> */}

          {question.trials.map((trial, trial_index) => {
            return <div><Trial hsiID={hsiID} questionID={question.question} trial={trial} key={trial_index}/></div>
          })}

   </div>);
  }
}

class ExperimentData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hsiData: this.props.hsiData
    }
  }

  updateData(data) {
    this.setState({
      hsiData: null
    });
    this.setState({
      hsiData: data
    });
    console.log('reload');
  }

  render() {
    let hsiData = this.state.hsiData;
    if(hsiData) {
      return (<div className={s.experimentPane}>
        <div className={s.experimentHeaderText}>Current Experiment Data</div>
        <div className={s.experimentContent}>
        {hsiData.map((hsi, hsi_index) => {
          return <div className={s.hsiMargin} key={hsi_index}>
            <div className={s.itemWrapper + " " + s.hsiText}>{hsi.hsi}</div>
            {hsi.questions.map((question, q_index) => {
              return <Question key={q_index} question={question} hsiID={hsi.hsi}/>;
            })}
            </div>
         })}
      </div></div>);
    }
    else {
      return (<div/>);
    }
  }
}

class NewQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.imageName = '';
    this.handleChosenFile = this._handleChosenFile.bind(this);
    this.onResetButtonClicked = this._onResetButtonClicked.bind(this);
    this.onSaveButtonClicked = this._onSaveButtonClicked.bind(this);
    this.onSaveBlockInstructions = this._onSaveBlockInstructions.bind(this);
    this.state = {
      img: null
    };
    this.onPickingBI = this._onPickingBI.bind(this);
    this.onPickingTrial = this._onPickingTrial.bind(this);
    this.oldImage = null;
  }

  componentDidMount() {
    eventSystem.addPickBIListener(this.onPickingBI);
    eventSystem.addPickTrialListener(this.onPickingTrial);
  }

  componentWillUnmount() {
    eventSystem.removePickBIListener(this.onPickingBI);
    eventSystem.removePickTrialListener(this.onPickingTrial);
  }

  _onPickingTrial() {
    let info = eventSystem.getPickedTrial();
    if((this.refs["hsiIdRef"].value !== info.hsiID) || (this.refs["questionIdRef"].value !== info.questionID)) {
      this._onResetButtonClicked();
    }
    this.refs["hsiIdRef"].value = info.hsiID;
    this.refs["questionIdRef"].value = info.questionID;
    this.refs["questionRef"].value = info.trial.question;
    this.refs["radio0"].checked = (info.trial.correctAnswer == 0);
    this.refs["radio1"].checked = (info.trial.correctAnswer == 1);
    this.refs["radio2"].checked = (info.trial.correctAnswer == 2);
    this.refs["key0Ref"].value = info.trial.responseKeys[0].key;
    this.refs["key1Ref"].value = info.trial.responseKeys[1].key;
    this.refs["key2Ref"].value = info.trial.responseKeys[2].key;
    this.refs["meaning0Ref"].value = info.trial.responseKeys[0].meaning;
    this.refs["meaning1Ref"].value = info.trial.responseKeys[1].meaning;
    this.refs["meaning2Ref"].value = info.trial.responseKeys[2].meaning;
    this.refs["imageLabelRef"].innerHTML=info.trial.image;
    this.imageName = info.trial.image;
    this.oldImage = info.trial.image;
    this.setState({
      img: stimuliFolderImages+'HSI'+info.hsiID+"/"+'Question'+info.questionID+"/"+info.trial.image
    });
  }

  _onPickingBI() {
    let info = eventSystem.getEditedBlockInstruction();
    if((this.refs["hsiIdRef"].value !== info.hsiID) || (this.refs["questionIdRef"].value !== info.question.question)) {
      this._onResetButtonClicked();
    }
    this.refs["hsiIdRef"].value = info.hsiID.split('HSI')[1];
    this.refs["questionIdRef"].value = info.question.question.split('Question')[1];
    this.refs["blockInstructionsRef"].value = info.question.blockInstructions;
    this.forceUpdate();
  }

  findCheckedRadioButton() {
    if(this.refs["radio0"].checked) return 0;
    if(this.refs["radio1"].checked) return 1;
    if(this.refs["radio2"].checked) return 2;
    return -1;
  }

  getInformation() {
    return ({
      hsiID: this.refs["hsiIdRef"].value,
      questionID: this.refs["questionIdRef"].value,
      body: {
        question: this.refs["questionRef"].value,
        responseKeys: [
          {
            key: (this.refs["key0Ref"].value === "") ? this.refs["key0Ref"].placeholder : this.refs["key0Ref"].value,
            meaning: this.refs["meaning0Ref"].value
          },
          {
            key: (this.refs["key1Ref"].value === "") ? this.refs["key1Ref"].placeholder : this.refs["key1Ref"].value,
            meaning: this.refs["meaning1Ref"].value
          },
          {
            key: (this.refs["key2Ref"].value === "") ? this.refs["key2Ref"].placeholder : this.refs["key2Ref"].value,
            meaning: (this.refs["meaning2Ref"].value === "") ? this.refs["meaning2Ref"].placeholder : this.refs["meaning2Ref"].value
          }
        ],
        correctAnswer: this.findCheckedRadioButton(),
        image: this.imageName
      }
    });
  }

  addNewQuestion() {
      var q = this.getInformation();
      var hsiID = q.hsiID;
      var questionID = q.questionID;
      if((hsiID === "") || (questionID === "")) {
        return;
      }

      var path = './public/experiment/stimuli/HSI' + hsiID + '/Question' + questionID;

      if(this.oldImage && this.oldImage != q.body.image) {
        var request = new Request('http://localhost:3000/api', {
           method: 'POST',
           headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
           },
           redirect: 'follow',
           body: JSON.stringify({
              request: 'delete stimuli data',
              path: path,
              fileName: this.oldImage.split('.')[0] + '_data.json'
          })
          // mode: 'no-cors'
        });
          fetch(request).then(function(response) {
            return response.json();
          }).then(function(j) {
            console.log('Delete', j.message);
          });
      }
      this.oldImage = null;

      var fileName = q.body.image.split('.')[0] + '_data.json';
      var request = new Request('http://localhost:3000/api', {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         redirect: 'follow',
         body: JSON.stringify({
            request: 'save question',
            path: path,
            fileName: fileName,
            data: JSON.stringify(q.body, null, "\t"),
        })
        // mode: 'no-cors'
      });
        fetch(request).then(function(response) {
          return response.json();
        }).then(this._onSavedCallback.bind(this));


  }

  _onSaveButtonClicked() {
    var correctAnswer = this.findCheckedRadioButton();
    if (correctAnswer < 0 || correctAnswer > 2) {
      alert("Cannot save trial. Please pick one option as the correct answer!");
      return;
    }
    var path = './public/experiment/stimuli/HSI' + this.refs["hsiIdRef"].value + '/Question' + this.refs["questionIdRef"].value;
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'copy image',
          imageName: this.imageName,
          image: this.state.img,
          desPath: path,
      })
      // mode: 'no-cors'
    });
      fetch(request).then(function(response) {
        return response.json();
      }).then(function(j) {
        alert("Image Saved " + j.message);
      });
    this.addNewQuestion();
  }

  _onSavedCallback(j) {
    alert("Saved " + j.message);
    this.props.reloadPageCallback();
  }

  _onResetButtonClicked() {
    this.refs["hsiIdRef"].value = '';
    this.refs["questionIdRef"].value = '';
    this.refs["questionRef"].value = '';
    this.refs["radio0"].checked = false;
    this.refs["radio1"].checked = false;
    this.refs["radio2"].checked = false;
    this.refs["key0Ref"].value = '';
    this.refs["key1Ref"].value = '';
    this.refs["key2Ref"].value = '';
    this.refs["meaning0Ref"].value = '';
    this.refs["meaning1Ref"].value = '';
    this.refs["meaning2Ref"].value = '';
    this.refs["imageRef"].value = '';
    this.imageName = '';
    this.refs["imageLabelRef"].innerHTML='';
    this.setState({img: null});
  }

  _readFileCallback(e) {
    this.setState({img: e.target.result});
  }

  _handleChosenFile(e) {
    if (e.target.files && e.target.files[0]) {
      this.imageName = e.target.files[0].name;
      var reader = new FileReader();
      reader.onloadend = this._readFileCallback.bind(this);
      reader.readAsDataURL(e.target.files[0]);
      this.refs["imageLabelRef"].innerHTML=e.target.files[0].name;
    }
  }

  _onSaveBlockInstructions() {
    var blockInstructions = this.refs["blockInstructionsRef"];
    if(blockInstructions) {
      var hsiID = this.refs["hsiIdRef"].value;
      var questionID = this.refs["questionIdRef"].value;
      if((hsiID === "") || (questionID === "")) {
        return;
      }
      var fileName = 'BlockInstructions.txt';
      var path = './public/experiment/stimuli/HSI' + hsiID + '/Question' + questionID;
      var request = new Request('http://localhost:3000/api', {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         redirect: 'follow',
         body: JSON.stringify({
            request: 'save question',
            path: path,
            fileName: fileName,
            data: blockInstructions.value,
        })
        // mode: 'no-cors'
      });
        fetch(request).then(function(response) {
          return response.json();
        }).then(this._onSavedCallback.bind(this));
    }
  }

  render() {
    var image = this.state.img ? <img src={this.state.img} ref="imageInputRef"/> : null;
    return(
      <div className={s.questionImgWrapper}>
      <div className={s.question}>
        <div className={s.questionPane}>
          <div>
            <div className={s.bold}>HSI Folder ID: <input type="text" ref="hsiIdRef" className={s.smallTextBox}/>Question Folder ID: <input type="text" ref="questionIdRef" className={s.smallTextBox}/>
            </div>
          </div>
          <div className={s.bold + ' ' + s.blockinstructions}>Block Instructions: <textarea name="BlockInstructions" cols="40" rows="5" ref="blockInstructionsRef" className={s.questionInputText} placeholder="Input Block Instructions Here"/>
          <button className={s.button} onClick={this.onSaveBlockInstructions}>Save Block Instructions</button>
          </div>
          <div>
            <div><div className={s.bold + ' ' + s.trialtitle}>New Trial: </div><textarea name="Text1" cols="40" rows="5" ref="questionRef" className={s.questionInputText} placeholder="Input Trial Question Here"/></div>
            Response Keys: (Please choose the correct one)
            <div><input type="radio" name="correct" value="0" ref="radio0"/>Key: <input type="text" placeholder="z" ref="key0Ref" className={s.smallTextBox}/>Meaning: <input type="text" ref="meaning0Ref"/></div>
            <div><input type="radio" name="correct" value="1" ref="radio1"/>Key: <input type="text" placeholder="/" ref="key1Ref" className={s.smallTextBox}/>Meaning: <input type="text" ref="meaning1Ref"/></div>
            <div><input type="radio" name="correct" value="2" ref="radio2"/>Key: <input type="text" placeholder="space" ref="key2Ref" className={s.smallTextBox}/>Meaning: <input type="text" ref="meaning2Ref" placeholder="Alarm"/></div>
          </div>
          <div>Image: <label for="files" class="btn" ref="imageLabelRef">Select Image</label>
            <input type="file" ref="imageRef" accept="image/*"
            onChange={this.handleChosenFile}
            className={s.fileUploader}/></div>
          <div><button className={s.button} onClick={this.onSaveButtonClicked}>Save Trial</button><button className={s.button} onClick={this.onResetButtonClicked}>Clear Fields</button></div>
        </div>
     </div>
     <div className={s.imageWrapper}>
       <div className={s.imagePane}>
         {image}
       </div>
     </div>
 </div>);
  }
}

class QuestionPane extends React.Component {
  constructor(props) {
    super(props);
    this.handleRecievedData = this.onRecievedStimuliData.bind(this);
    this.state = {
      hsiData: null
    };
    this.handleReloadPage = this.reloadPage.bind(this);
  }

  componentWillMount() {
    this.readStimuliDir(stimuliFolder, this.handleRecievedData);
  }

  componentDidMount() {
    eventSystem.addReloadPageListener(this.handleReloadPage);
  }

  componentWillUnmount() {
    eventSystem.removeReloadPageListener(this.handleReloadPage);
  }

  onRecievedStimuliData(data){
    console.log(data);
    this.dataRecieved = true;
    this.refs["experimentExplorerRef"].updateData(data);
  }

  readStimuliDir(filename, callback) {
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'read stimuli data',
          fileName: filename
      })
    });
    fetch(request).then(function(response) {
      return response.json();
    }).then(function(j) {
      callback(j);
    });
  }

  goToHomePage() {
    history.push('/');
  }

  reloadPage() {
    this.readStimuliDir(stimuliFolder, this.handleRecievedData);
  }

  render() {
    return(
      <Layout>
      <div className={s.questionPage}>
      <div className={s.titlePane}><div className={s.title}> Question Editor </div><button onClick={this.goToHomePage} className={s.homePageButton}>Home Page</button></div>
      <ExperimentData ref="experimentExplorerRef" hsiData={this.state.hsiData} editBlockInstructionCallback={()=>{this.editBlockInstruction()}} editTrialCallback={()=>this.editTrial}/>
      <NewQuestion ref="newQuestionRef" reloadPageCallback={()=>{this.reloadPage()}}/>
    </div>
  </Layout>);
  }
}
QuestionPane.propTypes = {

};

export default QuestionPane;
