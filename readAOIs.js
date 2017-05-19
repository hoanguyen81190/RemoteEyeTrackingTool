const fs = require('fs');

var exports = module.exports = {};

exports.readAOIs = function(fileName) {
  fs.statSync(fileName, function(err, stat) {
    if(err == null) {
        console.log('File exists');
    } else if(err.code == 'ENOENT') {
        // file does not exist
        var aoiJsonData = {
          AOIs: []
        };
        fs.writeFile(fileName, JSON.stringify(aoiJsonData, null, "\t"));
    } else {
        console.log('Some other error: ', err.code);
    }
  });
  var AOIs = fs.readFileSync(fileName, 'utf-8');
  return AOIs;
}
