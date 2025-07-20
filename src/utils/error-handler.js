/**
 * 统一错误处理工具
 */

import { ElMessage, ElNotification } from 'element-plus'

// 错误类型枚举
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  BUSINESS: 'BUSINESS',
  PERMISSION: 'PERMISSION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
}

// 错误码映射
const ERROR_CODE_MAP = {
  // 网络错误
  'NETWORK_ERROR': {
    type: ERROR_TYPES.NETWORK,
    message: '网络连接失败，请检查网络后重试',
    suggestion: '请检查网络连接或稍后重试'
  },
  'TIMEOUT': {
    type: ERROR_TYPES.NETWORK,
    message: '请求超时，请稍后重试',
    suggestion: '网络较慢，请稍后重试'
  },
  
  // 权限错误
  401: {
    type: ERROR_TYPES.PERMISSION,
    message: '登录已过期，请重新登录',
    suggestion: '请重新登录后继续操作'
  },
  403: {
    type: ERROR_TYPES.PERMISSION,
    message: '没有权限执行此操作',
    suggestion: '请联系管理员获取相应权限'
  },
  
  // 业务错误
  400: {
    type: ERROR_TYPES.VALIDATION,
    message: '请求参数错误',
    suggestion: '请检查输入信息是否正确'
  },
  404: {
    type: ERROR_TYPES.BUSINESS,
    message: '请求的资源不存在',
    suggestion: '请刷新页面或联系管理员'
  },
  409: {
    type: ERROR_TYPES.BUSINESS,
    message: '数据冲突，操作失败',
    suggestion: '请刷新页面后重试'
  },
  
  // 服务器错误
  500: {
    type: ERROR_TYPES.SERVER,
    message: '服务器内部错误',
    suggestion: '服务器出现问题，请稍后重试或联系管理员'
  },
  502: {
    type: ERROR_TYPES.SERVER,
    message: '服务器网关错误',
    suggestion: '服务器暂时不可用，请稍后重试'
  },
  503: {
    type: ERROR_TYPES.SERVER,
    message: '服务暂时不可用',
    suggestion: '服务器正在维护，请稍后重试'
  }
}

// 业务错误码映射
const BUSINESS_ERROR_MAP = {
  'FARM_NOT_FOUND': '农场不存在或已被删除',
  'FARM_HAS_PLOTS': '农场下还有地块，无法删除',
  'FARM_HAS_PROJECTS': '农场下还有项目，无法删除',
  'FARM_DISABLED': '农场已被禁用',
  
  'PLOT_NOT_FOUND': '地块不存在或已被删除',
  'PLOT_HAS_PROJECTS': '地块下还有项目，无法删除',
  'PLOT_AREA_EXCEEDED': '地块面积超出农场总面积',
  'PLOT_STATUS_INVALID': '地块状态无效',
  
  'PROJECT_NOT_FOUND': '项目不存在或已被删除',
  'PROJECT_HAS_ORDERS': '项目下还有订单，无法删除',
  'PROJECT_STATUS_INVALID': '项目状态无效',
  'PROJECT_SOLD_OUT': '项目已售罄',
  
  'ORDER_NOT_FOUND': '订单不存在或已被删除',
  'ORDER_STATUS_INVALID': '订单状态无效',
  'ORDER_CANNOT_CANCEL': '订单无法取消',
  
  'UPLOAD_FAILED': '文件上传失败',
  'FILE_TOO_LARGE': '文件大小超出限制',
  'FILE_TYPE_INVALID': '文件类型不支持'
}

/**
 * 解析错误信息
 * @param {Error|Object} error - 错误对象
 * @returns {Object} 解析后的错误信息
 */
export function parseError(error) {
  let errorInfo = {
    type: ERROR_TYPES.UNKNOWN,
    code: 'UNKNOWN',
    message: '未知错误',
    suggestion: '请稍后重试或联系管理员',
    originalError: error
  }

  if (!error) {
    return errorInfo
  }

  // 网络错误
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return {
      ...errorInfo,
      ...ERROR_CODE_MAP['NETWORK_ERROR'],
      code: 'NETWORK_ERROR'
    }
  }

  // 超时错误
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return {
      ...errorInfo,
      ...ERROR_CODE_MAP['TIMEOUT'],
      code: 'TIMEOUT'
    }
  }

  // HTTP状态码错误
  if (error.response) {
    const status = error.response.status
    const data = error.response.data

    if (ERROR_CODE_MAP[status]) {
      errorInfo = {
        ...errorInfo,
        ...ERROR_CODE_MAP[status],
        code: status
      }
    }

    // 业务错误码
    if (data && data.code && BUSINESS_ERROR_MAP[data.code]) {
      errorInfo.message = BUSINESS_ERROR_MAP[data.code]
      errorInfo.type = ERROR_TYPES.BUSINESS
      errorInfo.code = data.code
    }

    // 服务器返回的错误信息
    if (data && data.message) {
      errorInfo.message = data.message
    }
  }

  // 普通错误对象
  if (error.message) {
    errorInfo.message = error.message
  }

  return errorInfo
}

/**
 * 显示错误信息
 * @param {Error|Object} error - 错误对象
 * @param {Object} options - 显示选项
 */
export function showError(error, options = {}) {
  const {
    showType = 'message', // message | notification
    duration = 3000,
    showSuggestion = true
  } = options

  const errorInfo = parseError(error)
  
  let content = errorInfo.message
  if (showSuggestion && errorInfo.suggestion) {
    content += `\n建议：${errorInfo.suggestion}`
  }

  if (showType === 'notification') {
    ElNotification({
      title: getErrorTitle(errorInfo.type),
      message: content,
      type: 'error',
      duration: duration,
      position: 'top-right'
    })
  } else {
    ElMessage({
      message: content,
      type: 'error',
      duration: duration,
      showClose: true
    })
  }

  // 记录错误日志
  logError(errorInfo)
}

/**
 * 获取错误标题
 * @param {string} errorType - 错误类型
 * @returns {string} 错误标题
 */
function getErrorTitle(errorType) {
  const titleMap = {
    [ERROR_TYPES.NETWORK]: '网络错误',
    [ERROR_TYPES.VALIDATION]: '验证错误',
    [ERROR_TYPES.BUSINESS]: '业务错误',
    [ERROR_TYPES.PERMISSION]: '权限错误',
    [ERROR_TYPES.SERVER]: '服务器错误',
    [ERROR_TYPES.UNKNOWN]: '未知错误'
  }
  
  return titleMap[errorType] || '错误'
}

/**
 * 记录错误日志
 * @param {Object} errorInfo - 错误信息
 */
function logError(errorInfo) {
  const logData = {
    timestamp: new Date().toISOString(),
    type: errorInfo.type,
    code: errorInfo.code,
    message: errorInfo.message,
    url: window.location.href,
    userAgent: navigator.userAgent,
    stack: errorInfo.originalError?.stack
  }

  // 开发环境打印到控制台
  if (import.meta.env.DEV) {
    console.group('🚨 Error Log')
    console.error('Error Info:', errorInfo)
    console.error('Log Data:', logData)
    console.groupEnd()
  }

  // 生产环境发送到日志服务
  if (import.meta.env.PROD) {
    // TODO: 发送到日志服务
    // sendErrorLog(logData)
  }
}

/**
 * 创建错误处理装饰器
 * @param {Object} options - 选项
 * @returns {Function} 装饰器函数
 */
export function withErrorHandler(options = {}) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args) {
      try {
        return await originalMethod.apply(this, args)
      } catch (error) {
        showError(error, options)
        
        // 如果有回调函数，执行回调
        if (options.onError) {
          options.onError(error)
        }
        
        // 根据配置决定是否重新抛出错误
        if (options.rethrow !== false) {
          throw error
        }
      }
    }

    return descriptor
  }
}

/**
 * 异步函数错误处理包装器
 * @param {Function} asyncFn - 异步函数
 * @param {Object} options - 选项
 * @returns {Function} 包装后的函数
 */
export function wrapAsyncFunction(asyncFn, options = {}) {
  return async function(...args) {
    try {
      return await asyncFn.apply(this, args)
    } catch (error) {
      showError(error, options)
      
      if (options.onError) {
        options.onError(error)
      }
      
      if (options.rethrow !== false) {
        throw error
      }
    }
  }
}

/**
 * 全局错误处理器
 * @param {Error} error - 错误对象
 * @param {Object} errorInfo - 错误信息
 */
export function globalErrorHandler(error, errorInfo) {
  console.error('Global Error:', error, errorInfo)
  
  // 记录全局错误
  logError({
    type: ERROR_TYPES.UNKNOWN,
    code: 'GLOBAL_ERROR',
    message: error.message || '全局未捕获错误',
    originalError: error,
    errorInfo
  })
}

/**
 * Promise 拒绝处理器
 * @param {Event} event - 拒绝事件
 */
export function unhandledRejectionHandler(event) {
  console.error('Unhandled Promise Rejection:', event.reason)
  
  showError(event.reason, {
    showType: 'notification',
    showSuggestion: false
  })
  
  // 阻止默认的控制台错误输出
  event.preventDefault()
}

// 导出错误处理相关的常量和工具
export {
  ERROR_CODE_MAP,
  BUSINESS_ERROR_MAP
}
