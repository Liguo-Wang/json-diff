const chalk = require('chalk');

//
const colorMap = {
  '+': 'green',
  '-': 'red',
  '!': 'white',
};
//
function getAction(action) {
  switch (action) {
    case 'add':
      return '+';
    case 'remove':
      return '-';
    case 'diff':
      return '!';
    default:
      return ' ';
  }
}

// create indent
function indent(ind) {
  let s = '';
  while (s.length < ind * 2) { s += ' '; }
  return `${s}`;
}

// render diffent value
function render(value, ind, action) {
  const color = colorMap[action];
  let rst = '';
  const lines = JSON.stringify(value, null, 2).split('\n');
  const len = lines.length - 1;
  if (len > 1) {
    lines.forEach((v, index) => {
      let str = '';
      if (index === 0) {
        str = `${v.replace(' ', action)}\n`;
      } else if (index === len) {
        str = `${`${ind.replace(' ', action)} ${v}`}`;
      } else {
        str = `${`${ind.replace(' ', action)} ${v}`}\n`;
      }
      rst += chalk[color](str);
    });
  } else {
    rst += chalk[color](lines[0]);
  }
  return rst;
}

// print different content
function printDiff(data, topType = 'object', ind = 1, topAction = '!') {
  // the type of prev data
  const topIsObject = topType === 'object';
  let res = topType === 'object' ? ' {\n' : ' [\n';

  const len = data.length - 1;

  data.forEach((item, index) => {
    const comma = index === len ? '\n' : ',\n';
    let line = '';
    const action = getAction(item.action);

    if (action === '+' || action === '-' || action === '!') {
      // add flag and indent
      line += action.replace('!', ' ') + indent(ind);

      // append different content
      if (action === '!') {
        line += topIsObject ? `${item.key}:` : '';
        line += printDiff(item.diff, item.type, (ind + 1), action);
      } else {
        line += topIsObject ? `${item.key}:` : '';
        line += render(item.value, indent(ind), action) + comma;
      }
      //
      const color = colorMap[action];
      res += chalk[color](line);
    }
  });

  // last line
  const endColor = colorMap[topAction] || 'white';
  const endIndent = topAction.replace('!', ' ') + indent(ind - 1).slice(0, -1);
  res += chalk[endColor](`${endIndent}${topType === 'object' ? ' }\n' : ' ]\n'}`);
  return res;
}

module.exports = printDiff;
