import request from '../request'

/**
 * 认养项目管理API
 */

/**
 * 获取认养项目列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.name] - 项目名称
 * @param {number} [params.farmId] - 农场ID
 * @param {number} [params.plotId] - 地块ID
 * @param {number} [params.cropId] - 作物ID
 * @param {number} [params.projectStatus] - 项目状态
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @returns {Promise} 项目列表响应
 */
export function getProjectList(params) {
  return request({
    url: '/api/adoption-projects/admin',
    method: 'GET',
    params
  })
}

/**
 * 获取我的项目列表（农场主）
 * @param {Object} params - 查询参数
 * @returns {Promise} 项目列表响应
 */
export function getMyProjectList(params) {
  return request({
    url: '/api/adoption-projects/my',
    method: 'GET',
    params
  })
}

/**
 * 获取项目详情
 * @param {number} id - 项目ID
 * @returns {Promise} 项目详情响应
 */
export function getProjectDetail(id) {
  return request({
    url: `/api/adoption-projects/${id}`,
    method: 'GET'
  })
}

/**
 * 创建认养项目
 * @param {Object} data - 项目数据
 * @param {string} data.name - 项目名称
 * @param {string} data.description - 项目描述
 * @param {number} data.plotId - 地块ID
 * @param {number} data.cropId - 作物ID
 * @param {number} data.totalUnits - 总认养单位数
 * @param {number} data.unitArea - 单位面积
 * @param {number} data.unitPrice - 单位价格
 * @param {number} data.expectedYield - 预期产量
 * @param {string} data.plantingDate - 种植日期
 * @param {string} data.expectedHarvestDate - 预期收获日期
 * @param {string} [data.coverImage] - 封面图片
 * @returns {Promise} 创建响应
 */
export function createProject(data) {
  return request({
    url: '/api/adoption-projects',
    method: 'POST',
    data
  })
}

/**
 * 更新项目信息
 * @param {number} id - 项目ID
 * @param {Object} data - 更新数据
 * @returns {Promise} 更新响应
 */
export function updateProject(id, data) {
  return request({
    url: `/api/adoption-projects/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除项目
 * @param {number} id - 项目ID
 * @returns {Promise} 删除响应
 */
export function deleteProject(id) {
  return request({
    url: `/api/adoption-projects/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除项目
 * @param {Array<number>} ids - 项目ID数组
 * @returns {Promise} 删除响应
 */
export function batchDeleteProjects(ids) {
  return request({
    url: '/api/adoption-projects/batch',
    method: 'DELETE',
    data: { ids }
  })
}

/**
 * 更新项目状态
 * @param {number} id - 项目ID
 * @param {number} projectStatus - 项目状态
 * @returns {Promise} 更新响应
 */
export function updateProjectStatus(id, projectStatus) {
  return request({
    url: `/api/adoption-projects/${id}/status`,
    method: 'PUT',
    data: { projectStatus }
  })
}

/**
 * 批量更新项目状态
 * @param {Array<number>} ids - 项目ID数组
 * @param {number} projectStatus - 项目状态
 * @returns {Promise} 更新响应
 */
export function batchUpdateProjectStatus(ids, projectStatus) {
  return request({
    url: '/api/adoption-projects/batch/status',
    method: 'PUT',
    data: { ids, projectStatus }
  })
}

/**
 * 发布项目（从草稿状态发布到认养中）
 * @param {number} id - 项目ID
 * @returns {Promise} 发布响应
 */
export function publishProject(id) {
  return request({
    url: `/api/adoption-projects/${id}/publish`,
    method: 'PUT'
  })
}

/**
 * 开始种植（从认养中状态转为种植中）
 * @param {number} id - 项目ID
 * @param {Object} data - 种植信息
 * @param {string} data.actualPlantingDate - 实际种植日期
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 开始种植响应
 */
export function startPlanting(id, data) {
  return request({
    url: `/api/adoption-projects/${id}/start-planting`,
    method: 'PUT',
    data
  })
}

/**
 * 开始收获（从种植中状态转为收获中）
 * @param {number} id - 项目ID
 * @param {Object} data - 收获信息
 * @param {string} data.actualHarvestDate - 实际收获日期
 * @param {number} data.actualYield - 实际产量
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 开始收获响应
 */
export function startHarvesting(id, data) {
  return request({
    url: `/api/adoption-projects/${id}/start-harvesting`,
    method: 'PUT',
    data
  })
}

/**
 * 完成项目（从收获中状态转为已完成）
 * @param {number} id - 项目ID
 * @param {Object} data - 完成信息
 * @param {string} data.completionDate - 完成日期
 * @param {string} [data.remark] - 备注
 * @returns {Promise} 完成项目响应
 */
export function completeProject(id, data) {
  return request({
    url: `/api/adoption-projects/${id}/complete`,
    method: 'PUT',
    data
  })
}

/**
 * 取消项目
 * @param {number} id - 项目ID
 * @param {Object} data - 取消信息
 * @param {string} data.reason - 取消原因
 * @returns {Promise} 取消响应
 */
export function cancelProject(id, data) {
  return request({
    url: `/api/adoption-projects/${id}/cancel`,
    method: 'PUT',
    data
  })
}

/**
 * 获取项目统计信息
 * @param {number} id - 项目ID
 * @returns {Promise} 统计信息响应
 */
export function getProjectStats(id) {
  return request({
    url: `/api/adoption-projects/${id}/stats`,
    method: 'GET'
  })
}

/**
 * 获取项目的订单列表
 * @param {number} id - 项目ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 订单列表响应
 */
export function getProjectOrders(id, params) {
  return request({
    url: `/api/adoption-projects/${id}/orders`,
    method: 'GET',
    params
  })
}

/**
 * 上传项目图片
 * @param {FormData} formData - 图片文件
 * @returns {Promise} 上传响应
 */
export function uploadProjectImage(formData) {
  return request({
    url: '/api/adoption-projects/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取项目状态选项
 * @returns {Promise} 状态选项响应
 */
export function getProjectStatusOptions() {
  return request({
    url: '/api/adoption-projects/status-options',
    method: 'GET'
  })
}
