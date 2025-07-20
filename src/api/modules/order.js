import request from '../request'

/**
 * 订单管理API
 */

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.orderNo] - 订单号
 * @param {number} [params.userId] - 用户ID
 * @param {number} [params.projectId] - 项目ID
 * @param {number} [params.farmId] - 农场ID
 * @param {number} [params.orderStatus] - 订单状态
 * @param {string} [params.paymentMethod] - 支付方式
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @param {number} [params.minAmount] - 最小金额
 * @param {number} [params.maxAmount] - 最大金额
 * @returns {Promise} 订单列表响应
 */
export function getOrderList(params) {
  return request({
    url: '/api/adoption-orders/admin',
    method: 'GET',
    params
  })
}

/**
 * 获取我的订单列表（农场主）
 * @param {Object} params - 查询参数
 * @returns {Promise} 订单列表响应
 */
export function getMyOrderList(params) {
  return request({
    url: '/api/adoption-orders/my',
    method: 'GET',
    params
  })
}

/**
 * 获取农场订单列表
 * @param {number} farmId - 农场ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 农场订单列表响应
 */
export function getFarmOrderList(farmId, params) {
  return request({
    url: `/api/adoption-orders/farm/${farmId}`,
    method: 'GET',
    params
  })
}

/**
 * 获取订单详情
 * @param {number} id - 订单ID
 * @returns {Promise} 订单详情响应
 */
export function getOrderDetail(id) {
  return request({
    url: `/api/adoption-orders/${id}`,
    method: 'GET'
  })
}

/**
 * 更新订单信息
 * @param {number} id - 订单ID
 * @param {Object} data - 更新数据
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 更新响应
 */
export function updateOrder(id, data) {
  return request({
    url: `/api/adoption-orders/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 取消订单
 * @param {number} id - 订单ID
 * @param {Object} data - 取消信息
 * @param {string} data.reason - 取消原因
 * @returns {Promise} 取消响应
 */
export function cancelOrder(id, data) {
  return request({
    url: `/api/adoption-orders/${id}/cancel`,
    method: 'PUT',
    data
  })
}

/**
 * 批量取消订单
 * @param {Array<number>} ids - 订单ID数组
 * @param {Object} data - 取消信息
 * @param {string} data.reason - 取消原因
 * @returns {Promise} 取消响应
 */
export function batchCancelOrders(ids, data) {
  return request({
    url: '/api/adoption-orders/batch/cancel',
    method: 'PUT',
    data: { ids, ...data }
  })
}

/**
 * 确认支付（手动确认支付状态）
 * @param {number} id - 订单ID
 * @param {Object} data - 支付信息
 * @param {string} data.paymentNo - 支付流水号
 * @param {string} data.paymentTime - 支付时间
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 确认支付响应
 */
export function confirmPayment(id, data) {
  return request({
    url: `/api/adoption-orders/${id}/confirm-payment`,
    method: 'PUT',
    data
  })
}

/**
 * 申请退款
 * @param {number} id - 订单ID
 * @param {Object} data - 退款信息
 * @param {number} data.refundAmount - 退款金额
 * @param {string} data.reason - 退款原因
 * @returns {Promise} 申请退款响应
 */
export function applyRefund(id, data) {
  return request({
    url: `/api/adoption-orders/${id}/refund`,
    method: 'PUT',
    data
  })
}

/**
 * 确认退款
 * @param {number} id - 订单ID
 * @param {Object} data - 退款确认信息
 * @param {string} data.refundNo - 退款流水号
 * @param {string} data.refundTime - 退款时间
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 确认退款响应
 */
export function confirmRefund(id, data) {
  return request({
    url: `/api/adoption-orders/${id}/confirm-refund`,
    method: 'PUT',
    data
  })
}

/**
 * 获取订单统计信息
 * @param {Object} params - 查询参数
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @param {number} [params.farmId] - 农场ID
 * @returns {Promise} 统计信息响应
 */
export function getOrderStats(params) {
  return request({
    url: '/api/adoption-orders/stats',
    method: 'GET',
    params
  })
}

/**
 * 导出订单数据
 * @param {Object} params - 查询参数
 * @returns {Promise} 导出响应
 */
export function exportOrders(params) {
  return request({
    url: '/api/adoption-orders/export',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

/**
 * 获取订单状态选项
 * @returns {Promise} 状态选项响应
 */
export function getOrderStatusOptions() {
  return request({
    url: '/api/adoption-orders/status-options',
    method: 'GET'
  })
}

/**
 * 获取支付方式选项
 * @returns {Promise} 支付方式选项响应
 */
export function getPaymentMethodOptions() {
  return request({
    url: '/api/adoption-orders/payment-methods',
    method: 'GET'
  })
}

/**
 * 获取订单趋势数据
 * @param {Object} params - 查询参数
 * @param {string} params.period - 时间周期：day/week/month/year
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @param {number} [params.farmId] - 农场ID
 * @returns {Promise} 趋势数据响应
 */
export function getOrderTrends(params) {
  return request({
    url: '/api/adoption-orders/trends',
    method: 'GET',
    params
  })
}

/**
 * 获取订单金额分布
 * @param {Object} params - 查询参数
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @param {number} [params.farmId] - 农场ID
 * @returns {Promise} 金额分布响应
 */
export function getOrderAmountDistribution(params) {
  return request({
    url: '/api/adoption-orders/amount-distribution',
    method: 'GET',
    params
  })
}
