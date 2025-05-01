export default (req, res) => {
  const times = 100
  let result = ''
  for (let i = 0; i < times; i++) {
    result += 'Hello!'
  }

  return result
}
