export default async (req, res) => {
  const { token } = req

  token.id = 'DEMO_TOKEN'
  token.user = 'DEMO_USER'

  token.check('ADMIN')

  return {
    name: 'John Doe'
  }
}
