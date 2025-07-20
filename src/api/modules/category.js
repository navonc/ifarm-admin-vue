import request from '../request'

/**
 * 分类管理API
 */

/**
 * 获取分类列表（树形结构）
 * @param {Object} params - 查询参数
 * @param {string} [params.categoryName] - 分类名称
 * @param {number} [params.parentId] - 父分类ID
 * @param {boolean} [params.enabled] - 是否启用
 * @returns {Promise} 分类树响应
 */
export function getCategoryTree(params) {
  return request({
    url: '/api/categories/tree',
    method: 'GET',
    params
  })
}

/**
 * 获取分类列表（平铺结构）
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.categoryName] - 分类名称
 * @param {number} [params.parentId] - 父分类ID
 * @param {boolean} [params.enabled] - 是否启用
 * @returns {Promise} 分类列表响应
 */
export function getCategoryList(params) {
  return request({
    url: '/api/categories',
    method: 'GET',
    params
  })
}

/**
 * 获取分类详情
 * @param {number} id - 分类ID
 * @returns {Promise} 分类详情响应
 */
export function getCategoryDetail(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'GET'
  })
}

/**
 * 创建分类
 * @param {Object} data - 分类数据
 * @param {string} data.categoryName - 分类名称
 * @param {string} data.code - 分类编码
 * @param {string} [data.icon] - 分类图标
 * @param {number} [data.parentId] - 父分类ID，0表示顶级分类
 * @param {number} [data.sortOrder] - 排序号
 * @param {boolean} [data.enabled] - 是否启用
 * @returns {Promise} 创建响应
 */
export function createCategory(data) {
  return request({
    url: '/api/categories',
    method: 'POST',
    data
  })
}

/**
 * 更新分类信息
 * @param {number} id - 分类ID
 * @param {Object} data - 更新数据
 * @returns {Promise} 更新响应
 */
export function updateCategory(id, data) {
  return request({
    url: `/api/categories/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除分类
 * @param {number} id - 分类ID
 * @returns {Promise} 删除响应
 */
export function deleteCategory(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除分类
 * @param {Array<number>} ids - 分类ID数组
 * @returns {Promise} 删除响应
 */
export function batchDeleteCategories(ids) {
  return request({
    url: '/api/categories/batch',
    method: 'DELETE',
    data: { ids }
  })
}

/**
 * 启用/禁用分类
 * @param {number} id - 分类ID
 * @param {boolean} enabled - 是否启用
 * @returns {Promise} 更新响应
 */
export function toggleCategoryStatus(id, enabled) {
  return request({
    url: `/api/categories/${id}/status`,
    method: 'PUT',
    data: { enabled }
  })
}

/**
 * 移动分类（调整父子关系）
 * @param {number} id - 分类ID
 * @param {number} targetParentId - 目标父分类ID
 * @param {number} [sortOrder] - 排序号
 * @returns {Promise} 移动响应
 */
export function moveCategory(id, targetParentId, sortOrder) {
  return request({
    url: `/api/categories/${id}/move`,
    method: 'PUT',
    data: { targetParentId, sortOrder }
  })
}

/**
 * 调整分类排序
 * @param {Array} sortData - 排序数据
 * @param {number} sortData[].id - 分类ID
 * @param {number} sortData[].sortOrder - 排序号
 * @returns {Promise} 排序响应
 */
export function sortCategories(sortData) {
  return request({
    url: '/api/categories/sort',
    method: 'PUT',
    data: { sortData }
  })
}

/**
 * 获取分类选择器数据（树形结构，用于下拉选择）
 * @param {Object} params - 查询参数
 * @param {boolean} [params.enabled] - 是否启用
 * @param {boolean} [params.includeRoot] - 是否包含根节点
 * @returns {Promise} 分类选择器数据
 */
export function getCategorySelector(params) {
  return request({
    url: '/api/categories/selector',
    method: 'GET',
    params
  })
}

/**
 * 获取分类路径（面包屑）
 * @param {number} id - 分类ID
 * @returns {Promise} 分类路径响应
 */
export function getCategoryPath(id) {
  return request({
    url: `/api/categories/${id}/path`,
    method: 'GET'
  })
}

/**
 * 获取分类统计信息
 * @param {number} id - 分类ID
 * @returns {Promise} 统计信息响应
 */
export function getCategoryStats(id) {
  return request({
    url: `/api/categories/${id}/stats`,
    method: 'GET'
  })
}

/**
 * 获取分类下的作物列表
 * @param {number} id - 分类ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 作物列表响应
 */
export function getCategoryCrops(id, params) {
  return request({
    url: `/api/categories/${id}/crops`,
    method: 'GET',
    params
  })
}
