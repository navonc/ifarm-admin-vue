/**
 * API模块统一导出
 */

// 认证相关API
export * as authApi from './auth'

// 农场管理API
export * as farmApi from './modules/farm'

// 地块管理API
export * as plotApi from './modules/plot'

// 认养项目API
export * as projectApi from './modules/project'

// 订单管理API
export * as orderApi from './modules/order'

// 分类管理API
export * as categoryApi from './modules/category'

// 作物管理API
export * as cropApi from './modules/crop'

// 首页统计API
export * as dashboardApi from './modules/dashboard'

// 类型定义
export * from './types'

// 请求实例
export { default as request } from './request'

/**
 * API模块映射表
 * 用于动态导入和权限控制
 */
export const API_MODULES = {
  auth: () => import('./auth'),
  farm: () => import('./modules/farm'),
  plot: () => import('./modules/plot'),
  project: () => import('./modules/project'),
  order: () => import('./modules/order'),
  category: () => import('./modules/category'),
  crop: () => import('./modules/crop'),
  dashboard: () => import('./modules/dashboard')
}

/**
 * API权限映射
 * 定义不同角色可以访问的API模块
 */
export const API_PERMISSIONS = {
  admin: [
    'auth', 'farm', 'plot', 'project', 'order', 
    'category', 'crop', 'dashboard'
  ],
  farmer: [
    'auth', 'farm', 'plot', 'project', 'order', 
    'crop', 'dashboard'
  ],
  user: [
    'auth'
  ]
}

/**
 * 检查API访问权限
 * @param {string} module - API模块名
 * @param {string} userRole - 用户角色
 * @returns {boolean} 是否有权限
 */
export function hasApiPermission(module, userRole) {
  const allowedModules = API_PERMISSIONS[userRole] || []
  return allowedModules.includes(module)
}

/**
 * 获取用户可访问的API模块
 * @param {string} userRole - 用户角色
 * @returns {Array} 可访问的模块列表
 */
export function getAccessibleApiModules(userRole) {
  return API_PERMISSIONS[userRole] || []
}
