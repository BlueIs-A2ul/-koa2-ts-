import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import Router from 'koa-router'

const router = new Router()
const files = readdirSync(__dirname).filter(file => file !== 'index.ts')

files.forEach((file) => {
  const module = require(join(__dirname, file))
  router.use(module.default?.routes?.() || module.routes?.())
})

export default router