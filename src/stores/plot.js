import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { plotApi } from '@/api'

export const usePlotStore = defineStore('plot', () => {
  // 状态
  const plotList = ref([])
  const currentPlot = ref(null)
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0
  })
  const searchParams = ref({
    plotName: '',
    farmId: null,
    plotStatus: null,
    enabled: null
  })

  // 缓存数据
  const plotSelector = ref([])
  const plotStatusOptions = ref([])
  const soilTypeOptions = ref([])
  const irrigationTypeOptions = ref([])

  // 计算属性
  const hasData = computed(() => plotList.value.length > 0)
  const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.size))

  // 方法
  /**
   * 获取地块列表
   * @param {Object} params - 查询参数
   */
  async function fetchPlotList(params = {}) {
    try {
      loading.value = true
      
      const queryParams = {
        current: pagination.value.current,
        size: pagination.value.size,
        ...searchParams.value,
        ...params
      }

      const response = await plotApi.getPlotList(queryParams)
      
      if (response.data) {
        plotList.value = response.data.records || []
        pagination.value = {
          current: response.data.current || 1,
          size: response.data.size || 10,
          total: response.data.total || 0
        }
      }
    } catch (error) {
      console.error('获取地块列表失败:', error)
      ElMessage.error('获取地块列表失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取地块详情
   * @param {number} id - 地块ID
   */
  async function fetchPlotDetail(id) {
    try {
      loading.value = true
      const response = await plotApi.getPlotDetail(id)
      
      if (response.data) {
        currentPlot.value = response.data
        return response.data
      }
    } catch (error) {
      console.error('获取地块详情失败:', error)
      ElMessage.error('获取地块详情失败')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建地块
   * @param {Object} plotData - 地块数据
   */
  async function createPlot(plotData) {
    try {
      loading.value = true
      const response = await plotApi.createPlot(plotData)
      
      if (response.data) {
        ElMessage.success('地块创建成功')
        // 刷新列表
        await fetchPlotList()
        return response.data
      }
    } catch (error) {
      console.error('创建地块失败:', error)
      ElMessage.error(error.message || '创建地块失败')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新地块
   * @param {number} id - 地块ID
   * @param {Object} plotData - 地块数据
   */
  async function updatePlot(id, plotData) {
    try {
      loading.value = true
      const response = await plotApi.updatePlot(id, plotData)
      
      if (response.data) {
        ElMessage.success('地块更新成功')
        
        // 更新列表中的数据
        const index = plotList.value.findIndex(plot => plot.id === id)
        if (index !== -1) {
          plotList.value[index] = { ...plotList.value[index], ...response.data }
        }
        
        // 更新当前地块数据
        if (currentPlot.value && currentPlot.value.id === id) {
          currentPlot.value = { ...currentPlot.value, ...response.data }
        }
        
        return response.data
      }
    } catch (error) {
      console.error('更新地块失败:', error)
      ElMessage.error(error.message || '更新地块失败')
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除地块
   * @param {number} id - 地块ID
   */
  async function deletePlot(id) {
    try {
      loading.value = true
      await plotApi.deletePlot(id)
      
      ElMessage.success('地块删除成功')
      
      // 从列表中移除
      plotList.value = plotList.value.filter(plot => plot.id !== id)
      
      // 更新总数
      pagination.value.total = Math.max(0, pagination.value.total - 1)
      
      return true
    } catch (error) {
      console.error('删除地块失败:', error)
      ElMessage.error(error.message || '删除地块失败')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量删除地块
   * @param {Array<number>} ids - 地块ID数组
   */
  async function batchDeletePlots(ids) {
    try {
      loading.value = true
      await plotApi.batchDeletePlots(ids)
      
      ElMessage.success(`成功删除 ${ids.length} 个地块`)
      
      // 从列表中移除
      plotList.value = plotList.value.filter(plot => !ids.includes(plot.id))
      
      // 更新总数
      pagination.value.total = Math.max(0, pagination.value.total - ids.length)
      
      return true
    } catch (error) {
      console.error('批量删除地块失败:', error)
      ElMessage.error(error.message || '批量删除地块失败')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换地块启用状态
   * @param {number} id - 地块ID
   * @param {boolean} enabled - 是否启用
   */
  async function togglePlotStatus(id, enabled) {
    try {
      await plotApi.togglePlotStatus(id, enabled)
      
      ElMessage.success(`地块${enabled ? '启用' : '禁用'}成功`)
      
      // 更新列表中的状态
      const plot = plotList.value.find(p => p.id === id)
      if (plot) {
        plot.enabled = enabled
      }
      
      // 更新当前地块状态
      if (currentPlot.value && currentPlot.value.id === id) {
        currentPlot.value.enabled = enabled
      }
      
      return true
    } catch (error) {
      console.error('切换地块状态失败:', error)
      ElMessage.error(error.message || '操作失败')
      return false
    }
  }

  /**
   * 更新地块状态
   * @param {number} id - 地块ID
   * @param {number} plotStatus - 地块状态
   */
  async function updatePlotStatus(id, plotStatus) {
    try {
      await plotApi.updatePlotStatus(id, plotStatus)
      
      const statusName = getPlotStatusName(plotStatus)
      ElMessage.success(`地块状态已更新为${statusName}`)
      
      // 更新列表中的状态
      const plot = plotList.value.find(p => p.id === id)
      if (plot) {
        plot.plotStatus = plotStatus
        plot.plotStatusName = statusName
      }
      
      // 更新当前地块状态
      if (currentPlot.value && currentPlot.value.id === id) {
        currentPlot.value.plotStatus = plotStatus
        currentPlot.value.plotStatusName = statusName
      }
      
      return true
    } catch (error) {
      console.error('更新地块状态失败:', error)
      ElMessage.error(error.message || '操作失败')
      return false
    }
  }

  /**
   * 批量更新地块状态
   * @param {Array<number>} ids - 地块ID数组
   * @param {number} plotStatus - 地块状态
   */
  async function batchUpdatePlotStatus(ids, plotStatus) {
    try {
      loading.value = true
      await plotApi.batchUpdatePlotStatus(ids, plotStatus)
      
      const statusName = getPlotStatusName(plotStatus)
      ElMessage.success(`成功将 ${ids.length} 个地块状态更新为${statusName}`)
      
      // 更新列表中的状态
      plotList.value.forEach(plot => {
        if (ids.includes(plot.id)) {
          plot.plotStatus = plotStatus
          plot.plotStatusName = statusName
        }
      })
      
      return true
    } catch (error) {
      console.error('批量更新地块状态失败:', error)
      ElMessage.error(error.message || '操作失败')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取地块选择器数据
   * @param {Object} params - 查询参数
   */
  async function fetchPlotSelector(params = {}) {
    try {
      const response = await plotApi.getPlotSelector(params)
      
      if (response.data) {
        plotSelector.value = response.data
        return response.data
      }
    } catch (error) {
      console.error('获取地块选择器数据失败:', error)
      return []
    }
  }

  /**
   * 获取地块状态选项
   */
  async function fetchPlotStatusOptions() {
    try {
      const response = await plotApi.getPlotStatusOptions()
      
      if (response.data) {
        plotStatusOptions.value = response.data
        return response.data
      }
    } catch (error) {
      console.error('获取地块状态选项失败:', error)
      return []
    }
  }

  /**
   * 上传地块图片
   * @param {FormData} formData - 图片文件
   */
  async function uploadPlotImage(formData) {
    try {
      const response = await plotApi.uploadPlotImage(formData)
      
      if (response.data) {
        return response.data.url
      }
    } catch (error) {
      console.error('上传地块图片失败:', error)
      ElMessage.error('图片上传失败')
      return null
    }
  }

  /**
   * 获取地块状态名称
   * @param {number} status - 状态值
   * @returns {string} 状态名称
   */
  function getPlotStatusName(status) {
    const statusMap = {
      1: '空闲',
      2: '种植中',
      3: '收获中',
      4: '休耕'
    }
    return statusMap[status] || '未知'
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
      plotName: '',
      farmId: null,
      plotStatus: null,
      enabled: null
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
   * 清空当前地块数据
   */
  function clearCurrentPlot() {
    currentPlot.value = null
  }

  return {
    // 状态
    plotList,
    currentPlot,
    loading,
    pagination,
    searchParams,
    plotSelector,
    plotStatusOptions,
    soilTypeOptions,
    irrigationTypeOptions,
    
    // 计算属性
    hasData,
    totalPages,
    
    // 方法
    fetchPlotList,
    fetchPlotDetail,
    createPlot,
    updatePlot,
    deletePlot,
    batchDeletePlots,
    togglePlotStatus,
    updatePlotStatus,
    batchUpdatePlotStatus,
    fetchPlotSelector,
    fetchPlotStatusOptions,
    uploadPlotImage,
    getPlotStatusName,
    setSearchParams,
    resetSearchParams,
    setPagination,
    clearCurrentPlot
  }
})
