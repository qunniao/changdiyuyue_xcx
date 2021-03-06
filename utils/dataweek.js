//得到时间格式2018-10-02
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//todate默认参数是当前日期，可以传入对应时间 todate格式为2018-10-05
function getDates(days, todate) {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ((date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? (date.getDate()) : date.getDate());
  var datevalues = new Date(date);
  var mounthtime = datevalues.getMonth() + 1
  var datetime = datevalues.getDate()
  if (mounthtime < 10){
    mounthtime = '0' + mounthtime
  }
  if(datetime < 10){
    datetime = '0' + datetime
  }
  var date_value = datevalues.getFullYear() + '-' + mounthtime + '-' + datetime
  dateObj.time = month + '.' + dayFormate;
  dateObj.week = show_day[day];
  dateObj.changetime = date_value
  return dateObj;
}

module.exports = {
  formatDate: formatDate,
  getDates: getDates
}