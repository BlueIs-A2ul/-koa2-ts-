import bcrypt from 'bcryptjs'

import userService from '../services/user.service'

import {
  userFormateError,
  userAlreadyExists,
  userDBWriteError,
  userDoesNotExist,
  invalidPassword,
  userLoginError
} from '../constant/err.type'

import type { UserPostRegisterType, UserPostLoginType } from '../types/user.type'
import { Context } from 'koa'

const userValidator = async (ctx: Context, next:()=>Promise<any>) => {
  const body = (ctx.request as any).body as UserPostRegisterType
  const { username, password, confirmPassword } = body
  if (ctx.path === '/users/register') {
    if (!username || !password || !confirmPassword) {
    ctx.status = 400
    console.error('缺少必要参数')
    userFormateError.result = '用户名或密码不能为空'
    ctx.app.emit('error', userFormateError, ctx)
    return 
    }
    else if (password !== confirmPassword) {
      ctx.status = 400
      console.error('密码不一致')
      userFormateError.result = '两次密码不一致'
      ctx.app.emit('error', userFormateError, ctx)
      return 
    } else if (password.length < 6 || password.length > 20) {
      ctx.status = 400
      console.error('密码长度不符合要求')
      userFormateError.result = '密码长度不符合要求'
      ctx.app.emit('error', userFormateError, ctx)
      return
    }
  }
  if (ctx.path === '/users/login') {
    if (!username || !password) {
      ctx.status = 400
      console.error('缺少必要参数')
      userFormateError.result = '用户名或密码不能为空'
      ctx.app.emit('error', userFormateError, ctx)
      return
    }
  }

  await next()
}

const userVerify = async (ctx: Context, next: () => Promise<any>) => { 
  const {username}:{ username: string } = (ctx.request as any).body
  
  try {
    const res = await userService.getUserInfo({username})
    if (res) {
      //说明该username已经存在
      userAlreadyExists.result = '用户已存在'
      ctx.app.emit('error', userAlreadyExists, ctx)
      return 
    }
  }
  catch (e) {
    console.log(e)
    userDBWriteError.result = e
    return ctx.app.emit('error', userDBWriteError, ctx)
  }

  await next()
}

const cryptPassword = async (ctx:Context, next: () => Promise<any>) => { 
  const { password } = (ctx.request as any).body

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  //*加盐保存为密文

  const req = (ctx.request as any)
  req.body.password = hash

  await next()
}

const loginVerify = async (ctx:Context, next:() => Promise<any>) => { 
  //查询用户是否存在
  const { username, password} = (ctx.request as any).body as UserPostLoginType
  try {
    const res = await userService.getUserInfo({ username })
    if (!res) {
      console.error(`用户 ${username} 不存在`)
      return ctx.app.emit('error', userDoesNotExist, ctx)
    }

    //存在即验证密码
    if (!bcrypt.compareSync(password, res.password)) {
      console.error(`${username} 密码错误`)
      return ctx.app.emit('error', invalidPassword, ctx)
    }

  }
  catch (error) {
    console.error(error)
    userLoginError.result = error
    return ctx.app.emit('error', userLoginError, ctx)
  }
  
  await next()
}

export {
  userValidator,
  userVerify,
  cryptPassword,
  loginVerify,
}