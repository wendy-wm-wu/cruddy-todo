const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

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
  //readdirAsync will read the directory and the resolve will be the files and chain with then
  let promises = [];
  let result = [];
  fs.readdirAsync(`${exports.dataDir}`)
    .then(function(files) {
      for (let i = 0; i < files.length; i++) {
        // console.log(files);
        let obj = {};
        obj['id'] = files[i].slice(0, -4);
        result.push(obj);
        promises.push(fs.readFileAsync(`${exports.dataDir}/${files[i]}`, 'utf8'));
      }
      Promise.all(promises).then(function(values) {
        // console.log(values);
        for (let i = 0; i < values.length; i++) {
          result[i].text = values[i];
        }
        callback(null, result);
      })
    })
    .catch((err) => {
      console.log('Error:', err);
    });
  };

    // fs.readdirAsync(`${exports.dataDir}`, (err, files) => {
    //   if (err) {
    //     throw err;
    //   } else {
    //     callback(null, _.map(files, (item) => {
    //       console.log(item)
    //       return {id: item.slice(0, -4), text: item.slice(0, -4);
    //     });
    //   }
    // });
// };

exports.readOne = (id, callback) => {
  var text = items[id];
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id]; //text in the original
  if (!(fs.existsSync(`${exports.dataDir}/${id}.txt`))) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];

  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};



// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
