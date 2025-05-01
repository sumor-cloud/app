import express from 'express'
import { getPortPromise } from 'portfinder'

// 启动网页服务显示覆盖率
const startServer = async dir => {
  const app = express()
  app.use(express.static(dir))
  const port = await getPortPromise({ port: 16100, stopPort: 16199 })
  const server = await new Promise(resolve => {
    const server = app.listen(port, () => {
      resolve(server)
    })
  })
  process.on('SIGINT', () => {
    server.close(() => {
      process.exit(0)
    })
  })

  return port
}

export default startServer
