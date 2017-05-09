import React, { PropTypes } from 'react';
import s from './styles.css';

class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChosenFile(event) {
    console.log(event.target.files[0]);
  }

  handleResetButton() {

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
        image: this.refs["fileUploader"].value
      }
    });
  }

  onSaveButtonClicked() {

    this.props.addCallBack();
  }

  onResetButtonClicked() {
    // this.refs["hs"]
  }

  render() {
    return(<div className={s.question}>
      <div>
        <div>HSI ID: <input type="text" ref="hsiIdRef" className={s.smallTextBox}/>Question ID: <input type="text" ref="questionIdRef" className={s.smallTextBox}/>
        </div>
      </div>
      <div>
        <div>Question: <textarea name="Text1" cols="40" rows="5" ref="questionRef" className={s.questionInputText}/></div>
        Response Keys: (Please choose the correct one)
        <div><input type="radio" name="correct" value="0" ref="radio0"/>Key: <input type="text" placeholder="z" ref="key0Ref" className={s.smallTextBox}/>Meaning: <input type="text" ref="meaning0Ref"/></div>
        <div><input type="radio" name="correct" value="1" ref="radio1"/>Key: <input type="text" placeholder="/" ref="key1Ref" className={s.smallTextBox}/>Meaning: <input type="text" ref="meaning1Ref"/></div>
        <div><input type="radio" name="correct" value="2" ref="radio2"/>Key: <input type="text" placeholder="space" ref="key2Ref" className={s.smallTextBox}/>Meaning: <input type="text" ref="meaning2Ref" placeholder="Alarm"/></div>
      </div>
      <div>Image: <input type="text" ref="fileUploader"/></div>
      <div><button onClick={this.onSaveButtonClicked}>Save</button><button onClick={this.onResetButtonClicked}>Reset</button></div>
    </div>);
  }
}

class QuestionPane extends React.Component {
  constructor(props) {
    super(props);
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
      var fileName = q.body.image + '.json';
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
          console.log(j);
        });
    }
  }

  render() {
    return(<div className={s.questionPane}>
      <div className={s.title}>New Question</div>
      <Question addCallBack={()=>{this.addNewQuestion()}} ref="newQuestionRef"/>
    </div>);
  }
}
QuestionPane.propTypes = {

};

export default QuestionPane;
