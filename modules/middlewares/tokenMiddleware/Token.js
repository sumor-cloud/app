import type from '../../utils/type.js'

export default class Token {
  constructor(req, onChange) {
    this._id = null
    this._user = null
    this._data = null
    this._permission = {}

    this._onChange = function () {
      if (this._user) {
        req.id = `${this._user}-${req.sequence}`
      } else {
        req.id = `ANONYMOUS-${req.sequence}`
      }
      const reqNamespace = req.namespace('req')
      req.i18n = reqNamespace.i18n
      req.logger = reqNamespace.logger
      req.Error = reqNamespace.Error
      if (onChange) {
        onChange(this.id)
      }
    }
    this._Error = req.namespace('SUMOR_TOKEN').Error

    this._onChange()
  }

  get id() {
    return this._id || ''
  }

  set id(id) {
    this._id = id
    this._onChange()
  }

  get data() {
    return this._data || {}
  }

  set data(val) {
    this._data = Object.assign({}, val)
    this._onChange()
  }

  get user() {
    return this._user || ''
  }

  set user(user) {
    this._user = user
    this._onChange()
  }

  get permission() {
    return this._permission
  }

  set permission(val) {
    const result = {}
    if (typeof val === 'string') {
      result[val] = []
    } else if (type(val) === 'array') {
      for (const item of val) {
        result[item] = []
      }
    } else if (type(val) === 'object') {
      for (const key in val) {
        if (type(val[key]) === 'array') {
          result[key] = val[key]
        } else if (type(val[key]) === 'string') {
          result[key] = [val[key]]
        } else {
          result[key] = []
        }
      }
    }
    this._permission = result
    this._onChange()
  }

  has(key, value) {
    let matched = false
    if (this._permission[key]) {
      if (value) {
        if (this._permission[key].indexOf(value) >= 0) {
          matched = true
        }
      } else {
        matched = true
      }
    }
    return matched
  }

  check(key, value) {
    if (!this.user) {
      // Check if the user is logged in
      throw new this._Error('LOGIN_EXPIRED')
    } else if (key) {
      // Check if the user has the required permission
      const lacked = !this.has(key, value)
      if (lacked) {
        const permission = value ? `${key}=${value}` : key
        throw new this._Error('PERMISSION_DENIED', { permission })
      }
    }
  }

  destroy() {
    this._id = null
    this._onChange()
  }
}
