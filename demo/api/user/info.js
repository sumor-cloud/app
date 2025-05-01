export default async (req, res) => {
  const { token } = req
  token.check()

  return {
    name: 'John Doe'
  }
}
