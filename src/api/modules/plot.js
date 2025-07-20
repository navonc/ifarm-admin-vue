import request from '../request'

/**
 * 地块管理API
 */

/**
 * 获取地块列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.plotName] - 地块名称
 * @param {number} [params.farmId] - 农场ID
 * @param {number} [params.plotStatus] - 地块状态
 * @param {boolean} [params.enabled] - 是否启用
 * @returns {Promise} 地块列表响应
 */
export function getPlotList(params) {
  return request({
    url: '/admin/plots',
    method: 'GET',
    params
  })
}

/**
 * 获取地块详情
 * @param {number} id - 地块ID
 * @returns {Promise} 地块详情响应
 */
export function getPlotDetail(id) {
  return request({
    url: `/admin/plots/${id}`,
    method: 'GET'
  })
}

/**
 * 创建地块
 * @param {Object} data - 地块数据
 * @param {string} data.plotName - 地块名称
 * @param {string} data.description - 地块描述
 * @param {number} data.farmId - 农场ID
 * @param {number} data.area - 地块面积
 * @param {string} [data.soilType] - 土壤类型
 * @param {string} [data.irrigationType] - 灌溉方式
 * @param {Object} [data.locationInfo] - 位置信息
 * @param {Array} [data.images] - 地块图片
 * @param {number} [data.plotStatus] - 地块状态
 * @returns {Promise} 创建响应
 */
export function createPlot(data) {
  return request({
    url: '/admin/plots',
    method: 'POST',
    data
  })
}

/**
 * 更新地块信息
 * @param {number} id - 地块ID
 * @param {Object} data - 更新数据
 * @returns {Promise} 更新响应
 */
export function updatePlot(id, data) {
  return request({
    url: `/admin/plots/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除地块
 * @param {number} id - 地块ID
 * @returns {Promise} 删除响应
 */
export function deletePlot(id) {
  return request({
    url: `/admin/plots/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除地块
 * @param {Array<number>} ids - 地块ID数组
 * @returns {Promise} 删除响应
 */
export function batchDeletePlots(ids) {
  return request({
    url: '/admin/plots/batch',
    method: 'DELETE',
    data: { ids }
  })
}

/**
 * 启用/禁用地块
 * @param {number} id - 地块ID
 * @param {boolean} enabled - 是否启用
 * @returns {Promise} 更新响应
 */
export function togglePlotStatus(id, enabled) {
  return request({
    url: `/admin/plots/${id}/status`,
    method: 'PUT',
    data: { enabled }
  })
}

/**
 * 更新地块状态
 * @param {number} id - 地块ID
 * @param {number} plotStatus - 地块状态
 * @returns {Promise} 更新响应
 */
export function updatePlotStatus(id, plotStatus) {
  return request({
    url: `/admin/plots/${id}/plot-status`,
    method: 'PUT',
    data: { plotStatus }
  })
}

/**
 * 批量更新地块状态
 * @param {Array<number>} ids - 地块ID数组
 * @param {number} plotStatus - 地块状态
 * @returns {Promise} 更新响应
 */
export function batchUpdatePlotStatus(ids, plotStatus) {
  return request({
    url: '/admin/plots/batch/plot-status',
    method: 'PUT',
    data: { ids, plotStatus }
  })
}

/**
 * 获取地块统计信息
 * @param {number} id - 地块ID
 * @returns {Promise} 统计信息响应
 */
export function getPlotStats(id) {
  return request({
    url: `/admin/plots/${id}/stats`,
    method: 'GET'
  })
}

/**
 * 获取地块的认养项目列表
 * @param {number} id - 地块ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 项目列表响应
 */
export function getPlotProjects(id, params) {
  return request({
    url: `/admin/plots/${id}/projects`,
    method: 'GET',
    params
  })
}

/**
 * 获取地块选择器数据（按农场分组）
 * @param {Object} params - 查询参数
 * @param {number} [params.farmId] - 农场ID
 * @param {string} [params.keyword] - 搜索关键词
 * @param {boolean} [params.enabled] - 是否启用
 * @param {number} [params.plotStatus] - 地块状态
 * @returns {Promise} 地块选择器数据
 */
export function getPlotSelector(params) {
  return request({
    url: '/admin/plots/selector',
    method: 'GET',
    params
  })
}

/**
 * 上传地块图片
 * @param {FormData} formData - 图片文件
 * @returns {Promise} 上传响应
 */
export function uploadPlotImage(formData) {
  return request({
    url: '/admin/plots/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取地块状态选项
 * @returns {Promise} 状态选项响应
 */
export function getPlotStatusOptions() {
  return request({
    url: '/admin/plots/status-options',
    method: 'GET'
  })
}

/**
 * 获取土壤类型选项
 * @returns {Promise} 土壤类型选项响应
 */
export function getSoilTypeOptions() {
  return request({
    url: '/admin/plots/soil-types',
    method: 'GET'
  })
}

/**
 * 获取灌溉方式选项
 * @returns {Promise} 灌溉方式选项响应
 */
export function getIrrigationTypeOptions() {
  return request({
    url: '/admin/plots/irrigation-types',
    method: 'GET'
  })
}
