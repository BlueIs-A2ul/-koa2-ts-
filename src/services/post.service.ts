import { Types } from "mongoose"
import Post from "../models/post.model"

import {
  PostCreateParams,
  PostQueryParams,
  PostDocumentType
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
}

export default new PostService()