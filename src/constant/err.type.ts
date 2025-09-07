/**
 * 用户模块错误信息
 * @code 101都是用户注册登录注册的错误
 */
export const userFormateError = {
  code: '10100',
  message: '用户信息格式错误',
  result: ''
}

export const userDBWriteError = {
  code: '10101',
  message: '登录时数据库不知名错误',
  result: ''
}

export const userAlreadyExists = {
  code: '10102',
  message: '用户已存在',
  result: ''
}

export const userDoesNotExist = {
  code: '10103',
  message: '用户不存在',
  result: ''
}

export const invalidPassword= {
  code: '10104',
  message: '用户名或密码错误',
  result: ''
}

export const userLoginError = {
  code: '10105',
  message: '用户登录失败',
  result: ''
}

export const userChangePassword = {
  code: '10106',
  message: '用户修改密码失败',
  result: ''
}

export const searchUserError = {
  code: '10107',
  message: '用户搜索失败',
  result: ''
}

export const updateAvatarError = {
  code: '10108',
  message: '用户上传头像失败',
  result: ''
}

/**
 * 用户权限验证错误
 * @code 102都是用户权限验证的错误
 */

export const tokenExpiredError = {
  code: '10201',
  message: 'token已过期',
  result: ''
}

export const invalidToken = {
  code: '10202',
  message: '无效的token',
  result: ''
}

export const unknownError = {
  code: '10203',
  message: '未知token错误',
  result: ''
}

/**
 * post相关错误
 * @code 103都是用户权限验证的错误
 */

export const postUploadFail = {
  code: '10301',
  message: '上传文章失败',
  result: ''
}

export const postGetAllError = {
  code: '10302',
  message: '获取文章列表失败',
  result: ''
}

export const postGetByIdPowerError = {
  code: '10303',
  message: '获取文章失败',
  result: ''
}

/**
 * profile相关错误
 * @code 104都是用户profile相关的错误
 */

export const searchUserProfileError = {
  code: '10401',
  message: '',
  result: ''
}

export const updateProfileError = {
  code: '10402',
  message: '更新用户档案失败',
  result: ''
} 