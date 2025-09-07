import path from 'path'
import { Context } from "koa"
import { Types } from "mongoose"

import {
  userDBWriteError,
  searchUserError,
  updateAvatarError,
  updateProfileError,
} from "../constant/err.type"

import profileService from '../services/profile.service'

import { saveUploadFile } from '../utils/img'

class ProfileController { 
  public async uploadAvatar(ctx: Context) {
    const id = ctx.state.user._doc._id as Types.ObjectId
    const { avatar } = (ctx.request as any).files
    const fileType = ['image/jpeg', 'image/png']
    if (avatar) {
      if (!fileType.includes(avatar.mimetype)) {
        ctx.app.emit('error', userDBWriteError, ctx)
        return
      }

      const avatarUploadDir = path.join(__dirname, '../uploads/avatar.uploads')

      const newFileName = await saveUploadFile(avatar, avatarUploadDir)

      const res = await profileService.updateProfileByUserId(id, { 
        userId: id,
        avatar: newFileName
      })

      if (!res) {
        searchUserError.result = '找不到对应用户'
        ctx.app.emit('error', searchUserError, ctx)
      }
      ctx.body = {
        code: 0,
        message: '上传成功',
        result: {
          res: res,
          goods_img: path.basename(newFileName)
        },
      }
    } else {
      updateAvatarError.result = '用户上传头像失败'
      ctx.app.emit('error', updateAvatarError, ctx)
      return 
    }
  }

  public async getProfile(ctx: Context) {
    const userId = ctx.state.user._doc._id as Types.ObjectId;
    
    try {
      const profile = await profileService.getProfileByUserId(userId);
      
      if (!profile) {
        const newProfile = await profileService.createProfile(userId);
        ctx.body = {
          code: 200,
          message: '获取档案成功',
          result: newProfile
        };
        return;
      }

      ctx.body = {
        code: 200,
        message: '获取档案成功',
        result: profile
      };
    } catch (err) {
      console.error('获取用户档案失败:', err);
      searchUserError.result = '找不到用户档案';
      ctx.app.emit('error', searchUserError, ctx);
    }
  }

  public async updateProfile(ctx: Context) {
    const userId = ctx.state.user._doc._id as Types.ObjectId;
    const profileData = (ctx.request as any).body;
    
    try {
      delete profileData.user;
      delete profileData.avatar;
      
      const profile = await profileService.updateProfileByUserId(userId, profileData);
      
      if (!profile) {
        ctx.app.emit('error', searchUserError, ctx);
        return;
      }

      ctx.body = {
        code: 200,
        message: '更新档案成功',
        result: profile
      };
    } catch (err) {
      console.error('更新用户档案失败:', err);
      updateProfileError.result = '更新用户档案失败';
      ctx.app.emit('error', updateProfileError, ctx);
    }
  }
}

export default new ProfileController()