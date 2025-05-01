import chalk from 'chalk'

const stringifyCMD = ({
  level = 'info',
  timestamp = Date.now(),
  namespace = 'default',
  id = ''
}) => {
  const date = new Date(timestamp)
  const formattedTimestamp = date.toISOString().replace('T', ' ').replace('Z', '')

  let colorFn
  switch (level) {
    case 'trace':
      colorFn = chalk.gray
      break
    case 'debug':
      colorFn = chalk.green
      break
    case 'info':
      colorFn = chalk.blue
      break
    case 'warn':
      colorFn = chalk.yellow
      break
    case 'error':
      colorFn = chalk.red
      break
    default:
      colorFn = chalk.white
  }

  const prefixes = []
  prefixes.push(formattedTimestamp)
  prefixes.push(level.toUpperCase())
  prefixes.push(namespace.toUpperCase())
  if (id) {
    prefixes.push(id)
  }
  const prefixString = prefixes
    .map(prefix => {
      return `[${prefix}]`
    })
    .join(' ')
  return colorFn(`${prefixString} -`)
}

export default stringifyCMD
