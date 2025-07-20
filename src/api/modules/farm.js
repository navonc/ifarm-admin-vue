import request from '../request'

/**
 * 农场管理API
 */

/**
 * 获取农场列表
 * @param {Object} params - 查询参数
 * @param {number} params.current - 当前页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.farmName] - 农场名称
 * @param {number} [params.ownerId] - 农场主ID
 * @param {boolean} [params.enabled] - 是否启用
 * @param {string} [params.province] - 省份
 * @param {string} [params.city] - 城市
 * @returns {Promise} 农场列表响应
 */
export function getFarmList(params) {
  return request({
    url: '/admin/farms',
    method: 'GET',
    params
  })
}

/**
 * 获取农场详情
 * @param {number} id - 农场ID
 * @returns {Promise} 农场详情响应
 */
export function getFarmDetail(id) {
  return request({
    url: `/admin/farms/${id}`,
    method: 'GET'
  })
}

/**
 * 创建农场
 * @param {Object} data - 农场数据
 * @param {string} data.farmName - 农场名称
 * @param {string} data.description - 农场描述
 * @param {string} data.province - 省份
 * @param {string} data.city - 城市
 * @param {string} data.district - 区县
 * @param {string} data.address - 详细地址
 * @param {number} [data.latitude] - 纬度
 * @param {number} [data.longitude] - 经度
 * @param {number} data.totalArea - 总面积
 * @param {string} [data.coverImage] - 封面图片
 * @param {Array} [data.images] - 农场图片
 * @param {string} [data.licenseNumber] - 许可证号
 * @param {Object} [data.certification] - 认证信息
 * @param {string} [data.contactPhone] - 联系电话
 * @param {string} [data.businessHours] - 营业时间
 * @param {number} [data.ownerId] - 农场主ID
 * @returns {Promise} 创建响应
 */
export function createFarm(data) {
  return request({
    url: '/admin/farms',
    method: 'POST',
    data
  })
}

/**
 * 更新农场信息
 * @param {number} id - 农场ID
 * @param {Object} data - 更新数据
 * @returns {Promise} 更新响应
 */
export function updateFarm(id, data) {
  return request({
    url: `/admin/farms/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除农场
 * @param {number} id - 农场ID
 * @returns {Promise} 删除响应
 */
export function deleteFarm(id) {
  return request({
    url: `/admin/farms/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除农场
 * @param {Array<number>} ids - 农场ID数组
 * @returns {Promise} 删除响应
 */
export function batchDeleteFarms(ids) {
  return request({
    url: '/admin/farms/batch',
    method: 'DELETE',
    data: { ids }
  })
}

/**
 * 启用/禁用农场
 * @param {number} id - 农场ID
 * @param {boolean} enabled - 是否启用
 * @returns {Promise} 更新响应
 */
export function toggleFarmStatus(id, enabled) {
  return request({
    url: `/admin/farms/${id}/status`,
    method: 'PUT',
    data: { enabled }
  })
}

/**
 * 批量启用/禁用农场
 * @param {Array<number>} ids - 农场ID数组
 * @param {boolean} enabled - 是否启用
 * @returns {Promise} 更新响应
 */
export function batchToggleFarmStatus(ids, enabled) {
  return request({
    url: '/admin/farms/batch/status',
    method: 'PUT',
    data: { ids, enabled }
  })
}

/**
 * 获取农场统计信息
 * @param {number} id - 农场ID
 * @returns {Promise} 统计信息响应
 */
export function getFarmStats(id) {
  return request({
    url: `/admin/farms/${id}/stats`,
    method: 'GET'
  })
}

/**
 * 获取农场的地块列表
 * @param {number} id - 农场ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 地块列表响应
 */
export function getFarmPlots(id, params) {
  return request({
    url: `/admin/farms/${id}/plots`,
    method: 'GET',
    params
  })
}

/**
 * 获取农场的认养项目列表
 * @param {number} id - 农场ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 项目列表响应
 */
export function getFarmProjects(id, params) {
  return request({
    url: `/admin/farms/${id}/projects`,
    method: 'GET',
    params
  })
}

/**
 * 获取农场选择器数据（简化的农场列表）
 * @param {Object} params - 查询参数
 * @param {string} [params.keyword] - 搜索关键词
 * @param {boolean} [params.enabled] - 是否启用
 * @returns {Promise} 农场选择器数据
 */
export function getFarmSelector(params) {
  return request({
    url: '/admin/farms/selector',
    method: 'GET',
    params
  })
}

/**
 * 上传农场图片
 * @param {FormData} formData - 图片文件
 * @returns {Promise} 上传响应
 */
export function uploadFarmImage(formData) {
  return request({
    url: '/admin/farms/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取省市区数据
 * @param {number} [parentId] - 父级ID，不传则获取省份
 * @returns {Promise} 地区数据响应
 */
export function getRegionData(parentId) {
  return request({
    url: '/admin/regions',
    method: 'GET',
    params: { parentId }
  })
}

/**
 * 根据地址获取经纬度
 * @param {string} address - 地址
 * @returns {Promise} 经纬度响应
 */
export function getCoordinates(address) {
  return request({
    url: '/admin/geocoding',
    method: 'GET',
    params: { address }
  })
}
