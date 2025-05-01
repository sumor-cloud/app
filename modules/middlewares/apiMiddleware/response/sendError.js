import sendResponse from './sendResponse.js'

export default (req, res, err) => {
  const apiNamespace = req.namespace('SUMOR_API')

  let error
  if (err.json) {
    error = err.json()
  } else {
    // 非可控错误
    error = {
      code: 'API_ERROR',
      message: apiNamespace.i18n('API_ERROR_UNKNOWN_ERROR')
    }
    apiNamespace.logger.error('API_ERROR_UNKNOWN_MESSAGE', {
      path: req.path
    })
    apiNamespace.logger.error(err)
  }

  let code
  let svg
  switch (error.code) {
    case 'API_PARAMETERS_NOT_VALID':
      code = 400
      svg = 'undraw_complete-form'
      break
    case 'LOGIN_EXPIRED':
      code = 401
      svg = 'undraw_login'
      break
    case 'PERMISSION_DENIED':
      code = 403
      svg = 'undraw_access-denied'
      break
    default:
      code = 500
      svg = 'undraw_alert'
      break
  }

  const data = {
    svg,
    status: code,
    json: error,
    html: {
      title: error.message,
      major: error.message,
      minor: '',
      showMore: true,
      moreButton: apiNamespace.i18n('API_ERROR_SHOW_MORE'),
      moreContent: JSON.stringify(error, null, 4)
    }
  }

  sendResponse(req, res, data)
}
