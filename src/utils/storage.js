// 本地存储工具类

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ifarm_access_token',
  REFRESH_TOKEN: 'ifarm_refresh_token',
  USER_INFO: 'ifarm_user_info',
  REMEMBER_LOGIN: 'ifarm_remember_login'
}

/**
 * 设置localStorage
 * @param {string} key - 存储键
 * @param {any} value - 存储值
 */
export function setStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('设置localStorage失败:', error)
  }
}

/**
 * 获取localStorage
 * @param {string} key - 存储键
 * @param {any} defaultValue - 默认值
 * @returns {any} 存储值
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('获取localStorage失败:', error)
    return defaultValue
  }
}

/**
 * 删除localStorage
 * @param {string} key - 存储键
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('删除localStorage失败:', error)
  }
}

/**
 * 清空localStorage
 */
export function clearStorage() {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空localStorage失败:', error)
  }
}

/**
 * 设置sessionStorage
 * @param {string} key - 存储键
 * @param {any} value - 存储值
 */
export function setSessionStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('设置sessionStorage失败:', error)
  }
}

/**
 * 获取sessionStorage
 * @param {string} key - 存储键
 * @param {any} defaultValue - 默认值
 * @returns {any} 存储值
 */
export function getSessionStorage(key, defaultValue = null) {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('获取sessionStorage失败:', error)
    return defaultValue
  }
}

// Token相关存储方法
export const tokenStorage = {
  setAccessToken: (token) => setStorage(STORAGE_KEYS.ACCESS_TOKEN, token),
  getAccessToken: () => getStorage(STORAGE_KEYS.ACCESS_TOKEN),
  removeAccessToken: () => removeStorage(STORAGE_KEYS.ACCESS_TOKEN),
  
  setRefreshToken: (token) => setStorage(STORAGE_KEYS.REFRESH_TOKEN, token),
  getRefreshToken: () => getStorage(STORAGE_KEYS.REFRESH_TOKEN),
  removeRefreshToken: () => removeStorage(STORAGE_KEYS.REFRESH_TOKEN),
  
  setUserInfo: (userInfo) => setStorage(STORAGE_KEYS.USER_INFO, userInfo),
  getUserInfo: () => getStorage(STORAGE_KEYS.USER_INFO),
  removeUserInfo: () => removeStorage(STORAGE_KEYS.USER_INFO),
  
  setRememberLogin: (remember) => setStorage(STORAGE_KEYS.REMEMBER_LOGIN, remember),
  getRememberLogin: () => getStorage(STORAGE_KEYS.REMEMBER_LOGIN, false),
  
  clearAll: () => {
    removeStorage(STORAGE_KEYS.ACCESS_TOKEN)
    removeStorage(STORAGE_KEYS.REFRESH_TOKEN)
    removeStorage(STORAGE_KEYS.USER_INFO)
    removeStorage(STORAGE_KEYS.REMEMBER_LOGIN)
  }
}

export { STORAGE_KEYS }
