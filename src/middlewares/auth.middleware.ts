import jwt from 'jsonwebtoken'

import ENV from "../config/config.default"

import {
  tokenExpiredError,
  invalidToken,
  unknownError,
} from "../constant/err.type"
import { Context } from 'koa'

const auth = async (ctx: Context, next:()=>Promise<any>) => { 
  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  if (!token) {
    console.log('token not invalid')
    return ctx.app.emit('error', tokenExpiredError, ctx)
  }
  try {
    const JWT_SECRET = ENV.JWT_SECRET
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  }
  catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        console.error('Token已过期')
        tokenExpiredError.result = error 
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效的Token')
        invalidToken.result = error
        return ctx.app.emit('error', invalidToken, ctx)
      default:
        return ctx.app.emit('error', unknownError, ctx)
    }
  }

  await next()
}

export {
  auth
}