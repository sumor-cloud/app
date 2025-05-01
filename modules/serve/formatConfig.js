export default config => {
  config = config || {}
  config.name = config.name || '轻呈云应用'
  config.desc = config.desc || ''
  config.port = config.port || 80
  return config
}
