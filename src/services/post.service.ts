import { Types } from "mongoose"
import Post from "../models/post.model"
import User from "../models/user.model"
import {
  PostCreateParams,
  PostQueryParams,
  PostDocumentType,
  PostUpdateParams,
} from "../types/post.type"

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
}

export default new PostService()