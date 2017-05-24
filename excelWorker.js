var Excel = require('exceljs');
const fs = require('fs');

var exports = module.exports = {};

exports.saveAsExcel = function(path, fileName, data) {
  var fullName = path + '/' + fileName;
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  var workbook = new Excel.Workbook();
  if(fs.existsSync(fullName)) {
    workbook.xlsx.readFile(fullName).then(function() {
        saveHelper(workbook, fullName, data);
      }).catch(function(err) {
        var workbook1 = new Excel.Workbook();
        fileName = fileName.split('.xlsx')[0] + '(' + counter + ').xlsx';
        saveHelper(workbook1, fullName, data);
      });
  }
  else {
    saveHelper(workbook, fullName, data);
  }
}


function saveHelper(workbook, fileName, data) {
  // use workbook
  // workbook.creator = 'SynOpticonTeam';
  // workbook.lastModifiedBy = 'SynOpticonTeam';
  // workbook.created = new Date(2017, 5, 1);
  // workbook.modified = new Date();
  // workbook.lastPrinted = new Date();

  var jsonData = JSON.parse(data);
  if (!jsonData) {
    return;
  }

  var participantId = jsonData.participantId;
  var hsiOrder = jsonData.hsiOrder;
  var hsiData = jsonData.hsiData;

  workbook.properties.date1904 = true;
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
  ]
  var worksheet = workbook.addWorksheet('Participant' + participantId);
  var row1 = [];
  row1.push('Participant ID: ');
  row1.push(participantId);
  worksheet.addRow(row1);

  var row2 = [];
  row2.push("HSI order: ");
  row2.push(hsiOrder);
  // hsiOrder.map((d, i)=>{
  //   row2.push(d);
  // });
  worksheet.addRow(row2);

  var rows = [];

  var columns = ['Participant', 'HSI', 'Question', 'Trial', 'Category', 'Event Start Trial Time [ms]', 'Event End Trial Time [ms]', 'Event Duration [ms]',
                'Fixation Position X [px]', 'Fixation Position Y [px]', 'AOI Name', 'Image', 'Response Time', 'Answer', 'Correct Answer'];
  var numOfCorrectAns = [];
  hsiOrder.map((d, i) => {
    numOfCorrectAns.push(0);
  });
  var numOfTrials = 0;

  hsiData.map((hsiItem, hsiIndex) => {
    var hsiID = hsiItem.hsi;
    var questions = hsiItem.questions;
    var hsiRows = [];
    questions.map((qItem, qIndex) => {
      var questionId = qItem.question;
      var trials = qItem.trials;
      numOfTrials += trials.length;
      trials.map((tItem, tIndex) => {
        var keyResponse = tItem.keyResponse[0];
        var correctAnswer = tItem.correctAnswer;
        if(correctAnswer === keyResponse.keyPressed) {
          numOfCorrectAns[hsiIndex]++;
        }
        var trialID = tItem.trial;
        var gazePath = tItem.gazePath;

        gazePath.map((gItem, gIndex) => {
          // var keyPressed;
          // var responseTime;
          // if ((gItem.eventStart <= keyResponse.eventStart) && (gItem.eventEnd > keyResponse.eventStart)) {
          //   keyPressed = keyResponse.keyPressed;
          //   responseTime = keyResponse.eventStart;
          // }
          // else {
          //   keyPressed = '-';
          //   responseTime = '-';
          // }
          hsiRows.push([gItem.participantId, hsiID, questionId, trialID, gItem.category, gItem.eventStart, gItem.eventEnd, gItem.eventDuration,
                            gItem.fixationPos.posX, gItem.fixationPos.posY, gItem.aoiName, gItem.image, '-', '-', '-']);
        });
        // ['Participant', 'HSI', 'Question', 'Trial', 'Category', 'Event Start Trial Time [ms]', 'Event End Trial Time [ms]', 'Event Duration [ms]',
        //               'Fixation Position X [px]', 'Fixation Position Y [px]', 'AOI Name', 'Image', 'Response Time', 'Answer', 'Correct Answer'];
        hsiRows.push([participantId, hsiID, questionId, trialID, 'KeyPressed', keyResponse.eventStart, '-', '-',
                          '-', '-', '-', '-', keyResponse.eventStart, keyResponse.keyPressed, correctAnswer]);
      });
    });
    rows.push({id: hsiID, hsi: hsiRows});
  });

  worksheet.addRow(['Number of trials', numOfTrials]);

  var total = numOfCorrectAns.reduce((a, b) => a + b);
  worksheet.addRow(['Total number of correct answers', total]);
  worksheet.addRow(['Accuracy (%)', parseFloat(Math.round(((total*100)/numOfTrials) * 100) / 100).toFixed(2)]);
  worksheet.addRow();
  worksheet.addRow();
  rows.map((hsiRows, index)=>{
    worksheet.addRow(['HSI ID', hsiRows.id]);
    worksheet.addRow(['Number of correct answers', numOfCorrectAns[index]]);
    worksheet.addRow();
    worksheet.addRow(columns);
    hsiRows.hsi.map((r, i) => {
      worksheet.addRow(r);
    });
    worksheet.addRow();
    worksheet.addRow();
  });


  // set an outline level for columns
  //worksheet.getColumn(4).outlineLevel = 0;

  // columns support a readonly field to indicate the collapsed state based on outlineLevel
  // expect(worksheet.getColumn(4).collapsed).to.equal(false);
  // expect(worksheet.getColumn(5).collapsed).to.equal(true);
  var counter = 0;
  var tryToSaveHelper = function () {
    workbook.xlsx.writeFile(fileName)
    .then(function() {
      console.log("Excel file saved!");
    }).catch(function() {
      counter++;
      fileName = fileName.split('.xlsx')[0] + '(' + counter + ').xlsx';
      tryToSaveHelper();
      console.log('savehelper exception');
    });
  }
  tryToSaveHelper();
}
