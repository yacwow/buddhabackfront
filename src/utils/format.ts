export function formatTimeFromStr(str: string) {
  let arrStr = str.split('T');
  let str1 = arrStr[0];
  let tempStr;
  if (arrStr.length > 1) {
    tempStr = arrStr[1].split('.');
    str1 = str1 + ' ' + tempStr[0];
  }

  return str1;
}

export function formatTimeWithHours(str: string) {
  const date = new Date(str);
  const year = date.getFullYear(); // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份（需注意月份从0开始）
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期
  const hours = String(date.getHours()).padStart(2, '0'); // 获取小时
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒数

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
