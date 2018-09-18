function formatTime(date) {
  if (typeof time !== 'number' || time < 0) {
    return date
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDate() {
  var time = new Date()
  var year = time.getFullYear()
  var month = time.getMonth()
  month = month < 10 ? '0' + month : month
  var day = time.getDay()
  day = day < 10 ? '0' + day : day
  return [year, month, day].join('-')
}

function getTime() {
  var time = new Date()
  var hours = time.getHours()
  hours = hours < 10 ? '0' + hours : hours
  var minute = time.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = time.getSeconds()
  second = second < 10 ? '0' + second : second
  return [hours, minute, second].join(':')
}
function getWeek(len) {
  var weekday = new Array(7)
  weekday[0] = "周日";
  weekday[1] = "周一";
  weekday[2] = "周二";
  weekday[3] = "周三";
  weekday[4] = "周四";
  weekday[5] = "周五";
  weekday[6] = "周六";
  var result = [];
  var now = new Date();
  Date.prototype.getMonthDay = function () {
    return weekday[this.getDay()] + formatNumber(this.getMonth() + 1) + '月' + formatNumber(this.getDate()) + '日';
  }
  var str = '今天' + formatNumber(now.getMonth() + 1) + '月' + now.getDate() + '日';
  result.push(str);
  for (var i = 0; i < len - 1; i++) {
    now.setDate(now.getDate() + 1);
    result.push(now.getMonthDay())
  };
  return result;

}
module.exports = {
  formatTime: formatTime,
  getDate: getDate,
  getTime: getTime,
  getWeek: getWeek
}
