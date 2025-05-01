import bodyParser from 'body-parser'
import fileParser from './fileParser.js'
import mergeData from './mergeData.js'

const basicParsers = [
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  bodyParser.text()
]
export default api => {
  return [...basicParsers, ...fileParser(api), mergeData]
}
