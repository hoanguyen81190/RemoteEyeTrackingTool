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
const readAOIsWorker = require('./readAOIs.js');
/* eslint-disable no-console, global-require */
const fs = require('fs');
const del = require('del');
const ejs = require('ejs');
const webpack = require('webpack');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Listen to POST requests to /users
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
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
    else if (request === 'read aois') {
      let result = readAOIsWorker.readAOIs(user.fileName);
      res.json(result);
    }
    else if (request === 'save question') {
      saveJson(user.path, user.fileName, user.data);
      res.json({message: 'Successfully'});
    }
    else if (request === 'copy image') {
      copyImage(user.imageName, user.image, user.desPath);
      res.json({message: 'Successfully'});
    }
    else if (request === 'save data') {
      excelWorker.saveAsExcel(user.path, user.fileName, user.data);
      res.json({message: 'Successfully'});
    }
    else if(request === 'read stimuli data'){
      let result = readStimuliData(user.fileName);
      res.json(result);
    }
    else if(request === 'delete stimuli data'){
      let result = deleteStimuliData(user.path, user.fileName);
      res.json({message: 'Successfully'});
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
var port = 3000;
app.listen(port);

//check the existence of aois.json file, if it does not exist, create new one
function copyImage(imageName, image, desPath) {
  // console.log(image);
  if(!fs.existsSync(desPath)) {
    fs.mkdirSync(desPath);
  }
  // declare a regexp to match the non base64 first characters
  var dataUrlRegExp = /^data:image\/\w+;base64,/;
  // remove the "header" of the data URL via the regexp
  var base64Data = image.replace(dataUrlRegExp, "");
  // declare a binary buffer to hold decoded base64 data
  var imageBuffer = new Buffer(base64Data, "base64");
  fs.writeFile(desPath + '/' + imageName, imageBuffer, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log('image copied!');
    }
  });
}
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
      questionFolders.sort(function(a, b) {
        return a.split('Question')[1] - b.split('Question')[1];
      });
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

function deleteStimuliData(path, fileName) {
  if(fs.lstatSync(path + '/' + fileName).isDirectory()) {
    // console.log('is directory');
    // fs.rmdirSync(path + '/' + fileName, (err) => {
    //   if(err) {
    //     console.log("failed to delete local image: " + err);
    //   }
    //   else {
    //     console.log("successfully deleted local image");
    //   }
    // });
    deleteFolderRecursive(path + '/' + fileName);
    return;
  }
  fs.unlinkSync(path + '/' + fileName, (err) => {
    if(err) {
      console.log("failed to delete local image: " + err);
    }
    else {
      console.log("successfully deleted local image");
    }
  });
}

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
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

// TODO: Update configuration settings
const config = {
  title: 'React Static Boilerplate',        // Your website title
  url: 'https://rsb.kriasoft.com',          // Your website URL
  project: 'react-static-boilerplate',      // Firebase project. See README.md -> How to Deploy
  trackingID: 'UA-XXXXX-Y',                 // Google Analytics Site's ID
};

const tasks = new Map(); // The collection of automation tasks ('clean', 'build', 'publish', etc.)

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}

//
// Clean up the output directory
// -----------------------------------------------------------------------------
tasks.set('clean', () => del(['public/dist/*', '!public/dist/.git'], { dot: true }));

//
// Copy ./index.html into the /public folder
// -----------------------------------------------------------------------------
tasks.set('html', () => {
  const webpackConfig = require('./webpack.config');
  const assets = JSON.parse(fs.readFileSync('./public/dist/assets.json', 'utf8'));
  const template = fs.readFileSync('./public/index.ejs', 'utf8');
  const render = ejs.compile(template, { filename: './public/index.ejs' });
  const output = render({ debug: webpackConfig.debug, bundle: assets.main.js, config });
  fs.writeFileSync('./public/index.html', output, 'utf8');
});

//
// Generate sitemap.xml
// -----------------------------------------------------------------------------
tasks.set('sitemap', () => {
  const urls = require('./routes.json')
    .filter(x => !x.path.includes(':'))
    .map(x => ({ loc: x.path }));
  const template = fs.readFileSync('./public/sitemap.ejs', 'utf8');
  const render = ejs.compile(template, { filename: './public/sitemap.ejs' });
  const output = render({ config, urls });
  fs.writeFileSync('public/sitemap.xml', output, 'utf8');
});

//
// Bundle JavaScript, CSS and image files with Webpack
// -----------------------------------------------------------------------------
tasks.set('bundle', () => {
  const webpackConfig = require('./webpack.config');
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString(webpackConfig.stats));
        resolve();
      }
    });
  });
});

//
// Build website into a distributable format
// -----------------------------------------------------------------------------
tasks.set('build', () => {
  global.DEBUG = process.argv.includes('--debug') || false;
  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('bundle'))
    .then(() => run('html'))
    .then(() => run('sitemap'));
});

//
// Build and publish the website
// -----------------------------------------------------------------------------
tasks.set('publish', () => {
  const firebase = require('firebase-tools');
  return run('build')
    .then(() => firebase.login({ nonInteractive: false }))
    .then(() => firebase.deploy({
      project: config.project,
      cwd: __dirname,
    }))
    .then(() => { setTimeout(() => process.exit()); });
});

//
// Build website and launch it in a browser for testing (default)
// -----------------------------------------------------------------------------
tasks.set('start', () => {
  let count = 0;
  global.HMR = !process.argv.includes('--no-hmr'); // Hot Module Replacement (HMR)
  process.argv.includes('--no-autorestart');
  return run('clean').then(() => new Promise(resolve => {
    const bs = require('browser-sync').create();
    const webpackConfig = require('./webpack.config');
    const compiler = webpack(webpackConfig);
    // Node.js middleware that compiles application in watch mode with HMR support
    // http://webpack.github.io/docs/webpack-dev-middleware.html
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: webpackConfig.stats,
    });
    compiler.plugin('done', stats => {
      // Generate index.html page
      const bundle = stats.compilation.chunks.find(x => x.name === 'main').files[0];
      const template = fs.readFileSync('./public/index.ejs', 'utf8');
      const render = ejs.compile(template, { filename: './public/index.ejs' });
      const output = render({ debug: true, bundle: `/dist/${bundle}`, config });
      fs.writeFileSync('./public/index.html', output, 'utf8');

      // Launch Browsersync after the initial bundling is complete
      // For more information visit https://browsersync.io/docs/options
      if (++count === 1) {
        bs.init({
          port: process.env.PORT || 3000,
          ui: { port: Number(process.env.PORT || 3000) + 1 },
          server: {
            baseDir: 'public',
            middleware: [
              webpackDevMiddleware,
              require('webpack-hot-middleware')(compiler),
              require('connect-history-api-fallback')(),
            ],
          },
        }, resolve);
      }
    });
  }));
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);
