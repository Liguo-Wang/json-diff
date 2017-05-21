const _ = require('lodash');
const chalk = require('chalk');
const { typeOf, log } = require('./utils');
const arrayDiff = require('./arrayDiff');

function getKeys(a, b) {
  const keysA = _.keys(a);
  const keysB = _.keys(b);
  keysB.forEach((key) => {
    if (keysA.indexOf(key) < 0) {
      keysA.push(key);
    }
  });
  return keysA;
}

function jsonDiff(a, b) {
  const diff = [];
  let flag = false;
  const typeA = typeOf(a);
  const typeB = typeOf(b);

  if (typeA !== typeB) {
    log(chalk.red(`JSON DIFF ERROR: two params be the same: had ${typeA
    } and ${typeB}`));
    return null;
  }

  if (typeA === 'array') {
    return arrayDiff(a, b);
  }

  const keys = getKeys(a, b);
  keys.forEach((k) => {
    if (_.isArray(a[k]) && _.isArray(b[k])) {
      const diffData = arrayDiff(a[k], b[k]);
      if (diffData.flag) {
        flag = true;
        diff.push({
          key: k,
          type: 'array',
          action: 'diff',
          diff: diffData.diff,
        });
      } else {
        diff.push({
          key: k,
          type: 'array',
          action: 'common',
          value: diffData.diff,
        });
      }
    } else if (_.isObject(a[k]) && _.isObject(b[k]) && typeOf(a[k]) === typeOf(b[k])) {
      const diffData = jsonDiff(a[k], b[k]);
      if (diffData.flag) {
        flag = true;
        diff.push({
          key: k,
          type: 'object',
          action: 'diff',
          diff: diffData.diff,
        });
      } else {
        diff.push({
          key: k,
          type: 'object',
          action: 'common',
          value: diffData.diff,
        });
      }
    } else if (!_.has(a, k)) {
      flag = true;
        // b add k
      diff.push({
        key: k,
        type: typeOf(b[k]),
        action: 'add',
        value: b[k],
      });
    } else if (!_.has(b, k)) {
      flag = true;
        // b remove k
      diff.push({
        key: k,
        type: typeOf(a[k]),
        action: 'remove',
        value: a[k],
      });
    } else if (a[k] !== b[k]) {
      flag = true;
        // in(a,b), k'value changed
      diff.push({
        key: k,
        type: typeOf(a[k]),
        action: 'remove',
        value: a[k],
      }, {
        key: k,
        type: typeOf(b[k]),
        action: 'add',
        value: b[k],
      });
    } else {
      diff.push({
        key: k,
        type: typeOf(a[k]),
        action: 'common',
        value: a[k],
      });
    }
  });
  // console.log(diff);
  return { flag, diff };
}

module.exports = jsonDiff;
