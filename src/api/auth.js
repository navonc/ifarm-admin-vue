import request from './request'

/**
 * 用户密码登录
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名或手机号
 * @param {string} data.password - 密码
 * @returns {Promise} 登录响应
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}



/**
 * 刷新Token
 * @param {Object} data - 刷新数据
 * @param {string} data.refreshToken - 刷新Token
 * @returns {Promise} 刷新响应
 */
export function refreshToken(data) {
  return request({
    url: '/auth/refresh',
    method: 'POST',
    data
  })
}

/**
 * 退出登录
 * @returns {Promise} 退出响应
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'POST'
  })
}

/**
 * 获取当前用户信息
 * @returns {Promise} 用户信息响应
 */
export function getUserProfile() {
  return request({
    url: '/auth/profile',
    method: 'GET'
  })
}

/**
 * 更新用户信息
 * @param {Object} data - 用户信息数据
 * @param {string} [data.nickname] - 用户昵称
 * @param {string} [data.avatar] - 头像地址
 * @param {string} [data.phone] - 手机号
 * @param {number} [data.gender] - 性别：0-未知，1-男，2-女
 * @returns {Promise} 更新响应
 */
export function updateUserProfile(data) {
  return request({
    url: '/auth/profile',
    method: 'PUT',
    data
  })
}
