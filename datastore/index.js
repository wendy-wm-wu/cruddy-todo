const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    exports.initialize();
    fs.writeFile(`${exports.dataDir}/${id}.txt`, items[id], (err) => {
      if (err) {
        throw err;
      } else {
        callback(null, {id, text});
      }
    });
  });
  //check if there's a directory. If not, create one.
};

exports.readAll = (callback) => {
  fs.readdir(`${exports.dataDir}`, (err, files) => {
    if (err) {
      throw err;
    } else {
      callback(null, _.map(files, (item) => {
        return {id: item.slice(0, -4), text: item.slice(0, -4)};
      }));
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
