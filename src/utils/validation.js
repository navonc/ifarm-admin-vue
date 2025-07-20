/**
 * 表单验证工具
 */

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function validatePhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证经度
 * @param {number} longitude - 经度
 * @returns {boolean} 是否有效
 */
export function validateLongitude(longitude) {
  return typeof longitude === 'number' && longitude >= -180 && longitude <= 180
}

/**
 * 验证纬度
 * @param {number} latitude - 纬度
 * @returns {boolean} 是否有效
 */
export function validateLatitude(latitude) {
  return typeof latitude === 'number' && latitude >= -90 && latitude <= 90
}

/**
 * 验证图片文件
 * @param {File} file - 文件对象
 * @param {Object} options - 验证选项
 * @returns {Object} 验证结果
 */
export function validateImageFile(file, options = {}) {
  const {
    maxSize = 2 * 1024 * 1024, // 默认2MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
    minWidth = 0,
    minHeight = 0,
    maxWidth = Infinity,
    maxHeight = Infinity
  } = options

  const result = {
    valid: true,
    errors: []
  }

  // 检查文件类型
  if (!allowedTypes.includes(file.type)) {
    result.valid = false
    result.errors.push(`只支持 ${allowedTypes.map(type => type.split('/')[1].toUpperCase()).join('、')} 格式`)
  }

  // 检查文件大小
  if (file.size > maxSize) {
    result.valid = false
    result.errors.push(`文件大小不能超过 ${formatFileSize(maxSize)}`)
  }

  return result
}

/**
 * 验证坐标字符串
 * @param {string} coordinates - 坐标字符串
 * @returns {Object} 验证结果
 */
export function validateCoordinates(coordinates) {
  const result = {
    valid: true,
    errors: [],
    parsed: null
  }

  if (!coordinates || !coordinates.trim()) {
    result.valid = false
    result.errors.push('坐标不能为空')
    return result
  }

  try {
    // 支持单点坐标：经度,纬度
    // 支持多点坐标：经度1,纬度1;经度2,纬度2
    const points = coordinates.split(';').map(point => {
      const [lng, lat] = point.trim().split(',').map(coord => {
        const num = parseFloat(coord.trim())
        if (isNaN(num)) {
          throw new Error('坐标格式错误')
        }
        return num
      })

      if (!validateLongitude(lng)) {
        throw new Error(`经度 ${lng} 超出有效范围 (-180 到 180)`)
      }

      if (!validateLatitude(lat)) {
        throw new Error(`纬度 ${lat} 超出有效范围 (-90 到 90)`)
      }

      return [lng, lat]
    })

    if (points.length === 1) {
      result.parsed = {
        type: 'point',
        coordinates: points[0]
      }
    } else {
      result.parsed = {
        type: 'polygon',
        coordinates: points
      }
    }
  } catch (error) {
    result.valid = false
    result.errors.push(error.message)
  }

  return result
}

/**
 * 验证面积范围
 * @param {number} area - 面积
 * @param {Object} options - 验证选项
 * @returns {Object} 验证结果
 */
export function validateArea(area, options = {}) {
  const {
    min = 0.01,
    max = 10000,
    precision = 2
  } = options

  const result = {
    valid: true,
    errors: []
  }

  if (typeof area !== 'number' || isNaN(area)) {
    result.valid = false
    result.errors.push('面积必须是数字')
    return result
  }

  if (area < min) {
    result.valid = false
    result.errors.push(`面积不能小于 ${min} 亩`)
  }

  if (area > max) {
    result.valid = false
    result.errors.push(`面积不能大于 ${max} 亩`)
  }

  // 检查小数位数
  const decimalPlaces = (area.toString().split('.')[1] || '').length
  if (decimalPlaces > precision) {
    result.valid = false
    result.errors.push(`面积小数位数不能超过 ${precision} 位`)
  }

  return result
}

/**
 * 验证价格
 * @param {number} price - 价格
 * @param {Object} options - 验证选项
 * @returns {Object} 验证结果
 */
export function validatePrice(price, options = {}) {
  const {
    min = 0,
    max = 999999,
    precision = 2
  } = options

  const result = {
    valid: true,
    errors: []
  }

  if (typeof price !== 'number' || isNaN(price)) {
    result.valid = false
    result.errors.push('价格必须是数字')
    return result
  }

  if (price < min) {
    result.valid = false
    result.errors.push(`价格不能小于 ${min} 元`)
  }

  if (price > max) {
    result.valid = false
    result.errors.push(`价格不能大于 ${max} 元`)
  }

  // 检查小数位数
  const decimalPlaces = (price.toString().split('.')[1] || '').length
  if (decimalPlaces > precision) {
    result.valid = false
    result.errors.push(`价格小数位数不能超过 ${precision} 位`)
  }

  return result
}

/**
 * 验证日期范围
 * @param {string|Date} startDate - 开始日期
 * @param {string|Date} endDate - 结束日期
 * @returns {Object} 验证结果
 */
export function validateDateRange(startDate, endDate) {
  const result = {
    valid: true,
    errors: []
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime())) {
    result.valid = false
    result.errors.push('开始日期格式错误')
  }

  if (isNaN(end.getTime())) {
    result.valid = false
    result.errors.push('结束日期格式错误')
  }

  if (result.valid && start >= end) {
    result.valid = false
    result.errors.push('开始日期必须早于结束日期')
  }

  return result
}

/**
 * 创建Element Plus验证规则
 * @param {string} type - 验证类型
 * @param {Object} options - 验证选项
 * @returns {Array} 验证规则数组
 */
export function createValidationRules(type, options = {}) {
  const rules = []

  switch (type) {
    case 'required':
      rules.push({
        required: true,
        message: options.message || '此字段为必填项',
        trigger: options.trigger || 'blur'
      })
      break

    case 'phone':
      rules.push({
        validator: (rule, value, callback) => {
          if (value && !validatePhone(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
      break

    case 'email':
      rules.push({
        validator: (rule, value, callback) => {
          if (value && !validateEmail(value)) {
            callback(new Error('请输入正确的邮箱地址'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
      break

    case 'longitude':
      rules.push({
        validator: (rule, value, callback) => {
          if (value !== null && value !== undefined && !validateLongitude(value)) {
            callback(new Error('经度范围为 -180 到 180'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
      break

    case 'latitude':
      rules.push({
        validator: (rule, value, callback) => {
          if (value !== null && value !== undefined && !validateLatitude(value)) {
            callback(new Error('纬度范围为 -90 到 90'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
      break

    case 'area':
      rules.push({
        validator: (rule, value, callback) => {
          if (value !== null && value !== undefined) {
            const validation = validateArea(value, options)
            if (!validation.valid) {
              callback(new Error(validation.errors[0]))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
      break

    case 'price':
      rules.push({
        validator: (rule, value, callback) => {
          if (value !== null && value !== undefined) {
            const validation = validatePrice(value, options)
            if (!validation.valid) {
              callback(new Error(validation.errors[0]))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
      break

    case 'coordinates':
      rules.push({
        validator: (rule, value, callback) => {
          if (value && value.trim()) {
            const validation = validateCoordinates(value)
            if (!validation.valid) {
              callback(new Error(validation.errors[0]))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'blur'
      })
      break
  }

  return rules
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
