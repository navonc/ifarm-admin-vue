import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// 是否启用详细日志（开发环境）
const enableDetailedLogs = import.meta.env.DEV

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    // 构建完整的请求URL
    const fullUrl = `${config.baseURL}${config.url}`

    // 记录请求信息
    if (enableDetailedLogs) {
      console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${fullUrl}`)
      console.log('📍 URL:', fullUrl)
      console.log('🔧 Method:', config.method?.toUpperCase())
      console.log('📋 Headers:', config.headers)
      if (config.params) {
        console.log('🔍 Params:', config.params)
      }
      if (config.data) {
        console.log('📦 Data:', config.data)
      }
      console.log('⏰ Timestamp:', new Date().toLocaleString())
      console.groupEnd()
    }

    // 添加token到请求头
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
      if (enableDetailedLogs) {
        console.log('🔐 Token added to request')
      }
    }

    // 添加请求开始时间用于计算耗时
    config.metadata = { startTime: Date.now() }

    return config
  },
  (error) => {
    if (enableDetailedLogs) {
      console.group('❌ Request Error')
      console.error('Error details:', error)
      console.log('⏰ Timestamp:', new Date().toLocaleString())
      console.groupEnd()
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data, config, status } = response

    // 构建完整的请求URL
    const fullUrl = `${config.baseURL}${config.url}`

    // 记录响应信息
    if (enableDetailedLogs) {
      console.group(`✅ API Response: ${config.method?.toUpperCase()} ${fullUrl}`)
      console.log('📍 URL:', fullUrl)
      console.log('📊 Status:', status)
      console.log('📦 Response Data:', data)
      console.log('⏱️ Duration:', response.config.metadata?.startTime ?
        `${Date.now() - response.config.metadata.startTime}ms` : 'Unknown')
      console.log('⏰ Timestamp:', new Date().toLocaleString())
      console.groupEnd()
    }

    // 统一处理响应数据
    if (data.code === 200) {
      return data
    } else {
      // 处理业务错误
      if (enableDetailedLogs) {
        console.warn(`⚠️ Business Error [${data.code}]:`, data.message)
      }
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  async (error) => {
    const authStore = useAuthStore()
    const config = error.config || {}
    const fullUrl = config.baseURL && config.url ? `${config.baseURL}${config.url}` : 'Unknown URL'

    // 记录错误信息
    if (enableDetailedLogs) {
      console.group(`❌ API Error: ${config.method?.toUpperCase()} ${fullUrl}`)
      console.log('📍 URL:', fullUrl)
      console.log('🔧 Method:', config.method?.toUpperCase())
      console.log('❌ Error:', error)
    }

    if (error.response) {
      const { status, data, statusText } = error.response
      if (enableDetailedLogs) {
        console.log('📊 Status:', status, statusText)
        console.log('📦 Error Data:', data)
        console.log('📋 Response Headers:', error.response.headers)
      }

      switch (status) {
        case 401:
          if (enableDetailedLogs) {
            console.log('🔐 Token无效或过期，尝试刷新Token')
          }
          // Token无效或过期
          if (data.code === 401) {
            // 尝试刷新token
            try {
              if (enableDetailedLogs) {
                console.log('🔄 正在刷新Token...')
              }
              await authStore.refreshToken()
              if (enableDetailedLogs) {
                console.log('✅ Token刷新成功，重新发送请求')
              }
              // 重新发送原请求
              return request(error.config)
            } catch (refreshError) {
              if (enableDetailedLogs) {
                console.log('❌ Token刷新失败，跳转到登录页')
              }
              // 刷新失败，跳转到登录页
              authStore.logout()
              router.push('/login')
              ElMessage.error('登录已过期，请重新登录')
            }
          }
          break
        case 403:
          if (enableDetailedLogs) {
            console.log('🚫 权限不足')
          }
          ElMessage.error('权限不足')
          router.push('/403')
          break
        case 400:
          if (enableDetailedLogs) {
            console.log('📝 请求参数错误')
          }
          ElMessage.error(data.message || '请求参数错误')
          break
        case 500:
          if (enableDetailedLogs) {
            console.log('🔥 服务器内部错误')
          }
          ElMessage.error(data.message || '服务器内部错误')
          break
        default:
          if (enableDetailedLogs) {
            console.log('🌐 其他HTTP错误')
          }
          ElMessage.error(data.message || '网络错误')
      }
    } else if (error.request) {
      if (enableDetailedLogs) {
        console.log('🔌 网络连接失败')
        console.log('Request details:', error.request)
      }
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      if (enableDetailedLogs) {
        console.log('⚙️ 请求配置错误')
        console.log('Config error:', error.message)
      }
      ElMessage.error('请求配置错误')
    }

    if (enableDetailedLogs) {
      console.log('⏰ Timestamp:', new Date().toLocaleString())
      console.groupEnd()
    }

    return Promise.reject(error)
  }
)

export default request
