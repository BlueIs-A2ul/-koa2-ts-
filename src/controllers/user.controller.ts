import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import ENV from "../config/config.default"

import UserService from '../services/user.service'

import {
  userDBWriteError,
  userLoginError,
  userChangePassword,
} from '../constant/err.type'
import { Types } from 'mongoose'

class UserController { 
  public async createUser(ctx: Context) {
    const { username, password } = (ctx.request as any).body
    try {
      const res = await UserService.createUser(username, password)
      const profileRes = await UserService.createProfile(res._id)
      ctx.body = {
        code: 200,
        message: '注册成功',
        result:{
          res: res._id,
          profileRes,
          username: res.username
        }
      }
    }
    catch (e) {
      console.log(e)
      userDBWriteError.result = e
      ctx.app.emit('error', userDBWriteError, ctx)
      return
    }
  }

  public async login(ctx: Context) { 
    const { username } = (ctx.request as any).body
    try {
      const res = await UserService.getUserInfo({ username })
      const { password, ...resUser } = res
      const JWT_SECRET = ENV.JWT_SECRET

      ctx.body = {
        code: 200,
        message: '登录成功',
        result: {
          token: jwt.sign(resUser, JWT_SECRET, { expiresIn: '20d' })
        }
      }
    }
    catch (e) {
      console.log(`${username}登录失败=>${e}`)
      userLoginError.result = e
      ctx.app.emit('error', userLoginError, ctx)
    }
  }

  public async changePassword(ctx: Context) { 
    const id = ctx.state.user._doc._id as Types.ObjectId
    const password = (ctx.request as any).body.password
    try {
      const res = await UserService.updateById({ id, password })
      //返回结果
      if (res) {
        ctx.body = {
          code: '0',
          message: '修改密码成功',
          result: ''
        }
        return 
      } else {
        userChangePassword.result = '修改密码失败'
        ctx.app.emit('error', userChangePassword, ctx)
        return
      }
    }
    catch (error) {
      console.error('修改密码错误', error)
      userChangePassword.result = error
      ctx.app.emit('error', userChangePassword, ctx)
      return
    }
  }
}

export default new UserController()