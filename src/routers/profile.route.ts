import Router from "koa-router"

const router = new Router({ prefix: '/profiles' })
import profileController from "../controllers/profile.controller"
import { auth } from "../middlewares/auth.middleware"

/**
 * @function changeAvatar
 * @description 上传和修改头像
 * @param {File} avatar - 携带在body中
 * @method POST
 */
router.post('/avatar', auth, profileController.uploadAvatar)

/**
 * @function getProfile
 * @description 获取用户档案信息
 * @method GET
 */
router.get('/', auth, profileController.getProfile)

/**
 * @function updateProfile
 * @description 更新用户档案信息
 * @param {string} email - 邮箱
 * @param {string} firstName - 名
 * @param {string} lastName - 姓
 * @param {string} bio - 个人简介
 * @param {Date} birthday - 生日
 * @param {string} location - 地址
 * @param {string} website - 网站
 * @param {object} socialLinks - 社交链接
 * @method PATCH
 */
router.patch('/', auth, profileController.updateProfile)

export default router