/**
 * 日期格式化 时间戳 -> YYYY-MM-DD hh:mm:ss
 */
function dateFormat (date, format = 'YYYY-MM-DD hh:mm:ss') {
  if (+date === 0 || Number.isNaN(+date)) {
    // console.error(`invalid date: ${date}`);
    return '--'
  }

  const d = new Date(+date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const min = d.getMinutes()
  const sec = d.getSeconds()

  function pad (num) {
    return String(num).replace(/\b(\d)\b/g, '0$1')
  }

  return format.replace('YYYY', year)
    .replace(/MM/, pad(month))
    .replace(/\b(M)\b/, month)

    .replace(/DD/, pad(day))
    .replace(/\b(D)\b/, day)

    .replace(/hh/, pad(hour))
    .replace(/\b(h)\b/, hour)

    .replace(/mm/, pad(min))
    .replace(/\b(m)\b/, min)

    .replace(/ss/, pad(sec))
    .replace(/\b(s)\b/, sec)
}
exports.dateFormat = dateFormat

/**
 * 日期格式化 时间戳 -> YYYY-MM-DD hh:mm
 */
exports.dateFormatYMDHM = function (date) {
  return dateFormat(date, 'YYYY-MM-DD hh:mm')
}

/**
 * 日期格式化2 时间戳 -> YYYY.MM.DD
 */
exports.dateFormat2YMD = function (date) {
  return dateFormat(date, 'YYYY-MM-DD')
}

/**
 * 日期格式化3 时间戳 -> MM.DD
 */
exports.dateFormat2MD = function (date) {
  return dateFormat(date, 'MM-DD')
}
