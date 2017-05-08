var Excel = require('exceljs');

var exports = module.exports = {};
exports.saveAsExcel = function(fileName, data) {
  var jsonData = JSON.parse(data);
  if (!jsonData) {
    return;
  }

  var participantId = jsonData.participantId;
  var hsiOrder = jsonData.hsiOrder;
  var hsiData = jsonData.hsiData;

  var workbook = new Excel.Workbook();

  workbook.creator = 'SynOpticonTeam';
  workbook.lastModifiedBy = 'SynOpticonTeam';
  workbook.created = new Date(2017, 5, 1);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
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
  hsiOrder.map((d, i)=>{
    row2.push(d);
  });
  worksheet.addRow(row2);

  worksheet.addRow();
  worksheet.addRow();

  var rows = [];

  var columns = ['Participant', 'HSI', 'Question', 'Trial', 'Category', 'Event Start Trial Time [ms]', 'Event End Trial Time [ms]', 'Event Duration [ms]',
                'Fixation Position X [px]', 'Fixation Position Y [px]', 'AOI Name', 'Image', 'Response Time', 'Answer', 'Correct Answer'];
  var numOfCorrectAns = [];
  hsiOrder.map((d, i) => {
    numOfCorrectAns.push(0);
  });

  hsiData.map((hsiItem, hsiIndex) => {
    var hsiID = hsiItem.hsi;
    var questions = hsiItem.questions;
    var hsiRows = [];
    questions.map((qItem, qIndex) => {
      var questionId = qItem.question;
      var trials = qItem.trials;

      trials.map((tItem, tIndex) => {
        var keyResponse = tItem.keyResponse[0];
        var correctAnswer = tItem.correctAnswer;
        console.log(correctAnswer, keyResponse.keyPressed);
        if(correctAnswer === keyResponse.keyPressed) {
          numOfCorrectAns[hsiIndex]++;
        }
        var trialID = tItem.trial;
        var gazePath = tItem.gazePath;

        gazePath.map((gItem, gIndex) => {
          var keyPressed;
          var responseTime;
          if ((gItem.eventStart <= keyResponse.eventStart) && (gItem.eventEnd > keyResponse.eventStart)) {
            keyPressed = keyResponse.keyPressed;
            responseTime = keyResponse.eventStart;
          }
          else {
            keyPressed = '-';
            responseTime = '-';
          }
          hsiRows.push([gItem.participantId, hsiID, questionId, trialID, gItem.category, gItem.eventStart, gItem.eventEnd, gItem.eventDuration,
                            gItem.fixationPos.posX, gItem.fixationPos.posY, gItem.aoiName, gItem.image, responseTime, keyPressed, correctAnswer]);
        });
      });
    });
    rows.push({id: hsiID, hsi: hsiRows});
  });

  var total = numOfCorrectAns.reduce((a, b) => a + b);
  worksheet.addRow(['Total number of correct answers: ', total]);
  worksheet.addRow();
  worksheet.addRow();
  rows.map((hsiRows, index)=>{
    worksheet.addRow(['HSI ID: ', hsiRows.id]);
    worksheet.addRow(['Number of correct answers: ', numOfCorrectAns[index]]);
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


  workbook.xlsx.writeFile(fileName)
      .then(function() {
          console.log("Excel file saved!");
      });
}
