"use strict";

var readline = require('readline');

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

module.exports = function (question, callback) {
  var rl = createInterface();
  return new Promise(function (resolve) {
    rl.question(question + ': ', function (answer) {
      rl.close();
      return callback ? callback(answer) : resolve(answer);
    });
  }).catch(function (err) {
    rl.close();
    return Promise.reject(err);
  });
};