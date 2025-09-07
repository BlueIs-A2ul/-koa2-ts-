import { Types } from "mongoose"
import Profile from "../models/profile.model"

import { ProfileCreationAttributesType } from "../types/profile.type"

class ProfileService { 

  public async createProfile(userId: Types.ObjectId) {
    return await Profile.create({ userId })
  }

  public async getProfileByUserId(userId: Types.ObjectId) {
    return await Profile.findOne({ userId: userId })
  }

  public async updateProfileByUserId(userId: Types.ObjectId, profileData: ProfileCreationAttributesType) {
    const userProfile = await this.getProfileByUserId(userId)
    if (!userProfile) {
      console.log('用户档案不存在，正在创建用户档案...')
      await this.createProfile(userId)
    }
    
    const { userId:_, ...updateData } = profileData
    return await Profile.findOneAndUpdate(
      { userId: userId },
      updateData,
      { new: true, runValidators: true }
    ).select('-__v -_id -createdAt -updatedAt')
  }
}

export default new ProfileService();
