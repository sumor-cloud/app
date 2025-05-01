export default (req, res, next) => {
  req.data = { ...req.params, ...req.query, ...req.body, ...req.files }
  next()
}
