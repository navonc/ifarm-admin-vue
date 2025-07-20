import request from '../request'

/**
 * 作物管理API
 */

/**
 * 获取作物列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.cropName] - 作物名称
 * @param {number} [params.categoryId] - 分类ID
 * @param {boolean} [params.enabled] - 是否启用
 * @returns {Promise} 作物列表响应
 */
export function getCropList(params) {
  return request({
    url: '/admin/crops',
    method: 'GET',
    params
  })
}

/**
 * 获取作物详情
 * @param {number} id - 作物ID
 * @returns {Promise} 作物详情响应
 */
export function getCropDetail(id) {
  return request({
    url: `/admin/crops/${id}`,
    method: 'GET'
  })
}

/**
 * 创建作物
 * @param {Object} data - 作物数据
 * @param {string} data.cropName - 作物名称
 * @param {string} [data.scientificName] - 学名
 * @param {number} data.categoryId - 分类ID
 * @param {string} [data.description] - 作物描述
 * @param {number} [data.growthCycle] - 生长周期（天）
 * @param {string} [data.plantingSeason] - 种植季节
 * @param {string} [data.harvestSeason] - 收获季节
 * @param {string} [data.soilRequirement] - 土壤要求
 * @param {string} [data.climateRequirement] - 气候要求
 * @param {Object} [data.nutritionInfo] - 营养信息
 * @param {Array} [data.images] - 作物图片
 * @param {boolean} [data.enabled] - 是否启用
 * @returns {Promise} 创建响应
 */
export function createCrop(data) {
  return request({
    url: '/admin/crops',
    method: 'POST',
    data
  })
}

/**
 * 更新作物信息
 * @param {number} id - 作物ID
 * @param {Object} data - 更新数据
 * @returns {Promise} 更新响应
 */
export function updateCrop(id, data) {
  return request({
    url: `/admin/crops/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除作物
 * @param {number} id - 作物ID
 * @returns {Promise} 删除响应
 */
export function deleteCrop(id) {
  return request({
    url: `/admin/crops/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除作物
 * @param {Array<number>} ids - 作物ID数组
 * @returns {Promise} 删除响应
 */
export function batchDeleteCrops(ids) {
  return request({
    url: '/admin/crops/batch',
    method: 'DELETE',
    data: { ids }
  })
}

/**
 * 启用/禁用作物
 * @param {number} id - 作物ID
 * @param {boolean} enabled - 是否启用
 * @returns {Promise} 更新响应
 */
export function toggleCropStatus(id, enabled) {
  return request({
    url: `/admin/crops/${id}/status`,
    method: 'PUT',
    data: { enabled }
  })
}

/**
 * 批量启用/禁用作物
 * @param {Array<number>} ids - 作物ID数组
 * @param {boolean} enabled - 是否启用
 * @returns {Promise} 更新响应
 */
export function batchToggleCropStatus(ids, enabled) {
  return request({
    url: '/admin/crops/batch/status',
    method: 'PUT',
    data: { ids, enabled }
  })
}

/**
 * 获取作物选择器数据（按分类分组）
 * @param {Object} params - 查询参数
 * @param {number} [params.categoryId] - 分类ID
 * @param {string} [params.keyword] - 搜索关键词
 * @param {boolean} [params.enabled] - 是否启用
 * @returns {Promise} 作物选择器数据
 */
export function getCropSelector(params) {
  return request({
    url: '/admin/crops/selector',
    method: 'GET',
    params
  })
}

/**
 * 上传作物图片
 * @param {FormData} formData - 图片文件
 * @returns {Promise} 上传响应
 */
export function uploadCropImage(formData) {
  return request({
    url: '/admin/crops/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取种植季节选项
 * @returns {Promise} 季节选项响应
 */
export function getSeasonOptions() {
  return request({
    url: '/admin/crops/seasons',
    method: 'GET'
  })
}

/**
 * 获取土壤要求选项
 * @returns {Promise} 土壤要求选项响应
 */
export function getSoilRequirementOptions() {
  return request({
    url: '/admin/crops/soil-requirements',
    method: 'GET'
  })
}

/**
 * 获取气候要求选项
 * @returns {Promise} 气候要求选项响应
 */
export function getClimateRequirementOptions() {
  return request({
    url: '/admin/crops/climate-requirements',
    method: 'GET'
  })
}

/**
 * 获取作物统计信息
 * @param {number} id - 作物ID
 * @returns {Promise} 统计信息响应
 */
export function getCropStats(id) {
  return request({
    url: `/admin/crops/${id}/stats`,
    method: 'GET'
  })
}

/**
 * 获取作物的项目列表
 * @param {number} id - 作物ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 项目列表响应
 */
export function getCropProjects(id, params) {
  return request({
    url: `/admin/crops/${id}/projects`,
    method: 'GET',
    params
  })
}
