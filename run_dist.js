/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
const excelWorker = require('./excelWorker.js');
/* eslint-disable no-console, global-require */
const fs = require('fs');
const path = require("path");
const express = require("express");
const webpack = require("webpack");
const config = require("./webpack.config");

const app           = express(),
      DIST_DIR      = path.join(__dirname, "dist"),
      HTML_FILE     = path.join(__dirname, "public", "index.html"),
      isDevelopment = process.env.NODE_ENV !== "production",
      DEFAULT_PORT  = 3000,
      compiler      = webpack(config);

app.set("port", process.env.PORT || DEFAULT_PORT);
var bodyParser = require('body-parser');

//Listen to POST requests to /users
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var router = express.Router();
router.post('/', function(req, res) {
  //get sent data
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var user = req.body;
  var request = user.request;
  // //handle request
  // console.log(req);
  // console.log(req.body);
  // console.log(user.fileName, user.data);
  try {
    if (request === 'save aois') {
      saveJson(user.path, user.fileName, user.data);
      res.json({message: 'Successfully'});
    }
    else if (request === 'save question') {
      saveJson(user.path, user.fileName, user.data);
      res.json({message: 'Success'});
    }
    else if (request === 'save data') {
      excelWorker.saveAsExcel(user.path, user.fileName, user.data);
      res.json({message: 'Success'});
    }
    else if(request === 'read stimuli data'){
      let result = readStimuliData(user.fileName);
      res.json(result);
    }
  }
  catch (err) {
    res.json({message: 'Failed'});
}});
router.get('/', function(req, res) {
  res.json({message: 'hooray'});
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', router);
app.use(express.static(path.join(__dirname, 'public')));
app.get(config, (req, res) => res.sendFile(HTML_FILE));
app.listen(app.get("port"));
console.log("listening on port", DEFAULT_PORT);

function ensureAOIsJson() {
  var aoiJson = './public/experiment/aois.json';
  var aoiJsonData = {
    AOIs: []
  };
  fs.stat(aoiJson, function(err, stat) {
    if(err == null) {
        console.log('File exists');
    } else if(err.code == 'ENOENT') {
        // file does not exist
        fs.writeFile(aoiJson, JSON.stringify(aoiJsonData, null, "\t"));
    } else {
        console.log('Some other error: ', err.code);
    }
  });
}
ensureAOIsJson();

function saveJson(path, fileName, data) {
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var fullFileName = path + '/' + fileName;
  fs.writeFile(fullFileName, data, function(err) {
    if(err) {
      console.error(err);
    }
    else {
      console.log('finished!');
    }
  });
  return;
};

function readStimuliData(dirname) {
  var hsiData = [];

  //Read in the HSI folders
  var hsiFolders = fs.readdirSync(dirname);
  for(var i = 0; i < hsiFolders.length; i++)
  {
    //For every hsi folder we create an hsi object to hold the hsi data.
    var hsi = {
      hsi: hsiFolders[i],
      questions: []
    };

    //check if the file is a dir
    if(fs.lstatSync(dirname + "/" + hsiFolders[i]).isDirectory())
    {
      //Read the question folders
      var questionFolders = fs.readdirSync(dirname + "/" + hsiFolders[i]);
      for(var y = 0; y < questionFolders.length; y++)
      {
        //check if the file is a dir
        if(fs.lstatSync(dirname + "/" + hsiFolders[i] + "/" + questionFolders[y]).isDirectory())
        {
          //For every question folder we create a question objct to hold the questions data
          var question = {
            question: questionFolders[y],
            blockInstructions: "",
            trials: []
          }

          //Read the question folders
          var trialDataFolders = fs.readdirSync(dirname + "/" + hsiFolders[i] + "/" + questionFolders[y]);
          for(var z = 0; z < trialDataFolders.length; z++){

            if(fs.lstatSync(dirname + "/" + hsiFolders[i] + "/" + questionFolders[y] + "/" + trialDataFolders[z]).isFile()){
              //Check if the file is a json file
              if(trialDataFolders[z].includes(".json"))
              {
                  //For every json file we read in the json data and add it to the questions trials list
                  var trial = JSON.parse(fs.readFileSync(dirname + "/" + hsiFolders[i] + "/" + questionFolders[y] + "/" + trialDataFolders[z], 'utf-8'));
                  question.trials.push(trial);

              }
              else if(trialDataFolders[z].includes(".txt")){
                var instructions = fs.readFileSync(dirname + "/" + hsiFolders[i] + "/" + questionFolders[y] + "/" + trialDataFolders[z], 'utf-8');
                instructions = instructions.replace(/\r?\n|\r/g, " ");
                instructions = instructions.trim();
                question.blockInstructions = instructions;
              }
            }
          }

          //Randomise the order the trials are given
          shuffleArray(question.trials);
          //Can seed the random generator to reliably get the same order if required

          //Add the question data to the hsi questions list
          hsi.questions.push(question);
        }
      }
    }

    //Add the hsi data to the list of hsi data
    hsiData.push(hsi);
  }

  //Return the list of hsi data
  return hsiData;
};

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
