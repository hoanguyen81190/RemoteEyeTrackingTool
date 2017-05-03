var Excel = require('exceljs');

function saveAsExcel(fileName, data) {
  var workbook = new Excel.Workbook();

  workbook.creator = 'Me';
  workbook.lastModifiedBy = 'Her';
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);
  workbook.properties.date1904 = true;
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
  ]
  var worksheet = workbook.addWorksheet(data);
  worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 32 },
      { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
  ];

  // Access an individual columns by key, letter and 1-based column number
  var idCol = worksheet.getColumn('id');
  var nameCol = worksheet.getColumn('B');
  var dobCol = worksheet.getColumn(3);

  // set column properties

  // Note: will overwrite cell value C1
  dobCol.header = 'Date of Birth';

  // Note: this will overwrite cell values C1:C2
  dobCol.header = ['Date of Birth', 'A.K.A. D.O.B.'];

  // from this point on, this column will be indexed by 'dob' and not 'DOB'
  dobCol.key = 'dob';

  dobCol.width = 15;

  // Hide the column if you'd like
  dobCol.hidden = true;

  // set an outline level for columns
  worksheet.getColumn(4).outlineLevel = 0;
  worksheet.getColumn(5).outlineLevel = 1;

  // columns support a readonly field to indicate the collapsed state based on outlineLevel
  // expect(worksheet.getColumn(4).collapsed).to.equal(false);
  // expect(worksheet.getColumn(5).collapsed).to.equal(true);

  // iterate over all current cells in this column
  dobCol.eachCell(function(cell, rowNumber) {
      // ...
  });

  // iterate over all current cells in this column including empty cells
  dobCol.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
      // ...
  });

  // cut one or more columns (columns to the right are shifted left)
  // If column properties have been definde, they will be cut or moved accordingly
  // Known Issue: If a splice causes any merged cells to move, the results may be unpredictable
  worksheet.spliceColumns(3,2);

  // remove one column and insert two more.
  // Note: columns 4 and above will be shifted right by 1 column.
  // Also: If the worksheet has more rows than values in the colulmn inserts,
  //  the rows will still be shifted as if the values existed
  var newCol3Values = [1,2,3,4,5];
  var newCol4Values = ['one', 'two', 'three', 'four', 'five'];
  worksheet.spliceColumns(3, 1, newCol3Values, newCol4Values);
  workbook.xlsx.writeFile(fileName)
      .then(function() {
          // done
      });
}
