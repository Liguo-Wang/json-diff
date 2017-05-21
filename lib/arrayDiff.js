const _ = require('lodash');
const { typeOf } = require('./utils');
const jsonDiff = require('./jsonDiff');


module.exports = function arrayDiff(a, b) {
  const diff = [];
  let flag = false;
  if (!_.isArray(a) || !_.isArray(b)) {
    return null;
  }

  const lenA = a.length;
  const lenB = b.length;
  const len = lenA > lenB ? lenA : lenB;
  for (let i = 0; i < len; i += 1) {
    if (_.isArray(a[i]) && _.isArray(b[i])) {
      const diffData = arrayDiff(a[i], b[i]);
      if (diffData.flag) {
        flag = true;
        diff.push({
          key: i,
          type: 'array',
          action: 'diff',
          diff: diffData.diff,
        });
      } else {
        diff.push({
          key: i,
          type: 'array',
          action: 'common',
          diff: diffData.diff,
        });
      }
    } else if (_.isObject(a[i]) && _.isObject(b[i])) {
      const diffData = jsonDiff(a[i], b[i]);
      if (diffData.flag) {
        flag = true;
        diff.push({
          key: i,
          type: 'array',
          action: 'diff',
          diff: diffData.diff,
        });
      } else {
        diff.push({
          key: i,
          type: 'array',
          action: 'common',
          diff: diffData.diff,
        });
      }
    } else if (i >= lenA && i < lenB) {
      flag = true;
      // b add k
      diff.push({
        action: 'add',
        key: i,
        type: typeOf(b[i]),
        value: b[i],
      });
    } else if (i >= lenB && i < lenA) {
      flag = true;
      // b remove k
      diff.push({
        key: i,
        type: typeOf(a[i]),
        action: 'remove',
        value: a[i],
      });
    } else if (a[i] !== b[i]) {
      flag = true;
      diff.push({
        key: i,
        type: typeOf(a[i]),
        action: 'remove',
        value: a[i],
      }, {
        key: i,
        type: typeOf(b[i]),
        action: 'add',
        value: b[i],
      });
    } else {
      diff.push({
        key: i,
        type: typeOf(a[i]),
        action: 'common',
        value: a[i],
      });
    }
  }

  return { diff, flag };
};
