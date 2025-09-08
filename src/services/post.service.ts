import { Types } from "mongoose"
import Post from "../models/post.model"
import User from "../models/user.model"
import Comment from "../models/comment.model"

import {
  PostCreateParams,
  PostQueryParams,
  PostDocumentType,
  PostUpdateParams,
} from "../types/post.type"

import {
  CommentCreateParams,
  CommentQueryParams,
  CommentReplyParams,
  CommentDocumentType,
} from "../types/comment.type"

class PostService { 
  public async createPost(params: PostCreateParams) { 
    return await Post.create(params)
  }

  public async getAllPosts(query: PostQueryParams, pageNum: number, pageSize: number) {
    const skip = (pageNum - 1) * pageSize
    const filter: any = { ...query }
    
    // 处理 ObjectId 查询
    if (query.$or) {
      filter.$or = query.$or
      delete filter.status
    }
    
    const total = await Post.countDocuments(filter)
    const posts = await Post.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .select('-content -createdAt -updatedAt -__v')
    
    return {
      list: posts,
      pagination: {
        pageNum,
        pageSize,
        total
      }
    }
  }

  public async getPostByPostId(id: Types.ObjectId) {
    const res = await Post.findOne({ _id: id }) as PostDocumentType
    return res ? res : null 
  }

  public async updatePost(id: Types.ObjectId, params: PostUpdateParams) { 
    const res = await Post.findOneAndUpdate({ _id: id }, params, { new: true }) as PostDocumentType
    return res ? res : null
  }

  public async deletePost(userId:Types.ObjectId, postId: Types.ObjectId) { 
    const { author } = await Post.findById(postId)
    const { is_admin } = await User.findById(userId)
    if (author._id.toString() !== userId.toString() && !is_admin) {
      //不是作者也不是管理员
      return null
    }

    //是作者或者admin
    return await Post.findOneAndDelete({ _id: postId }).select('_id _title')
  }

  public async likePost(userId: Types.ObjectId, postId: Types.ObjectId) { 
    const post = await Post.findById(postId);
    if (!post) {
      return null;
    }

    const likeIndex = post.likes.indexOf(userId)
    let updatedPost

    if (likeIndex > -1) {
      // 用户已经点赞，现在取消点赞
      post.likes.splice(likeIndex, 1)
      updatedPost = await post.save()
    } else {
      // 用户未点赞，现在添加点赞
      post.likes.push(userId)
      updatedPost = await post.save()
    }

    return updatedPost
  }

  public async createComment(commentData: CommentCreateParams) {
    const res = await Comment.create(commentData)

    return res ? res : null
  }

  public async getAllComments(query: CommentQueryParams, pageNum: number, pageSize: number) {
    const skip = (pageNum - 1) * pageSize
    
    const total = await Comment.countDocuments(query)
    const comments = await Comment.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .select('-createdAt -updatedAt -__v')
    
    return {
      list: comments,
      pagination: {
        pageNum,
        pageSize,
        total
      }
    }
  }

  private async deleteChildrenComment(commentId: Types.ObjectId) {
    const deletedComment: CommentDocumentType[] = []
    const childComment: CommentDocumentType[] = await Comment.find({ parent: commentId })
    

    for (const comment of childComment) {

      const childDeleted = await this.deleteChildrenComment(comment._id)
      deletedComment.push(...childDeleted)
      
      const res = await Comment.findOneAndDelete({ _id: comment._id })
      if (res) {
        deletedComment.push(res)
      }
    }
    
    return deletedComment
  }

  public async deleteComment(commentQuery: CommentReplyParams) {
    const { commentId, postId, userId } = commentQuery
    const comment = await Comment.findOne({ _id: commentId, post: postId })
    
    if (!comment) {
      return '对应帖子评论不存在'
    }

    const { author } = comment
    const is_admin = await User.findById(userId)
    //如果是评论者
    const is_author = author._id.toString() === userId.toString()
    if (!is_author && !is_admin) {
      return '没有权限删除此评论'
    }

    if (comment.parent) {
      console.log('保留父评论，删除子评论')
      return await Comment.findOneAndDelete({ _id: commentId, post: postId })
    } else {
      console.log('删除父评论，连带所有子评论')
      const res = await this.deleteChildrenComment(commentId) as CommentDocumentType[]
      res.push(await Comment.findOneAndDelete({ _id: commentId, post: postId }))
      return res
    }
  }

  public async replyComment(commentQuery: CommentReplyParams, content: string) {
    const { commentId, postId, userId } = commentQuery
    const comment = await Comment.findOne({ _id: commentId, post: postId })
    
    if (!comment) {
      return '对应帖子评论不存在'
    }

    const res = await Comment.create({
      content,
      author: userId,
      post: postId,
      parent: commentId
    })

    return res ? res : null
  }

  public async likeComment(commentQuery: CommentReplyParams) { 
    const { commentId, postId, userId } = commentQuery
    const comment = await Comment.findOne({ _id: commentId, post: postId })
    
    if (!comment) {
      return '对应帖子评论不存在'
    }

    const likeIndex = comment.likes.indexOf(userId)

    let updatedComment

    if (likeIndex > -1) {
      // 用户已经点赞，现在取消点赞
      console.log('用户已经点赞，现在取消点赞')
      comment.likes.splice(likeIndex, 1)
      updatedComment = await comment.save()
    } else {
      // 用户未点赞，现在添加点赞
      console.log('用户未点赞，现在添加点赞')
      comment.likes.push(userId)
      updatedComment = await comment.save()
    }
    const result = updatedComment.toObject()
    delete result.createdAt
    delete result.updatedAt
    delete result.__v

    return result
  }
}

export default new PostService()