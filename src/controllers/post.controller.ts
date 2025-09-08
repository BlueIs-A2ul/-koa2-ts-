import { Context } from 'koa'

import PostService from '../services/post.service'

import {
  PostCreateParams,
  PostDocumentType,
  PostQueryParams,
} from "../types/post.type"

import {
  CommentCreateParams,
  CommentQueryParams
} from "../types/comment.type"

import {
  postUploadFail,
  postGetAllError,
  postGetByIdPowerError,  
  postUpdateFail,
  postDeleteFail,
  postLikeError,
  commentPostError,
  commentGetAllError,
  commentDeleteError,
  commentReplyError,
  commentLikeError,
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

  public async createComment(ctx: Context) {
    const postId = (ctx.request as any).params.id as Types.ObjectId
    const userId = ctx.state.user._doc._id
    const commentData: {
      content: string
    } = (ctx.request as any).body

    try {
      const res = await PostService.createComment({
        ...commentData,
        post: postId,
        author: userId
      } as CommentCreateParams)

      if (!res) {
        commentPostError.result = '创建评论失败'
        ctx.app.emit('error', commentPostError, ctx)
        return 
      }
      ctx.body = {
        code: 200,
        message: '创建评论成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      commentPostError.result = error
      ctx.app.emit('error', commentPostError, ctx)
    }
  }

  public async getAllComments(ctx: Context) { 
    try {
      const postId = (ctx.request as any).params.id as Types.ObjectId
      const { pageNum = 1, pageSize = 10 } = (ctx.request as any).query

      const res = await PostService.getAllComments({ post: postId }, pageNum, pageSize)

      if (!res) {
        commentGetAllError.result = '获取评论失败'
        ctx.app.emit('error', commentGetAllError, ctx)
        return
      }

      ctx.body = {
        code: 200,
        message: '获取评论成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      commentGetAllError.result = error
      ctx.app.emit('error', commentGetAllError, ctx)
    }
  }

  public async deleteComment(ctx: Context) { 
    try {
      const postId = (ctx.request as any).params.id as Types.ObjectId
      const userId = ctx.state.user._doc._id
      const commentId = (ctx.request as any).params.commentId

      const res = await PostService.deleteComment({postId, userId, commentId})
      if (!res || res instanceof String) {
        commentDeleteError.result = '删除评论失败'
        ctx.app.emit('error', commentDeleteError, ctx)
        return
      }

      ctx.body = {
        code: 200,
        message: '删除评论成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      commentDeleteError.result = error
      ctx.app.emit('error', commentDeleteError, ctx)
    }
  }

  public async replyComment(ctx: Context) {
    try { 
      const postId = (ctx.request as any).params.id as Types.ObjectId
      const userId = ctx.state.user._doc._id
      const commentId = (ctx.request as any).params.commentId
      const content = (ctx.request as any).body.content

      const res = await PostService.replyComment(
        { postId, userId, commentId },
        content
      )

      if (!res || typeof res === 'string') {
        commentReplyError.result = res === null ? '回复评论失败' : res as string
        ctx.app.emit('error', commentReplyError, ctx)
        return
      }

      ctx.body = {
        code: 200,
        message: '回复评论成功',
        result: res
      }
    }
    catch (error) {
      console.log(error)
      commentReplyError.result = error
      ctx.app.emit('error', commentReplyError, ctx)
    }
  }

  public async likeComment(ctx: Context) {
    try { 
      const userId = ctx.state.user._doc._id
      const commentId = (ctx.request as any).params.commentId
      const postId = (ctx.request as any).params.id as Types.ObjectId
      
      const res = await PostService.likeComment({ postId, userId, commentId })
      
      if (!res || typeof res === 'string') {
        commentLikeError.result = res === null ? '点赞评论失败' : res as string
        ctx.app.emit('error', commentLikeError, ctx)
        return
      }
      ctx.body = {
        code: 200,
        message: '点赞评论成功',
        result: res
      }
    }
    catch {
      commentLikeError.result = '点赞评论失败'
      ctx.app.emit('error', commentLikeError, ctx)
      return
    }
  }
}

export default new PostController()
