/**
 * 权限相关工具函数
 */

import { hasRole } from './auth'

/**
 * 检查路由是否需要认证
 * @param {Object} route - 路由对象
 * @returns {boolean} 是否需要认证
 */
export function requiresAuth(route) {
  return route.matched.some(record => record.meta.requiresAuth)
}

/**
 * 检查用户是否有访问路由的权限
 * @param {Object} route - 路由对象
 * @param {string} userRole - 用户角色
 * @returns {boolean} 是否有权限
 */
export function hasRoutePermission(route, userRole) {
  // 如果路由不需要认证，直接允许访问
  if (!requiresAuth(route)) {
    return true
  }

  // 检查路由的角色权限
  const allowedRoles = getRouteAllowedRoles(route)
  if (!allowedRoles || allowedRoles.length === 0) {
    return true // 没有角色限制，认证用户都可以访问
  }

  return hasRole(userRole, allowedRoles)
}

/**
 * 获取路由允许的角色列表
 * @param {Object} route - 路由对象
 * @returns {Array} 允许的角色列表
 */
export function getRouteAllowedRoles(route) {
  // 从路由的meta中获取allowedRoles
  for (const record of route.matched) {
    if (record.meta.allowedRoles) {
      return record.meta.allowedRoles
    }
  }
  return []
}

/**
 * 过滤用户可访问的路由
 * @param {Array} routes - 路由列表
 * @param {string} userRole - 用户角色
 * @returns {Array} 过滤后的路由列表
 */
export function filterRoutesByRole(routes, userRole) {
  return routes.filter(route => {
    // 检查当前路由权限
    if (route.meta?.allowedRoles && !hasRole(userRole, route.meta.allowedRoles)) {
      return false
    }

    // 递归过滤子路由
    if (route.children && route.children.length > 0) {
      route.children = filterRoutesByRole(route.children, userRole)
    }

    return true
  })
}

/**
 * 生成导航菜单
 * @param {Array} routes - 路由列表
 * @param {string} userRole - 用户角色
 * @param {string} parentPath - 父路径
 * @returns {Array} 菜单列表
 */
export function generateMenus(routes, userRole, parentPath = '') {
  const menus = []

  routes.forEach(route => {
    // 跳过隐藏的菜单项
    if (route.meta?.hideInMenu) {
      return
    }

    // 检查权限
    if (route.meta?.allowedRoles && !hasRole(userRole, route.meta.allowedRoles)) {
      return
    }

    // 构建完整路径
    let fullPath
    if (parentPath) {
      // 子路由：父路径 + / + 子路径
      fullPath = `${parentPath}/${route.path}`
    } else {
      // 根级路由：直接使用路径，确保以/开头
      fullPath = route.path.startsWith('/') ? route.path : `/${route.path}`
    }

    // 开发环境下输出路径信息
    if (import.meta.env.DEV) {
      console.log(`📍 Menu path: ${route.path} -> ${fullPath} (parent: ${parentPath})`)
    }

    const menu = {
      name: route.name,
      path: fullPath,
      title: route.meta?.title || route.name,
      icon: route.meta?.icon,
      children: []
    }

    // 处理子路由
    if (route.children && route.children.length > 0) {
      menu.children = generateMenus(route.children, userRole, fullPath)

      // 如果所有子菜单都被过滤掉了，则不显示父菜单
      if (menu.children.length === 0 && route.meta?.hideWhenNoChildren) {
        return
      }
    }

    menus.push(menu)
  })

  return menus
}

/**
 * 检查菜单项是否应该显示
 * @param {Object} menuItem - 菜单项
 * @param {string} userRole - 用户角色
 * @returns {boolean} 是否显示
 */
export function shouldShowMenuItem(menuItem, userRole) {
  // 检查角色权限
  if (menuItem.allowedRoles && !hasRole(userRole, menuItem.allowedRoles)) {
    return false
  }

  // 检查是否隐藏
  if (menuItem.hidden) {
    return false
  }

  return true
}

/**
 * 获取面包屑导航
 * @param {Object} route - 当前路由
 * @returns {Array} 面包屑列表
 */
export function getBreadcrumbs(route) {
  const breadcrumbs = []
  
  route.matched.forEach(record => {
    if (record.meta?.title && !record.meta?.hideInBreadcrumb) {
      breadcrumbs.push({
        title: record.meta.title,
        path: record.path,
        name: record.name
      })
    }
  })

  return breadcrumbs
}

/**
 * 检查是否为外部链接
 * @param {string} path - 路径
 * @returns {boolean} 是否为外部链接
 */
export function isExternalLink(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 获取默认重定向路径
 * @param {string} userRole - 用户角色
 * @returns {string} 重定向路径
 */
export function getDefaultRedirectPath(userRole) {
  // 根据用户角色返回不同的默认页面
  switch (userRole) {
    case 'admin':
      return '/dashboard'
    case 'farmer':
      return '/dashboard'
    default:
      return '/403'
  }
}
