const parseFile = fileString => {
  const logs = fileString.split('\n')
  return logs
    .filter(o => o.trim() !== '')
    .map(o => {
      const log = JSON.parse(o)
      log.message = decodeURIComponent(log.message)
      const dataString = decodeURIComponent(log.data)
      log.data = JSON.parse(dataString)
      return log
    })
}

export default parseFile
