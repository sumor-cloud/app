export default function (template, data) {
  data = data || {}
  return template.replace(/{(\w+)}/g, (_, key) => {
    const value = data[key]
    if (value === undefined || value === null) {
      return '?'
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return String(value)
  })
}
