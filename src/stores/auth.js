import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import * as authApi from '@/api/auth'
import { tokenStorage } from '@/utils/storage'
import { getUserRole, canAccessAdmin, isTokenValid, isTokenExpiringSoon } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const accessToken = ref(tokenStorage.getAccessToken())
  const refreshToken = ref(tokenStorage.getRefreshToken())
  const userInfo = ref(tokenStorage.getUserInfo())
  const isLoading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => {
    return !!(accessToken.value && userInfo.value && isTokenValid(accessToken.value))
  })

  const userRole = computed(() => {
    return userInfo.value ? getUserRole(userInfo.value.userType) : null
  })

  const canAccess = computed(() => {
    return userInfo.value ? canAccessAdmin(userInfo.value.userType) : false
  })

  const userName = computed(() => {
    return userInfo.value?.nickname || userInfo.value?.username || '未知用户'
  })

  const userAvatar = computed(() => {
    return userInfo.value?.avatar || ''
  })

  // 方法
  /**
   * 用户登录
   * @param {Object} loginData - 登录数据
   * @returns {Promise<boolean>} 登录是否成功
   */
  async function login(loginData) {
    try {
      isLoading.value = true
      const response = await authApi.login(loginData)
      
      if (response.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, userInfo: newUserInfo } = response.data
        
        // 检查用户是否有权限访问后台
        if (!canAccessAdmin(newUserInfo.userType)) {
          ElMessage.error('您没有权限访问后台管理系统')
          return false
        }
        
        // 保存认证信息
        setAuthData(newAccessToken, newRefreshToken, newUserInfo)
        
        ElMessage.success('登录成功')
        return true
      }
      
      return false
    } catch (error) {
      console.error('登录失败:', error)
      ElMessage.error(error.message || '登录失败')
      return false
    } finally {
      isLoading.value = false
    }
  }



  /**
   * 刷新Token
   * @returns {Promise<boolean>} 刷新是否成功
   */
  async function refreshTokenAction() {
    try {
      if (!refreshToken.value) {
        throw new Error('没有刷新Token')
      }
      
      const response = await authApi.refreshToken({ refreshToken: refreshToken.value })
      
      if (response.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, userInfo: newUserInfo } = response.data
        setAuthData(newAccessToken, newRefreshToken, newUserInfo)
        return true
      }
      
      return false
    } catch (error) {
      console.error('刷新Token失败:', error)
      // 刷新失败，清除认证信息
      clearAuthData()
      return false
    }
  }

  /**
   * 退出登录
   */
  async function logout() {
    try {
      // 调用退出API
      if (accessToken.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('退出登录API调用失败:', error)
    } finally {
      // 无论API调用是否成功，都清除本地认证信息
      clearAuthData()
      ElMessage.success('已退出登录')
    }
  }

  /**
   * 获取用户信息
   * @returns {Promise<boolean>} 获取是否成功
   */
  async function fetchUserInfo() {
    try {
      const response = await authApi.getUserProfile()
      
      if (response.data) {
        userInfo.value = response.data
        tokenStorage.setUserInfo(response.data)
        return true
      }
      
      return false
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return false
    }
  }

  /**
   * 更新用户信息
   * @param {Object} updateData - 更新数据
   * @returns {Promise<boolean>} 更新是否成功
   */
  async function updateUserInfo(updateData) {
    try {
      isLoading.value = true
      const response = await authApi.updateUserProfile(updateData)
      
      if (response.data) {
        userInfo.value = { ...userInfo.value, ...response.data }
        tokenStorage.setUserInfo(userInfo.value)
        ElMessage.success('用户信息更新成功')
        return true
      }
      
      return false
    } catch (error) {
      console.error('更新用户信息失败:', error)
      ElMessage.error(error.message || '更新用户信息失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 设置认证数据
   * @param {string} newAccessToken - 访问Token
   * @param {string} newRefreshToken - 刷新Token
   * @param {Object} newUserInfo - 用户信息
   */
  function setAuthData(newAccessToken, newRefreshToken, newUserInfo) {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
    userInfo.value = newUserInfo
    
    // 保存到本地存储
    tokenStorage.setAccessToken(newAccessToken)
    tokenStorage.setRefreshToken(newRefreshToken)
    tokenStorage.setUserInfo(newUserInfo)
  }

  /**
   * 清除认证数据
   */
  function clearAuthData() {
    accessToken.value = null
    refreshToken.value = null
    userInfo.value = null
    
    // 清除本地存储
    tokenStorage.clearAll()
  }

  /**
   * 检查Token是否需要刷新
   * @returns {Promise<void>}
   */
  async function checkTokenRefresh() {
    if (accessToken.value && isTokenExpiringSoon(accessToken.value)) {
      await refreshTokenAction()
    }
  }

  return {
    // 状态
    accessToken,
    refreshToken,
    userInfo,
    isLoading,
    
    // 计算属性
    isLoggedIn,
    userRole,
    canAccess,
    userName,
    userAvatar,
    
    // 方法
    login,
    refreshToken: refreshTokenAction,
    logout,
    fetchUserInfo,
    updateUserInfo,
    setAuthData,
    clearAuthData,
    checkTokenRefresh
  }
})
