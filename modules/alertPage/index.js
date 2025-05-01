import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatePath = path.join(__dirname, 'html', 'template.html')
const template = fs.readFileSync(templatePath, 'utf-8')

const svgHtml = {}

export default options => {
  const mainColor = options.status === 200 ? '#4CAF50' : '#e2583e'

  if (!svgHtml[options.svg]) {
    const svgPath = path.join(__dirname, 'html', options.svg + '.svg')
    let svg = fs.readFileSync(svgPath, 'utf-8')
    svg = svg.replace(/#6c63ff/g, mainColor)
    // Convert SVG to Base64
    const svgBase64 = Buffer.from(svg).toString('base64')
    const svgDataUri = `data:image/svg+xml;base64,${svgBase64}`
    svgHtml[options.svg] = template.replace('PLACEHOLDER-SVG', svgDataUri)
  }

  const showMore = options.showMore !== false
  const placeholder = {
    'PLACEHOLDER-TITLE': options.title,
    'PLACEHOLDER-MAJOR': options.major,
    'PLACEHOLDER-MINOR': options.minor ? `<p>${options.minor}</p>` : '',
    'PLACEHOLDER-MORE-BUTTON': options.moreButton,
    'PLACEHOLDER-MORE-CONTENT': options.moreContent
  }

  let result = svgHtml[options.svg]

  for (const [key, value] of Object.entries(placeholder)) {
    result = result.replace(new RegExp(key, 'g'), value)
  }
  if (!showMore) {
    result = result.replace('<!--PLACEHOLDER-SCRIPT-->', `<script>clickButton()</script>`)
  }
  result = result.replace(/\/\/ PLACEHOLDER-STYLE-COLOR/g, `color: ${mainColor};`)

  return result
}
