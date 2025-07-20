/**
 * 认证相关工具函数
 */

/**
 * 用户类型映射
 */
export const USER_TYPES = {
  USER: 1,      // 普通用户
  FARMER: 2,    // 农场主
  ADMIN: 3      // 管理员
}

/**
 * 用户类型描述映射
 */
export const USER_TYPE_DESC = {
  [USER_TYPES.USER]: '普通用户',
  [USER_TYPES.FARMER]: '农场主',
  [USER_TYPES.ADMIN]: '管理员'
}

/**
 * 角色映射（用于路由权限）
 */
export const ROLES = {
  USER: 'user',
  FARMER: 'farmer',
  ADMIN: 'admin'
}

/**
 * 将用户类型转换为角色
 * @param {number} userType - 用户类型
 * @returns {string} 角色
 */
export function getUserRole(userType) {
  switch (userType) {
    case USER_TYPES.USER:
      return ROLES.USER
    case USER_TYPES.FARMER:
      return ROLES.FARMER
    case USER_TYPES.ADMIN:
      return ROLES.ADMIN
    default:
      return ROLES.USER
  }
}

/**
 * 检查用户是否有权限访问后台管理系统
 * @param {number} userType - 用户类型
 * @returns {boolean} 是否有权限
 */
export function canAccessAdmin(userType) {
  return userType === USER_TYPES.FARMER || userType === USER_TYPES.ADMIN
}

/**
 * 检查用户是否为管理员
 * @param {number} userType - 用户类型
 * @returns {boolean} 是否为管理员
 */
export function isAdmin(userType) {
  return userType === USER_TYPES.ADMIN
}

/**
 * 检查用户是否为农场主
 * @param {number} userType - 用户类型
 * @returns {boolean} 是否为农场主
 */
export function isFarmer(userType) {
  return userType === USER_TYPES.FARMER
}

/**
 * 检查用户是否有指定角色权限
 * @param {string} userRole - 用户角色
 * @param {string|Array} allowedRoles - 允许的角色
 * @returns {boolean} 是否有权限
 */
export function hasRole(userRole, allowedRoles) {
  if (!userRole || !allowedRoles) return false
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole)
  }
  
  return userRole === allowedRoles
}

/**
 * 验证Token是否有效（简单验证）
 * @param {string} token - JWT Token
 * @returns {boolean} 是否有效
 */
export function isTokenValid(token) {
  if (!token) return false
  
  try {
    // 简单的JWT格式验证
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // 解析payload检查过期时间
    const payload = JSON.parse(atob(parts[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    return payload.exp > currentTime
  } catch (error) {
    console.error('Token验证失败:', error)
    return false
  }
}

/**
 * 获取Token过期时间
 * @param {string} token - JWT Token
 * @returns {number|null} 过期时间戳
 */
export function getTokenExpiry(token) {
  if (!token) return null
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload.exp * 1000 // 转换为毫秒
  } catch (error) {
    console.error('获取Token过期时间失败:', error)
    return null
  }
}

/**
 * 检查Token是否即将过期（5分钟内）
 * @param {string} token - JWT Token
 * @returns {boolean} 是否即将过期
 */
export function isTokenExpiringSoon(token) {
  const expiry = getTokenExpiry(token)
  if (!expiry) return true
  
  const fiveMinutes = 5 * 60 * 1000 // 5分钟
  return (expiry - Date.now()) < fiveMinutes
}
