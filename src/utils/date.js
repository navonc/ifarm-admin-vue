/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'
  
  const d = new Date(date)
  
  if (isNaN(d.getTime())) return '-'
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化日期（仅日期部分）
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
export function formatDateOnly(date) {
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间（仅时间部分）
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的时间字符串
 */
export function formatTimeOnly(date) {
  return formatDate(date, 'HH:mm:ss')
}

/**
 * 格式化相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 相对时间字符串
 */
export function formatRelativeTime(date) {
  if (!date) return '-'
  
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

/**
 * 获取日期范围
 * @param {string} type - 类型：today/week/month/year
 * @returns {Object} 日期范围对象
 */
export function getDateRange(type) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (type) {
    case 'today':
      return {
        start: formatDateOnly(today),
        end: formatDateOnly(today)
      }
    
    case 'week': {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      return {
        start: formatDateOnly(weekStart),
        end: formatDateOnly(weekEnd)
      }
    }
    
    case 'month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      return {
        start: formatDateOnly(monthStart),
        end: formatDateOnly(monthEnd)
      }
    }
    
    case 'year': {
      const yearStart = new Date(today.getFullYear(), 0, 1)
      const yearEnd = new Date(today.getFullYear(), 11, 31)
      
      return {
        start: formatDateOnly(yearStart),
        end: formatDateOnly(yearEnd)
      }
    }
    
    default:
      return {
        start: formatDateOnly(today),
        end: formatDateOnly(today)
      }
  }
}

/**
 * 判断是否为今天
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否为今天
 */
export function isToday(date) {
  if (!date) return false
  
  const d = new Date(date)
  const today = new Date()
  
  return d.getFullYear() === today.getFullYear() &&
         d.getMonth() === today.getMonth() &&
         d.getDate() === today.getDate()
}

/**
 * 判断是否为本周
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否为本周
 */
export function isThisWeek(date) {
  if (!date) return false
  
  const d = new Date(date)
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  return d >= weekStart && d <= weekEnd
}

/**
 * 判断是否为本月
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否为本月
 */
export function isThisMonth(date) {
  if (!date) return false
  
  const d = new Date(date)
  const today = new Date()
  
  return d.getFullYear() === today.getFullYear() &&
         d.getMonth() === today.getMonth()
}

/**
 * 计算两个日期之间的天数差
 * @param {string|Date} startDate - 开始日期
 * @param {string|Date} endDate - 结束日期
 * @returns {number} 天数差
 */
export function getDaysDiff(startDate, endDate) {
  if (!startDate || !endDate) return 0
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 添加天数到日期
 * @param {string|Date} date - 日期
 * @param {number} days - 要添加的天数
 * @returns {string} 新的日期字符串
 */
export function addDays(date, days) {
  if (!date) return ''
  
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  
  return formatDateOnly(d)
}

/**
 * 获取月份的天数
 * @param {number} year - 年份
 * @param {number} month - 月份（1-12）
 * @returns {number} 天数
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}
