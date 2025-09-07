import mongoose from "mongoose"
const { Schema } = mongoose

const postSchema = new mongoose.Schema({
  // 基础信息
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200 
  },
  content: { 
    type: String, 
    required: true 
  },
  excerpt: { 
    type: String, 
    maxlength: 500 
  },
  
  // 标识信息
  slug: { 
    type: String, 
    unique: true, 
    lowercase: true 
  },
  
  // 状态控制
  status: { 
    type: String, 
    enum: ['published', 'draft', 'private'], 
    default: 'draft' 
  },
  isCommentAllowed: { 
    type: Boolean, 
    default: true 
  },
  
  // 关联关系
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 媒体信息
  coverImage: { 
    type: String 
  },
  images: [{ 
    type: String 
  }],
  
  // 统计信息
  views: { 
    type: Number, 
    default: 0 
  },
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // 时间信息
  publishedAt: { 
    type: Date 
  }
}, { 
  timestamps: true 
});


export default mongoose.model("Post", postSchema)