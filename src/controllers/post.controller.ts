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
  postUpdateFail,
  postDeleteFail,
  postLikeError,
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
      return
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
        return 
      }
    }
    catch (error) {
      console.log(error)
      postGetAllError.result = error
      ctx.app.emit('error', postGetAllError, ctx)
      return 
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
  
  public async updatePost(ctx: Context) { 
    try {
      const id = (ctx.request as any).params.id

      const res = await PostService.updatePost(id, (ctx.request as any).body)

      return ctx.body = {
        code: 200,
        message: '更新文章成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      postUpdateFail.result = error
      ctx.app.emit('error', postUpdateFail, ctx)
      return 
    }
  }

  public async deletePost(ctx: Context) { 
    try {
      const userId = ctx.state.user._doc._id
      const postId = (ctx.request as any).params.id
      console.log(userId, postId)
      const res = await PostService.deletePost(userId, postId)

      if (!res) {
        postDeleteFail.result = '删除失败'
        ctx.app.emit('error', postDeleteFail, ctx)
        return
      }
      ctx.body = {
        code: 200,
        message: '删除文章成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      postDeleteFail.result = error
      ctx.app.emit('error', postDeleteFail, ctx)
      return
    }
  }

  public async likePost(ctx: Context) {
    try {
      const userId = ctx.state.user._doc._id
      const postId = (ctx.request as any).params.id
      const res = await PostService.likePost(userId, postId)

      if (!res) {
        postLikeError.result = '点赞失败'
        ctx.app.emit('error', postLikeError, ctx)
        return
      }

      ctx.body = {
        code: 200,
        message: '点赞成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      postLikeError.result = error
      ctx.app.emit('error', postLikeError, ctx)
    }
  }
}

export default new PostController()
