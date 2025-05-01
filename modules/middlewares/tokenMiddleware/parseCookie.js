// 扩展 parseCookie 函数，增加详细的变量命名和中文备注
export default function parseCookie(cookieString) {
  // 如果 cookieString 是 null 或 undefined，则将其设置为空字符串
  cookieString = cookieString || ''

  // 将 cookieString 按照分号分割成数组
  let cookieArray = cookieString.split(';')

  // 如果分割后的数组第一个元素是空字符串，则将数组置为空数组
  if (cookieArray[0] === '') {
    cookieArray = []
  }

  // 使用 reduce 方法将 cookieArray 转换为键值对对象
  return cookieArray.reduce((cookieObject, cookieItem) => {
    // 将每个 cookie 项按照等号分割为键和值
    const [key, value] = cookieItem.split('=')

    // 去除键的多余空格，并将键值对存入结果对象
    cookieObject[key.trim()] = value.trim() || null // 如果值不存在，则设置为 null

    return cookieObject // 返回累积的结果对象
  }, {}) // 初始值为一个空对象
}
