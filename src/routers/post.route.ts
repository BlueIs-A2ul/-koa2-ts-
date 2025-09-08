import Router from "koa-router"

import PostController from "../controllers/post.controller"
import { auth,validator } from "../middlewares/auth.middleware"
import {
  postValidator,
  postImgUploader,
 } from "../middlewares/post.middleware"

const router = new Router({ prefix: '/posts' })

/**
 * @function createPost
 * @description 创建帖子
 * @param {PostCreateParams} Object
 * @method POST
 */
router.post('/', auth, postValidator ,postImgUploader, PostController.createPost)

/**
 * @function getPosts
 * @description 获取帖子列表
 * @param {number} pageNum - 页码，默认为1
 * @param {number} pageSize - 每页数量，默认为10
 * @param {string} status - 帖子状态
 * @param {string} author - 作者ID
 * @method GET
 */
router.get('/',auth, PostController.getAllPosts)

/**
 * @function getPost
 * @description 获取单个帖子详情
 * @param {string} id - 帖子ID
 * @method GET
 */
router.get('/:id',auth, PostController.getPostByPostId)

/**
 * @function updatePost
 * @description 更新帖子
 * @param {string} id - 帖子ID
 * @param {PostUpdateParams} Object
 * @method PATCH
 */
router.patch('/:id', auth, postValidator, PostController.updatePost)

/**
 * @function deletePost
 * @description 删除帖子
 * @param {string} id - 帖子ID
 * @method DELETE
 */
router.delete('/:id', auth, PostController.deletePost)

/**
 * @function likePost
 * @description 点赞帖子
 * @param {string} id - 帖子ID
 * @method POST
 */
router.post('/:id/like', auth, PostController.likePost)

//以下是post的comment模块
/**
 * @function createComment
 * @description 创建评论
 * @param {string} id - 帖子ID
 * @param {CommentCreateParams} Object
 * @method POST
 */
router.post('/:id/comment', auth, validator({
  content: { type: 'string', required: true, message: '评论内容不能为空' },
}), PostController.createComment)

/** 
 * @function getComments
 * @description 获取评论列表
 * @param {string} id - 帖子ID
 * @param {number} pageNum - 页码，默认为1
 * @param {number} pageSize - 每页数量，默认为10
 * @method GET
 */
router.get('/:id/comment', auth, PostController.getAllComments)

/**
 * @function deleteComment
 * @description 删除评论
 * @param {string} id - 帖子ID
 * @param {string} commentId - 评论ID
 * @method DELETE
 */
router.delete('/:id/comment/:commentId', auth,PostController.deleteComment)
/**
 * @function replyComment
 * @description 回复评论
 * @param {string} id - 帖子ID
 * @param {string} commentId - 评论ID
 * @param {CommentCreateParams} Object
 * @method POST
 */
router.post('/:id/comment/:commentId', auth, validator({
  content: { type: 'string', required: true, message: '评论内容不能为空' },
}), PostController.replyComment)

/**
 * @function likeComment
 * @description 点赞评论
 * @param {string} id - 帖子ID
 * @param {string} commentId - 评论ID
 * @method POST
 */
router.post('/:id/comment/:commentId/like', auth, PostController.likeComment)


export default router