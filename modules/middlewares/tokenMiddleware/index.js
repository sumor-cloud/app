import Token from './Token.js'
import parseCookie from './parseCookie.js'

export default app => {
  if (app.namespace) {
    app.use((req, res, next) => {
      const authorization = req.headers.authorization
      if (authorization) {
        req.token = new Token(req)
        if (authorization.startsWith('Bearer ')) {
          req.token._id = authorization.substring(7)
        }
      } else {
        req.token = new Token(req, id => {
          let existingCookie = res.getHeader('Set-Cookie') || []
          if (typeof existingCookie === 'string') {
            existingCookie = [existingCookie]
          }
          const maxAge = 100 * 24 * 60 * 60
          const newCookie = `t=${id}; Path=/; HttpOnly; Max-Age=${maxAge}`
          existingCookie = existingCookie.filter(c => !c.startsWith('t='))
          res.setHeader('Set-Cookie', [...existingCookie, newCookie])
        })

        const cookie = parseCookie(req.headers.cookie)
        req.token._id = cookie.t || null
      }

      next()
    })
  }
}
