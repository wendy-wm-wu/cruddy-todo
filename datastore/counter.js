const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);//what do we want to do if there's an error?
    } else {
      callback(null, Number(fileData));//what do we want to do if there is NOT an error?
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => { //specs file uses cb as a parameter
  //want to read, update, and write the new counter
  readCounter((err, id) => { //cb in readCounter takes in an err and an id
    //want to read first to make sure there are no errors
    //increment current counter before updating
    id++;
    writeCounter(id, callback); //writeCounter takes in the current count and a cb
  });

  //if readCounter doesn't pass an error
  //pass in writeCounter as the callback
  //if writeCounter doesn't pass an error
  //pass in getNextUniqueId as the callback
  //return callback of getNextUniqueId
  ////if error throw error
  ////perform callback to get number
  return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
