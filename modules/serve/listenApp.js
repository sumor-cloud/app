export default async (app, port) => {
  return await new Promise(resolve => {
    const server = app.listen(port, () => {
      resolve(async () => {
        await new Promise(resolve => {
          server.close(resolve)
        })
      })
    })
  })
}
