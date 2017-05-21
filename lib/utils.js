const { isNumber, isNull, isObject, isString, isUndefined, isArray } = require('lodash');

// get the type of variable
function typeOf(variable) {
  if (isNull(variable)) {
    return 'null';
  }
  if (isUndefined(variable)) {
    return 'undefined';
  }
  if (isArray(variable)) {
    return 'array';
  }
  if (isObject(variable)) {
    return 'object';
  }
  if (isString(variable)) {
    return 'string';
  }
  if (isNumber(variable)) {
    return 'number';
  }
  return typeof (variable);
}

/* eslint no-console: "off"*/
const log = console.log;

module.exports = {
  typeOf,
  log,
};
