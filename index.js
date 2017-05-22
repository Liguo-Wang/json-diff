const chalk = require('chalk');
const { typeOf, log } = require('./lib/utils');
const jsonDiff = require('./lib/jsonDiff');
const printDiff = require('./lib/printDiff');


function compareJson(source, target, isOutLog = true) {
  const typeSource = typeOf(source);
  const typeTarget = typeOf(target);
  let flag = true;
  if (typeSource !== 'object' || typeSource !== typeTarget) {
    const error = chalk.red('Type Error: The type of source, target  must be same, and must be json object!');
    log(error);
  } else {
    const data = jsonDiff(source, target);
    flag = data.flag !== undefined ? data.flag : true;
    const diffData = printDiff(data.diff);
    if (isOutLog) {
      if (flag) {
        log(chalk.yellow('JSON diff result: \n'), diffData);
      } else {
        log(chalk.yellow('There is no difference between source and target'));
      }
    }
  }
  // if there is a difference between source and target, returning true
  return flag;
}

module.exports = compareJson;
