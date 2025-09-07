import { Context } from 'koa'
import path from 'path'

import { saveUploadFile } from '../utils/img'

import {
  PostCreateParams
} from '../types/post.type'
const postValidator = async (ctx: Context, next: () => Promise<any>) => { 
  const body = (ctx.request as any).body as PostCreateParams
  const { title, content } = body
  if (!title) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '标题不能为空',
      result: ''
    }
    return
  }
  
  if (title.length > 200) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '标题长度不能超过200个字符',
      result: ''
    }
    return
  }
  
  // 内容验证
  if (!content) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '内容不能为空',
      result: ''
    }
    return
  }

  const { status } = (ctx.request as any).body as { status:string }
  const validStatus = ['published', 'draft', 'private']
  if (status && !validStatus.includes(status)) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '状态值必须是 published, draft 或 private',
      result: ''
    }
    return
  }

  const { slug } = (ctx.request as any).body as { slug: string }
  if (!slug) {
    (ctx.request as any).body.slug = title.replace(/\s+/g, '-').toLowerCase()
  }

  await next()  
}

const postImgUploader = async (ctx: Context, next: () => Promise<any>) => { 
  const files = (ctx.request as any).files
  
  if (files && files.coverImage) {
    try {
      const coverImageFile = files.coverImage
      const fileType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      
      // 验证文件类型
      if (!fileType.includes(coverImageFile.mimetype)) {
        ctx.status = 400
        ctx.body = {
          code: 400,
          message: '封面图片格式不支持，仅支持 jpeg, png, gif, webp 格式',
          result: ''
        }
        return
      }
      
      // 验证文件大小（例如限制为5MB）
      if (coverImageFile.size > 5 * 1024 * 1024) {
        ctx.status = 400
        ctx.body = {
          code: 400,
          message: '封面图片大小不能超过5MB',
          result: ''
        }
        return
      }
      
      // 保存文件
      const coverUploadDir = path.join(__dirname, '../uploads/post_covers')
      const fileName = await saveUploadFile(coverImageFile, coverUploadDir)
      
      if (!(ctx.request as any).body) {
        (ctx.request as any).body = {}
      }
      ((ctx.request as any).body as any).coverImage = `/uploads/post_covers/${fileName}`
    } catch (error) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: '封面图片上传失败',
        result: error.message
      }
      return
    }
  }
  
  await next()
}

export {
  postValidator,
  postImgUploader,
}