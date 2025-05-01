import alertPage from '../../../alertPage/index.js'

export default function sendResponse(req, res, data) {
  const accept = req.headers.accept
  const isJson = accept && accept.indexOf('application/json') !== -1

  if (isJson) {
    res.set('Content-Type', 'application/json;charset=utf-8')
    res.status(data.status).json(data.json)
  } else {
    res.set('Content-Type', 'text/html;charset=utf-8')
    res.status(data.status).send(
      alertPage({
        svg: data.svg,
        status: data.status,
        title: data.html.title,
        major: data.html.major,
        minor: data.html.minor,
        showMore: data.html.showMore,
        moreButton: data.html.moreButton,
        moreContent: data.html.moreContent
      })
    )
  }
}
