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

  var columns = ['Participant', 'HSI', 'Question', 'Trial', 'Category', 'Event Start Trial Time [ms]', 'Event End Trial Time [ms]', 'Event Duration [ms]',
                'Fixation Position X [px]', 'Fixation Position Y [px]', 'AOI Name', 'Image', 'Response Time', 'Answer', 'Correct Answer'];

  worksheet.addRow(columns);

  hsiData.map((hsiItem, hsiIndex) => {
    var hsi = hsiItem.hsi;
    var questions = hsiItem.questions;
    questions.map((qItem, qIndex) => {
      var questionId = qItem.question;
      var trials = qItem.trials;
      trials.map((tItem, tIndex) => {
        var keyResponse = tItem.keyResponse;
        var correctAnswer = tItem.correctAnswer;
        var gazePath = tItem.gazePath;
        gazePath.map((gItem, gIndex) => {
          worksheet.addRow([gItem.participantId, hsi, questionId, tIndex, gItem.category, gItem.eventStart, gItem.eventEnd, gItem.eventDuration,
                            gItem.fixationPos.posX, gItem.fixationPos.posY, gItem.aoiName, gItem.image, keyResponse.responseTime, keyResponse.key, correctAnswer]);
        });
      });
    });
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
