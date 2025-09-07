import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model("User", userSchema)