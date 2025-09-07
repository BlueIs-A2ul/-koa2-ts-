import User from '../models/user.model'
import Profile from '../models/profile.model'
import { Types } from 'mongoose'

import { UserQueryParams, UserDocumentType } from '../types/db.type'

class UserService {
  
  public async createUser(username: string, password: string) { 
    return await User.create({ username, password })
  }

  public async createProfile(userId: Types.ObjectId) {
    return await Profile.create({ userId })
  }

  public async getUserInfo({
    id,
    username,
    password,
    is_admin,
  }: UserQueryParams): Promise<UserDocumentType | null> {
    const whereOption: UserQueryParams|null = {}

    id && Object.assign(whereOption, { _id:id })
    username && Object.assign(whereOption, { username })
    password && Object.assign(whereOption, { password })
    is_admin && Object.assign(whereOption, { is_admin })

    const res:UserDocumentType | null = await User.findOne(
      whereOption,  // 查询条件
      'id username password is_admin' // 字段选择（投影）
    )

    return res ? res : null
  }

  public async updateById({
    id,
    username,
    password,
    is_admin,
  }: UserQueryParams): Promise<UserDocumentType | null> {
    const _id = id
    const whereOption = { _id }
    const newUser = {}
    username && Object.assign(newUser, { username })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })

    const res = await User.findOneAndUpdate(whereOption, newUser, {new:true})
    return res ? res : null
  }
}

export default new UserService()