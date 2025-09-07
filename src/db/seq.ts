import mongoose from "mongoose"
import env from "../config/config.default"

const { MONGO_DB } = env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_DB)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  }
  catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB