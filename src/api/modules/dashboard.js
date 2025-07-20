import request from '../request'

/**
 * 首页统计数据API
 */

/**
 * 获取首页统计数据
 * @param {Object} params - 查询参数
 * @param {string} [params.period] - 统计周期：today/week/month/year
 * @returns {Promise} 统计数据响应
 */
export function getDashboardStats(params) {
  return request({
    url: '/admin/dashboard/stats',
    method: 'GET',
    params
  })
}

/**
 * 获取数据概览
 * @returns {Promise} 数据概览响应
 */
export function getDataOverview() {
  return request({
    url: '/admin/dashboard/overview',
    method: 'GET'
  })
}

/**
 * 获取最近订单列表
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 限制数量，默认10
 * @returns {Promise} 最近订单响应
 */
export function getRecentOrders(params) {
  return request({
    url: '/admin/dashboard/recent-orders',
    method: 'GET',
    params
  })
}

/**
 * 获取最近项目列表
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 限制数量，默认10
 * @returns {Promise} 最近项目响应
 */
export function getRecentProjects(params) {
  return request({
    url: '/admin/dashboard/recent-projects',
    method: 'GET',
    params
  })
}

/**
 * 获取收入趋势数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期：day/week/month/year
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @returns {Promise} 收入趋势响应
 */
export function getRevenueTrends(params) {
  return request({
    url: '/admin/dashboard/revenue-trends',
    method: 'GET',
    params
  })
}

/**
 * 获取订单趋势数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期：day/week/month/year
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @returns {Promise} 订单趋势响应
 */
export function getOrderTrends(params) {
  return request({
    url: '/admin/dashboard/order-trends',
    method: 'GET',
    params
  })
}

/**
 * 获取用户增长趋势
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期：day/week/month/year
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @returns {Promise} 用户增长趋势响应
 */
export function getUserGrowthTrends(params) {
  return request({
    url: '/admin/dashboard/user-growth-trends',
    method: 'GET',
    params
  })
}

/**
 * 获取项目状态分布
 * @param {Object} params - 查询参数
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @returns {Promise} 项目状态分布响应
 */
export function getProjectStatusDistribution(params) {
  return request({
    url: '/admin/dashboard/project-status-distribution',
    method: 'GET',
    params
  })
}

/**
 * 获取农场排行榜
 * @param {Object} params - 查询参数
 * @param {string} params.type - 排行类型：revenue/orders/adoption
 * @param {number} [params.limit] - 限制数量，默认10
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @returns {Promise} 农场排行榜响应
 */
export function getFarmRanking(params) {
  return request({
    url: '/admin/dashboard/farm-ranking',
    method: 'GET',
    params
  })
}

/**
 * 获取作物热度排行
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 限制数量，默认10
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @returns {Promise} 作物热度排行响应
 */
export function getCropPopularityRanking(params) {
  return request({
    url: '/admin/dashboard/crop-popularity-ranking',
    method: 'GET',
    params
  })
}

/**
 * 获取地区分布数据
 * @param {Object} params - 查询参数
 * @param {string} params.type - 分布类型：farms/users/orders
 * @returns {Promise} 地区分布响应
 */
export function getRegionDistribution(params) {
  return request({
    url: '/admin/dashboard/region-distribution',
    method: 'GET',
    params
  })
}

/**
 * 获取实时数据
 * @returns {Promise} 实时数据响应
 */
export function getRealTimeData() {
  return request({
    url: '/admin/dashboard/realtime',
    method: 'GET'
  })
}

/**
 * 获取预警信息
 * @param {Object} params - 查询参数
 * @param {string} [params.type] - 预警类型：stock/payment/harvest
 * @param {number} [params.limit] - 限制数量，默认10
 * @returns {Promise} 预警信息响应
 */
export function getAlerts(params) {
  return request({
    url: '/admin/dashboard/alerts',
    method: 'GET',
    params
  })
}

/**
 * 获取待办事项
 * @param {Object} params - 查询参数
 * @param {number} [params.limit] - 限制数量，默认10
 * @returns {Promise} 待办事项响应
 */
export function getTodoList(params) {
  return request({
    url: '/admin/dashboard/todos',
    method: 'GET',
    params
  })
}

/**
 * 标记待办事项为已完成
 * @param {number} id - 待办事项ID
 * @returns {Promise} 标记完成响应
 */
export function markTodoCompleted(id) {
  return request({
    url: `/admin/dashboard/todos/${id}/complete`,
    method: 'PUT'
  })
}
