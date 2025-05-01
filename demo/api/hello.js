export default (req, res) => {
  const name = req.data.name
  return `Hello ${name}!`
}
