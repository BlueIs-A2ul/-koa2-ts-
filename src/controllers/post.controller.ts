import { Context } from 'koa'

import PostService from '../services/post.service'

import {
  PostCreateParams,
  PostDocumentType,
  PostQueryParams
} from "../types/post.type"

import {
  postUploadFail,
  postGetAllError,
  postGetByIdPowerError,  
} from "../constant/err.type"
import { Types } from 'mongoose'

class PostController { 
  public async createPost(ctx: Context) {
    const postData: PostCreateParams = (ctx.request as any).body
    const newPost = {
      ...postData,
      author: ctx.state.user._doc._id
    }

    try {
      const res = await PostService.createPost(newPost)

      ctx.body = {
        code: 200,
        message: '创建文章成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      postUploadFail.result = error
      ctx.app.emit('error', postUploadFail, ctx)
    }
  }

  public async getAllPosts(ctx: Context) {
    try {
      const {
        pageNum = 1,
        pageSize = 10,
        status,
        author,
      } = (ctx.request as any).query

      const query: PostQueryParams = {}

      if (author) {
        query.author = new Types.ObjectId(author)
      }
      
      if (status) {
        query.status = status
      } else {
        if (!ctx.state.user) {
          query.status = 'published'
        } else {
          const userId = ctx.state.user._doc._id
          query.$or = [
            { status: 'published' },
            { author: userId }
          ] as any
        }
      }

      const res = await PostService.getAllPosts(
        query,
        pageNum,
        pageSize,
      )

      if (res) {
        ctx.body = {
          code: 200,
          message: '获取文章列表成功',
          result: res
        }
      } else {
        postGetAllError.result = 'res为null'
        ctx.app.emit('error', postGetAllError, ctx)
      }
    }
    catch (error) {
      console.log(error)
      postGetAllError.result = error
      ctx.app.emit('error', postGetAllError, ctx)
    }
  }

  public async getPostByPostId(ctx: Context) {
    const id = (ctx.request as any).params.id
    const res = await PostService.getPostByPostId(id) as PostDocumentType

    const { status } = res as {status: string}
    if (status === 'private' || status === 'draft') {
      postGetByIdPowerError.result = '无权限'
      ctx.app.emit('error', postGetByIdPowerError, ctx)
      return 
    }

    ctx.body = {
      code: 200,
      message: '获取文章成功',
      result: res
    }
  }
  
}

export default new PostController()
