import fse from 'fs-extra'

const cleanupFiles = async files => {
  if (!files) return

  for (const fileField in files) {
    const fileArray = files[fileField]
    for (const file of fileArray) {
      await fse.remove(file.path)
    }
  }
}

export default cleanupFiles
