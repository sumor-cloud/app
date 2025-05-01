import multer from 'multer'
import fse from 'fs-extra'
import cleanupFiles from './cleanupFiles.js'

const uploadPath = `${process.cwd()}/tmp/uploads`
await fse.ensureDir(uploadPath)
const upload = multer({ dest: 'tmp/uploads/' })

export default api => {
  // 初始化上传器
  let uploader
  const parameters = api.parameters || {}
  const uploadParameters = []
  for (const name in parameters) {
    if (parameters[name].type === 'file') {
      uploadParameters.push({ name })
    }
  }
  if (uploadParameters.length > 0) {
    uploader = upload.fields(uploadParameters)
  }

  const middlewares = []

  middlewares.push((req, res, next) => {
    if (uploader) {
      uploader(req, res, err => {
        if (err) {
          throw err
        } else {
          const files = {}
          req.files = req.files || {}
          for (const name in req.files) {
            files[name] = files[name] || []
            for (const fileIndex in req.files[name]) {
              files[name].push({
                name: req.files[name][fileIndex].originalname,
                size: req.files[name][fileIndex].size,
                mime: req.files[name][fileIndex].mimetype,
                encoding: req.files[name][fileIndex].encoding,
                path: `${uploadPath}/${req.files[name][fileIndex].filename}`
              })
            }
          }
          req.files = files
          next()
        }
      })
    } else {
      next()
    }
  })

  middlewares.push((req, res, next) => {
    if (uploader) {
      res.on('finish', async () => {
        await cleanupFiles(req.files)
      })

      res.on('close', async () => {
        await cleanupFiles(req.files)
      })
    }

    next()
  })

  return middlewares
}
