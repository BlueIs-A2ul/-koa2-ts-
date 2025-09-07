import Router from "koa-router"

const router = new Router({ prefix: '/users' })
import UserController from "../controllers/user.controller"
import { auth } from "../middlewares/auth.middleware"
import {
  userValidator,
  userVerify,
  cryptPassword,
  loginVerify,
} from "../middlewares/user.middleware"

/**
 * @function register
 * @description 注册
 * @param {string} username - 用户名-数据库保证唯一
 * @param {string} password - 密码
 * @param {string} confirmPassword - 确认密码
 * @method POST
 */
router.post('/register', userValidator, userVerify, cryptPassword, UserController.createUser)

/**
 * @function login
 * @description 登录
 * @param {string} username - 用户名-数据库保证唯一
 * @param {string} password - 密码
 * @method POST
 */
router.post('/login', userValidator, loginVerify, UserController.login)
/**
 * @function changePassword
 * @description 修改密码
 * @param {string} username - 用户名-数据库保证唯一
 * @param {string} password - 密码-这里是修改后的密码
 * @method PATCH
 */
router.patch('/', auth, cryptPassword, UserController.changePassword)

export default router 