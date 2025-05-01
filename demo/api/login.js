export default (req, res, next) => {
  req.token.id = 'DEMO_TOKEN'
  req.token.user = 'DEMO_USER'
}
