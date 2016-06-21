var sortObj = function sortObj(arr) {
  var left;
  var right;
  var pivot;
  var pivotObj;
  var i;
  if (arr.length === 0) {
    return [];
  }

  left = [];
  right = [];
  pivot = arr[0].count;
  pivotObj = arr[0];

  for (i = 1; i < arr.length; i++) {
    arr[i]['count'] > pivot ? left.push(arr[i]) : right.push(arr[i]); //eslint-disable-line
  }
  return sortObj(left).concat(pivotObj, sortObj(right));
};

var mExtend = function mExtend(dest, src) {
  var tmp = {}; /* eslint-disable */
  for (var i in dest) {
    tmp[i] = dest[i];
  }
  for (var idx in src) { /* eslint-enable */
    tmp[idx] = src[idx];
  }
  return tmp;
};

var loseCode = function loseCode(str) {
  var hash = 0;
  var i = 0;
  var char;
  for (; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash += char;
  }
  return hash;
};

var formatDate = function formatDate(t, format) {
  var time;
  var result;
  var yyyy;
  var yy;
  var MM;
  var dd;
  var HH;
  var mm;
  var ss;
  var ms;
  format = format || 'yyyy-MM-dd HH:mm:ss.ms'; //eslint-disable-line
  if (!t) t = new Date(); //eslint-disable-line
  try {
    time = new Date(t);
    result = '';
    yyyy = '' + time.getFullYear();
    yy = yyyy.substr(-2);
    MM = ('000' + (time.getMonth() + 1)).substr(-2);
    dd = ('000' + time.getDate()).substr(-2);
    HH = ('000' + time.getHours()).substr(-2);
    mm = ('000' + time.getMinutes()).substr(-2);
    ss = ('000' + time.getSeconds()).substr(-2);
    ms = ('000' + time.getMilliseconds()).substr(-3);
    result = format.replace('yyyy', yyyy);
    result = result.replace('yy', yy);
    result = result.replace('MM', MM);
    result = result.replace('dd', dd);
    result = result.replace('HH', HH);
    result = result.replace('mm', mm);
    result = result.replace('ss', ss);
    result = result.replace('ms', ms);
    format = null; //eslint-disable-line
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * 将单个字段的值通过分隔符拆分开来，如：_id = '123`345'，
 * 按_id.0,_id.1拆分为 123和345 @wanzhou
 * @param data
 * @param field
 * @returns {string} 返回指定的字段值
 */
var splitFieldData = function splitFieldData(data, field) {
  var div;
  var arr;
  var result = null;
  if (~field.indexOf('.')) {
    div = field[0] || '`';
    field = field.substring(1); //eslint-disable-line
    arr = field.split('.');
    result = data[arr[0]].split(div)[parseInt(arr[1])]; //eslint-disable-line
    // result = specialCharReplace(result)
  } else {
    result = data[field];
  }
  return result;
};

/**
 * 替换报文转换中的特殊字符 @wanzhou
 * @param str 原字符串
 * @returns {string} 替换返回结果
 */
var specialCharReplace = function specialCharReplace(str) {
  str = str + '' || ''; //eslint-disable-line
  return str.replace(/\\u0026/g, '&').replace(/\\u002b/g, '+');
};

exports.sortObj = sortObj;
exports.mExtend = mExtend;
exports.mJsHash = loseCode;
exports.formatDate = formatDate;
exports.sFieldData = splitFieldData;
exports.sCharReplace = specialCharReplace;
