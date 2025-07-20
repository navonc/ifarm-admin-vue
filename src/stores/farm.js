import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { farmApi } from '@/api'

export const useFarmStore = defineStore('farm', () => {
  // 状态
  const farmList = ref([])
  const currentFarm = ref(null)
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0
  })
  const searchParams = ref({
    farmName: '',
    ownerId: null,
    enabled: null,
    province: '',
    city: ''
  })

  // 缓存数据
  const farmSelector = ref([])
  const regionData = ref({
    provinces: [],
    cities: {},
    districts: {}
  })

  // 计算属性
  const hasData = computed(() => farmList.value.length > 0)
  const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.size))

  // 方法
  /**
   * 获取农场列表
   * @param {Object} params - 查询参数
   */
  async function fetchFarmList(params = {}) {
    try {
      loading.value = true
      
      const queryParams = {
        current: pagination.value.current,
        size: pagination.value.size,
        ...searchParams.value,
        ...params
      }

      const response = await farmApi.getFarmList(queryParams)
      
      if (response.data) {
        farmList.value = response.data.records || []
        pagination.value = {
          current: response.data.current || 1,
          size: response.data.size || 10,
          total: response.data.total || 0
        }
      }
    } catch (error) {
      console.error('获取农场列表失败:', error)
      ElMessage.error('获取农场列表失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取农场详情
   * @param {number} id - 农场ID
   */
  async function fetchFarmDetail(id) {
    try {
      loading.value = true
      const response = await farmApi.getFarmDetail(id)
      
      if (response.data) {
        currentFarm.value = response.data
        return response.data
      }
    } catch (error) {
      console.error('获取农场详情失败:', error)
      ElMessage.error('获取农场详情失败')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建农场
   * @param {Object} farmData - 农场数据
   */
  async function createFarm(farmData) {
    try {
      loading.value = true
      const response = await farmApi.createFarm(farmData)
      
      if (response.data) {
        ElMessage.success('农场创建成功')
        // 刷新列表
        await fetchFarmList()
        return response.data
      }
    } catch (error) {
      console.error('创建农场失败:', error)
      ElMessage.error(error.message || '创建农场失败')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新农场
   * @param {number} id - 农场ID
   * @param {Object} farmData - 农场数据
   */
  async function updateFarm(id, farmData) {
    try {
      loading.value = true
      const response = await farmApi.updateFarm(id, farmData)
      
      if (response.data) {
        ElMessage.success('农场更新成功')
        
        // 更新列表中的数据
        const index = farmList.value.findIndex(farm => farm.id === id)
        if (index !== -1) {
          farmList.value[index] = { ...farmList.value[index], ...response.data }
        }
        
        // 更新当前农场数据
        if (currentFarm.value && currentFarm.value.id === id) {
          currentFarm.value = { ...currentFarm.value, ...response.data }
        }
        
        return response.data
      }
    } catch (error) {
      console.error('更新农场失败:', error)
      ElMessage.error(error.message || '更新农场失败')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除农场
   * @param {number} id - 农场ID
   */
  async function deleteFarm(id) {
    try {
      loading.value = true
      await farmApi.deleteFarm(id)
      
      ElMessage.success('农场删除成功')
      
      // 从列表中移除
      farmList.value = farmList.value.filter(farm => farm.id !== id)
      
      // 更新总数
      pagination.value.total = Math.max(0, pagination.value.total - 1)
      
      return true
    } catch (error) {
      console.error('删除农场失败:', error)
      ElMessage.error(error.message || '删除农场失败')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量删除农场
   * @param {Array<number>} ids - 农场ID数组
   */
  async function batchDeleteFarms(ids) {
    try {
      loading.value = true
      await farmApi.batchDeleteFarms(ids)
      
      ElMessage.success(`成功删除 ${ids.length} 个农场`)
      
      // 从列表中移除
      farmList.value = farmList.value.filter(farm => !ids.includes(farm.id))
      
      // 更新总数
      pagination.value.total = Math.max(0, pagination.value.total - ids.length)
      
      return true
    } catch (error) {
      console.error('批量删除农场失败:', error)
      ElMessage.error(error.message || '批量删除农场失败')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换农场状态
   * @param {number} id - 农场ID
   * @param {boolean} enabled - 是否启用
   */
  async function toggleFarmStatus(id, enabled) {
    try {
      await farmApi.toggleFarmStatus(id, enabled)
      
      ElMessage.success(`农场${enabled ? '启用' : '禁用'}成功`)
      
      // 更新列表中的状态
      const farm = farmList.value.find(f => f.id === id)
      if (farm) {
        farm.enabled = enabled
      }
      
      // 更新当前农场状态
      if (currentFarm.value && currentFarm.value.id === id) {
        currentFarm.value.enabled = enabled
      }
      
      return true
    } catch (error) {
      console.error('切换农场状态失败:', error)
      ElMessage.error(error.message || '操作失败')
      return false
    }
  }

  /**
   * 批量切换农场状态
   * @param {Array<number>} ids - 农场ID数组
   * @param {boolean} enabled - 是否启用
   */
  async function batchToggleFarmStatus(ids, enabled) {
    try {
      loading.value = true
      await farmApi.batchToggleFarmStatus(ids, enabled)
      
      ElMessage.success(`成功${enabled ? '启用' : '禁用'} ${ids.length} 个农场`)
      
      // 更新列表中的状态
      farmList.value.forEach(farm => {
        if (ids.includes(farm.id)) {
          farm.enabled = enabled
        }
      })
      
      return true
    } catch (error) {
      console.error('批量切换农场状态失败:', error)
      ElMessage.error(error.message || '操作失败')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取农场选择器数据
   * @param {Object} params - 查询参数
   */
  async function fetchFarmSelector(params = {}) {
    try {
      const response = await farmApi.getFarmSelector(params)
      
      if (response.data) {
        farmSelector.value = response.data
        return response.data
      }
    } catch (error) {
      console.error('获取农场选择器数据失败:', error)
      return []
    }
  }

  /**
   * 获取省市区数据
   * @param {number} parentId - 父级ID
   */
  async function fetchRegionData(parentId) {
    try {
      const response = await farmApi.getRegionData(parentId)
      
      if (response.data) {
        if (!parentId) {
          // 省份数据
          regionData.value.provinces = response.data
        } else {
          // 市区数据，需要根据parentId判断是市还是区
          const parent = regionData.value.provinces.find(p => p.id === parentId)
          if (parent) {
            regionData.value.cities[parentId] = response.data
          } else {
            // 查找是哪个市的区县
            Object.keys(regionData.value.cities).forEach(provinceId => {
              const city = regionData.value.cities[provinceId].find(c => c.id === parentId)
              if (city) {
                regionData.value.districts[parentId] = response.data
              }
            })
          }
        }
        
        return response.data
      }
    } catch (error) {
      console.error('获取地区数据失败:', error)
      return []
    }
  }

  /**
   * 上传农场图片
   * @param {FormData} formData - 图片文件
   */
  async function uploadFarmImage(formData) {
    try {
      const response = await farmApi.uploadFarmImage(formData)
      
      if (response.data) {
        return response.data.url
      }
    } catch (error) {
      console.error('上传农场图片失败:', error)
      ElMessage.error('图片上传失败')
      return null
    }
  }

  /**
   * 设置搜索参数
   * @param {Object} params - 搜索参数
   */
  function setSearchParams(params) {
    searchParams.value = { ...searchParams.value, ...params }
  }

  /**
   * 重置搜索参数
   */
  function resetSearchParams() {
    searchParams.value = {
      farmName: '',
      ownerId: null,
      enabled: null,
      province: '',
      city: ''
    }
  }

  /**
   * 设置分页参数
   * @param {Object} paginationData - 分页数据
   */
  function setPagination(paginationData) {
    pagination.value = { ...pagination.value, ...paginationData }
  }

  /**
   * 清空当前农场数据
   */
  function clearCurrentFarm() {
    currentFarm.value = null
  }

  return {
    // 状态
    farmList,
    currentFarm,
    loading,
    pagination,
    searchParams,
    farmSelector,
    regionData,
    
    // 计算属性
    hasData,
    totalPages,
    
    // 方法
    fetchFarmList,
    fetchFarmDetail,
    createFarm,
    updateFarm,
    deleteFarm,
    batchDeleteFarms,
    toggleFarmStatus,
    batchToggleFarmStatus,
    fetchFarmSelector,
    fetchRegionData,
    uploadFarmImage,
    setSearchParams,
    resetSearchParams,
    setPagination,
    clearCurrentFarm
  }
})
