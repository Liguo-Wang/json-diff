const compare = require('../');

const a = require('./a.json');
const b = require('./b.json');

const c = compare(a, b);

console.log('has difference: ', c);
