import sendResponse from './sendResponse.js'
export default (req, res) => {
  const apiNamespace = req.namespace('SUMOR_API')

  const name = apiNamespace.i18n('API_NOT_FOUND')
  const detail = apiNamespace.i18n('API_NOT_FOUND_DETAIL')

  const data = {
    svg: 'undraw_alert',
    status: 404,
    json: {
      code: 'API_NOT_FOUND',
      message: detail
    },
    html: {
      title: name,
      major: name,
      minor: detail,
      showMore: true,
      moreButton: '',
      moreContent: ''
    }
  }

  sendResponse(req, res, data)
}
