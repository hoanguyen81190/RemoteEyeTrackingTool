var Excel = require('exceljs');

var exports = module.exports = {};
exports.saveAsExcel = function(fileName, data) {
  var jsonData = JSON.parse(data);
  if (!hsiData) {
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
      { header: 'Participant', key: 'id', width: 20 },
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

  // hsiData.map((item, index) => {
  //   worksheet.addRow({id: });
  // });

  // set an outline level for columns
  //worksheet.getColumn(4).outlineLevel = 0;

  // columns support a readonly field to indicate the collapsed state based on outlineLevel
  // expect(worksheet.getColumn(4).collapsed).to.equal(false);
  // expect(worksheet.getColumn(5).collapsed).to.equal(true);


  worksheet.spliceColumns(3, 1, newCol3Values, newCol4Values);
  workbook.xlsx.writeFile(fileName)
      .then(function() {
          // done
      });
}
