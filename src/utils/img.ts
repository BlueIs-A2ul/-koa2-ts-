import fs from 'fs'
import path from 'path'

/**
 * @function saveUploadFile
 * @description 保存上传的文件
 * @param file 
 * @param uploadDir 目标路径
 * @returns newFileName
 */
const saveUploadFile = async (file: any, uploadDir: string): Promise<string> => {
  // 确保上传目录存在
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  
  // 生成新的文件名，避免文件名冲突
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const ext = path.extname(file.originalFilename || file.newFilename || file.name || '')
  const newFileName = `${timestamp}_${randomString}${ext}`
  
  // 新的文件路径
  const newFilePath = path.join(uploadDir, newFileName)
  
  // 移动文件到目标位置
  fs.renameSync(file.filepath || file.path, newFilePath)
  
  // 返回文件名
  return newFileName
}

export {
  saveUploadFile
}
