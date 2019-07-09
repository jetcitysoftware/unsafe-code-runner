'use strict';

const PHP = require('exec-php');
const Go = require('gonode').Go;
const {PythonShell} = require('python-shell');

const FUNCTIONS_PATH = './functions/';

function go(context, file) {

  const options = {
    path: `${FUNCTIONS_PATH}/${file}`,
    initAtOnce	: true,
  };

  return new Promise( (resolve, reject) => {

    let goRunner = new Go(options, (err) => {

      goRunner.execute(context, (result, response) => {
        resolve(response);
      });

      goRunner.close();

    });

  });

}

function php(context, file) {

  return new Promise( (resolve, reject) => {

    PHP(`${FUNCTIONS_PATH}/${file}`, function (error, run) {

      let contextString = JSON.stringify(context);

      run.app(contextString, (err, result, output, printed) => {
        let response = JSON.parse(result);
        resolve(response);
      });
    });

  });

}

function python(context, file) {

  let ctx = JSON.stringify(context);

  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: FUNCTIONS_PATH,
    args: ctx,
  };

  return new Promise( (resolve,reject) => {
    PythonShell.run(file, options, function (err, results) {
      if (err) { reject(err); }
      let response = JSON.parse(results[0]);
      resolve(response);
    });
  });

}

function javascript(context, file) {

  const app = require(`${FUNCTIONS_PATH}/${file}`);

  let response = typeof app === 'function' && app(context);

  return new Promise( (resolve, reject) => {
    resolve(response);
  });

}

module.exports = {javascript,go,php,python};
