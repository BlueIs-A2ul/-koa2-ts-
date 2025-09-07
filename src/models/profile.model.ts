import mongoose from "mongoose"
const { Schema } = mongoose

const profileSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    avatar: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    unique: true,
    sparse: true // 允许为空
  },
  firstName: String,
  lastName: String,
  bio: {
    type: String,
    maxlength: 500
  },
  birthday: Date,
  location: String,
  website: String,
  socialLinks: {
    twitter: String,
    github: String,
    linkedin: String
  }
}, {
  timestamps: true
})

export default mongoose.model("Profile", profileSchema)