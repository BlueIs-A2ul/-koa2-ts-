import path from 'path'

import koa from 'koa'
import koaParameter from 'koa-parameter'
import koaBody,{ HttpMethodEnum } from 'koa-body'

import router from '../routers/index'
import errorHandler from './errorHandler'
import connectDB from '../db/seq'

const app = new koa()

connectDB()

app.use(koaBody({
  multipart: true,
  formidable: {
    //*不推荐使用相对路径
    //*不是相对当前文件，而是相对process进程 
    uploadDir: path.join(__dirname,'../uploads'),
    keepExtensions: true,
  },
  parsedMethods: [ 
    HttpMethodEnum.POST, 
    HttpMethodEnum.PUT, 
    HttpMethodEnum.PATCH, 
    HttpMethodEnum.DELETE
  ]
}))

app.use(koaParameter(app))

app.use(router.routes())
app.use(router.allowedMethods())

app.on('error',errorHandler)

export default app