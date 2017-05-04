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
  var worksheet = workbook.addWorksheet(data);
  worksheet.columns = [
      { header: 'Participant', key: 'id', width: 20, outlineLevel: 2 },
      { header: 'HSI', key: 'hsi', width: 20 },
      { header: 'Question', key: 'question', width: 20 },
      { header: 'Trial', key: 'trial', width: 20 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Event Start Trial Time [ms]', key: 'start_time', width: 20 },
      { header: 'Event End Trial Time [ms]', key: 'end_time', width: 20 },
      { header: 'Event Duration [ms]', key: 'duration', width: 20 },
      { header: 'Fixation Position X [px]', key: 'fixation_x', width: 20 },
      { header: 'Fixation Position Y [px]', key: 'fixation_y', width: 20 },
      { header: 'AOI Name', key: 'aoi', width: 20 },
      { header: 'Image', key: 'image', width: 20 },
      { header: 'Response Time', key: 'response_time', width: 20 },
      { header: 'Answer', key: 'answer', width: 20 },
      { header: 'Correct Answer', key: 'correct_answer', width: 20 }
  ];

  var idCol = worksheet.getColumn('id');
  var hsiCol = worksheet.getColumn('hsi');
  var questionCol = worksheet.getColumn('question');
  var trialCol = worksheet.getColumn('trial');
  var categoryCol = worksheet.getColumn('category');
  var startTimeCol = worksheet.getColumn('start_time');
  var endTimeCol = worksheet.getColumn('end_time');
  var durationCol = worksheet.getColumn('duration');
  var fixationXCol = worksheet.getColumn('fixation_x');
  var fixationYCol = worksheet.getColumn('fixation_y');
  var aoiCol = worksheet.getColumn('aoi');
  var imageCol = worksheet.getColumn('image');
  var answerCol = worksheet.getColumn('answer');
  var correctAnsCol = worksheet.getColumn('correct_answer');

  hsiData.map((hsiItem, hsiIndex) => {
    var hsi = hsiItem.hsi;
    var questions = hsiItem.questions;
    questions.map((qItem, qIndex) => {
      var questionId = qItem.question;
      var trials = qItem.trials;
      trials.map((tItem, tIndex) => {
        var keyResponse = tItem.keyResponse;
        var img = tItem.image;
        var correctAnswer = tItem.correctAnswer;
        var gazePath = tItem.gazePath;
        gazePath.map((gItem, gIndex) => {
          worksheet.addRow({
            id: participantId,
            hsi: hsi,
            question: questionId,
            trial: tIndex,
            category: gItem.category,
            start_time: gItem.startTime,
            end_time: gItem.endTime,
            duration: gItem.duration,
            fixation_x: gItem.position.X,
            fixation_y: gItem.position.Y,
            aoi: gItem.aoi,
            image: img,
            response_time: keyResponse.responseTime,
            answer: keyResponse.key,
            correct_answer: correctAnswer});
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
