import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import history from '../../core/history';

const stimuliFolder = './public/experiment/stimuli/';

class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let hsiID = this.props.hsiID;
    let question = this.props.question;

    return(<div className={s.indent}>
          <div> {question.question}</div>
          <div >Block Instructions</div>
          {question.trials.map((trial, trial_index) => {
            let trialName = trial.image.split('.')[0] + '_json';
            return <div key={trial_index}>
                <div>Trial {trialName}</div>
              </div>
          })}

   </div>);
  }
}

class ExperimentData extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let hsiData = this.props.hsiData;
    if(hsiData) {
      return (<div className={s.experimentPane}>
        {hsiData.map((hsi, hsi_index) => {
          return <div>
            {hsi.hsi}
            {hsi.questions.map((question, q_index) => {
              return <Question key={q_index} question={question} hsiID={hsi.hsi}/>;
            })}
            </div>
         })}
      </div>);
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
    this.props.addCallBack();
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
        }).then(function(j) {
          alert("Block Instruction Saved " + j.message);
        });
    }
  }

  render() {
    var image = this.state.img ? <img src={this.state.img} ref="imageInputRef"/> : null;
    return(<div className={s.question}>
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
          <div>Image: <input type="file" ref="imageRef" accept="image/*"
            onChange={this.handleChosenFile}
            className={s.fileUploader}/></div>
          <div><button className={s.button} onClick={this.onSaveButtonClicked}>Save Trial</button><button className={s.button} onClick={this.onResetButtonClicked}>Clear Fields</button></div>
        </div>
      <div className={s.imagePane}>
        {image}
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
  }

  componentWillMount() {
    this.readStimuliDir(stimuliFolder, this.handleRecievedData);
  }

  addNewQuestion() {
    var qRef = this.refs["newQuestionRef"];
    if(qRef) {
      var q = qRef.getInformation();
      var hsiID = q.hsiID;
      var questionID = q.questionID;
      if((hsiID === "") || (questionID === "")) {
        return;
      }
      var fileName = q.body.image.split('.')[0] + '_data.json';
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
            data: JSON.stringify(q.body, null, "\t"),
        })
        // mode: 'no-cors'
      });
        fetch(request).then(function(response) {
          return response.json();
        }).then(function(j) {
          alert("Trial Saved " + j.message);
        });
    }
  }

  onRecievedStimuliData(data){
    console.log(data);
    this.dataRecieved = true;
    this.setState({
      hsiData: data
    })
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

  editBlockInstruction() {

  }

  editTrial() {

  }

  render() {
    return(
      <Layout>
      <div className={s.questionPage}>
      <div className={s.titlePane}><div className={s.title}> Question Editor </div><button onClick={this.goToHomePage} className={s.homePageButton}>Home Page</button></div>
      <ExperimentData hsiData={this.state.hsiData} editBlockInstructionCallback={()=>{this.editBlockInstruction()}} editTrialCallback={()=>this.editTrial}/>
      <NewQuestion addCallBack={()=>{this.addNewQuestion()}} ref="newQuestionRef"/>
    </div>
  </Layout>);
  }
}
QuestionPane.propTypes = {

};

export default QuestionPane;
