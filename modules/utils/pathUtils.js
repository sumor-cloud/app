import path from 'path'

export function filterOneDot(files) {
  return files.filter(file => {
    const base = path.basename(file)
    return /^[^.]+\.[^.]+$/.test(base)
  })
}

export function filterDoubleDot(files) {
  return files.filter(file => {
    const base = path.basename(file)
    return /^[^.]+\.[^.]+\.[^.]+$/.test(base)
  })
}

export function getRelativePath(absDirectory, file) {
  absDirectory = path.normalize(absDirectory)
  file = path.normalize(file)

  let relative = file.replace(absDirectory, '')
  relative = relative.split('.')[0]
  relative = relative.replace(/\\/g, '/')
  relative = relative.replace(/^\//, '')
  return relative
}

export function joinPath(...paths) {
  if (paths.length === 0) return ''

  const normalizedPaths = paths.map(p => path.normalize(p))
  let result = normalizedPaths[0]

  for (let i = 1; i < normalizedPaths.length; i++) {
    if (path.isAbsolute(normalizedPaths[i])) {
      result = normalizedPaths[i]
    } else {
      result = path.join(result, normalizedPaths[i])
    }
  }

  return result
}
