import sendResponse from './sendResponse.js'
export default (req, res, result) => {
  const apiNamespace = req.namespace('SUMOR_API')

  const name = apiNamespace.i18n('API_CALL_DEFAULT_TITLE')

  let moreContent = result
  if (typeof result !== 'string') {
    moreContent = JSON.stringify(result, null, 4)
  }

  const data = {
    svg: 'undraw_celebration', // 'undraw_data-processing',
    status: 200,
    json: {
      code: 'OK',
      data: result
    },
    html: {
      title: name,
      major: name,
      minor: '',
      showMore: false,
      moreButton: apiNamespace.i18n('API_CALL_SHOW_MORE'),
      moreContent
    }
  }

  sendResponse(req, res, data)
}
