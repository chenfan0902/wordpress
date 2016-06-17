exports.format_date = function expfunc(date) { /* eslint-disable */
  var year, month, day, hour, minute, second;
  date = date || new Date(); /* eslint-enable */
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();
  hour = date.getHours();
  minute = date.getMinutes();
  second = date.getSeconds();

  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0' : '') + second;

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
};

exports.$A = Array.from = function tmpfunc(iterable) {
  var results = [];
  var i;
  var length;
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  }
  for (i = 0, length = iterable.length; i < length; i++) {
    results.push(iterable[i]);
  }
  return results;
};
