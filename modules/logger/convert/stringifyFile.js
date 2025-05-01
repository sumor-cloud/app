const stringifyFile = ({
  level = 'info',
  timestamp = Date.now(),
  namespace = 'DEFAULT',
  id = '',
  message = '',
  code = '',
  data = {}
}) => {
  // Encode message to Base64
  const encodedMessage = encodeURIComponent(message)
  const encodedData = encodeURIComponent(JSON.stringify(data))
  return JSON.stringify({
    level,
    timestamp,
    namespace,
    id,
    message: encodedMessage,
    code,
    data: encodedData
  })
}

export default stringifyFile
