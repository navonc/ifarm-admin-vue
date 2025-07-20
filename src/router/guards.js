/**
 * 路由守卫配置
 */

import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { requiresAuth, hasRoutePermission, getDefaultRedirectPath } from '@/utils/permission'

/**
 * 设置路由守卫
 * @param {Object} router - 路由实例
 */
export function setupRouterGuards(router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // 开发环境下输出路由信息
    if (import.meta.env.DEV) {
      console.log(`🚀 Route navigation: ${from.path} -> ${to.path}`)
      console.log('📍 Route info:', to)
    }

    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - iFarm智慧农场管理系统`
    }

    // 检查是否需要认证
    if (!requiresAuth(to)) {
      // 如果已登录且访问登录页，重定向到首页
      if (to.path === '/login' && authStore.isLoggedIn) {
        const redirectPath = getDefaultRedirectPath(authStore.userRole)
        next(redirectPath)
        return
      }
      next()
      return
    }

    // 需要认证的路由
    if (!authStore.isLoggedIn) {
      ElMessage.warning('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 检查用户是否有权限访问后台
    if (!authStore.canAccess) {
      ElMessage.error('您没有权限访问后台管理系统')
      next('/403')
      return
    }

    // 检查路由权限
    if (!hasRoutePermission(to, authStore.userRole)) {
      ElMessage.error('您没有权限访问该页面')
      next('/403')
      return
    }

    // 检查Token是否需要刷新
    try {
      await authStore.checkTokenRefresh()
    } catch (error) {
      console.error('Token刷新失败:', error)
      ElMessage.error('登录状态已过期，请重新登录')
      authStore.logout()
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    next()
  })

  // 全局后置钩子
  router.afterEach((to, from) => {
    // 可以在这里添加页面访问统计、埋点等逻辑
    console.log(`路由跳转: ${from.path} -> ${to.path}`)
  })

  // 全局解析守卫
  router.beforeResolve(async (to, from, next) => {
    // 可以在这里添加异步数据加载逻辑
    next()
  })
}

/**
 * 路由错误处理
 * @param {Object} router - 路由实例
 */
export function setupRouterErrorHandler(router) {
  router.onError((error) => {
    console.error('路由错误:', error)
    ElMessage.error('页面加载失败，请刷新重试')
  })
}
