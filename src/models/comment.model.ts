import mongoose from "mongoose"
const { Schema } = mongoose

const commentSchema = new mongoose.Schema({
  // 评论内容
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // 关联信息
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
  // 回复功能
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  
  // 状态控制
  isApproved: {
    type: Boolean,
    default: true // 默认评论直接显示，可根据需要调整
  },
  
  // 点赞功能
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

export default mongoose.model("Comment", commentSchema)