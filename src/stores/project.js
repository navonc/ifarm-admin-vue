import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { projectApi } from '@/api'
import { showError } from '@/utils/error-handler'

export const useProjectStore = defineStore('project', () => {
  // 状态
  const projectList = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0
  })
  const searchParams = ref({
    projectName: '',
    farmId: null,
    plotId: null,
    cropId: null,
    projectStatus: null,
    enabled: null
  })

  // 缓存数据
  const projectSelector = ref([])
  const projectStatusOptions = ref([])
  const cropOptions = ref([])

  // 计算属性
  const hasData = computed(() => projectList.value.length > 0)
  const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.size))

  // 项目状态映射
  const PROJECT_STATUS = {
    DRAFT: 1,        // 草稿
    PUBLISHED: 2,    // 已发布
    ADOPTING: 3,     // 认养中
    PLANTING: 4,     // 种植中
    HARVESTING: 5,   // 收获中
    COMPLETED: 6,    // 已完成
    CANCELLED: 7     // 已取消
  }

  // 方法
  /**
   * 获取项目列表
   * @param {Object} params - 查询参数
   */
  async function fetchProjectList(params = {}) {
    try {
      loading.value = true
      
      const queryParams = {
        current: pagination.value.current,
        size: pagination.value.size,
        ...searchParams.value,
        ...params
      }

      const response = await projectApi.getProjectList(queryParams)
      
      if (response.data) {
        projectList.value = response.data.records || []
        pagination.value = {
          current: response.data.current || 1,
          size: response.data.size || 10,
          total: response.data.total || 0
        }
      }
    } catch (error) {
      console.error('获取项目列表失败:', error)
      showError(error, { showType: 'message' })
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取我的项目列表
   * @param {Object} params - 查询参数
   */
  async function fetchMyProjectList(params = {}) {
    try {
      loading.value = true
      
      const queryParams = {
        current: pagination.value.current,
        size: pagination.value.size,
        ...searchParams.value,
        ...params
      }

      const response = await projectApi.getMyProjectList(queryParams)
      
      if (response.data) {
        projectList.value = response.data.records || []
        pagination.value = {
          current: response.data.current || 1,
          size: response.data.size || 10,
          total: response.data.total || 0
        }
      }
    } catch (error) {
      console.error('获取我的项目列表失败:', error)
      showError(error, { showType: 'message' })
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取项目详情
   * @param {number} id - 项目ID
   */
  async function fetchProjectDetail(id) {
    try {
      loading.value = true
      const response = await projectApi.getProjectDetail(id)
      
      if (response.data) {
        currentProject.value = response.data
        return response.data
      }
    } catch (error) {
      console.error('获取项目详情失败:', error)
      showError(error, { showType: 'message' })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建项目
   * @param {Object} projectData - 项目数据
   */
  async function createProject(projectData) {
    try {
      loading.value = true
      
      // 业务验证
      const canCreate = await checkProjectCanCreate(projectData)
      if (!canCreate.allowed) {
        throw new Error(canCreate.reason)
      }
      
      const response = await projectApi.createProject(projectData)
      
      if (response.data) {
        ElMessage.success('项目创建成功')
        // 刷新列表
        await fetchProjectList()
        return response.data
      }
    } catch (error) {
      console.error('创建项目失败:', error)
      showError(error, { showType: 'message' })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新项目
   * @param {number} id - 项目ID
   * @param {Object} projectData - 项目数据
   */
  async function updateProject(id, projectData) {
    try {
      loading.value = true
      
      // 业务验证
      const canUpdate = await checkProjectCanUpdate(id, projectData)
      if (!canUpdate.allowed) {
        throw new Error(canUpdate.reason)
      }
      
      const response = await projectApi.updateProject(id, projectData)
      
      if (response.data) {
        ElMessage.success('项目更新成功')
        
        // 更新列表中的数据
        const index = projectList.value.findIndex(project => project.id === id)
        if (index !== -1) {
          projectList.value[index] = { ...projectList.value[index], ...response.data }
        }
        
        // 更新当前项目数据
        if (currentProject.value && currentProject.value.id === id) {
          currentProject.value = { ...currentProject.value, ...response.data }
        }
        
        return response.data
      }
    } catch (error) {
      console.error('更新项目失败:', error)
      showError(error, { showType: 'message' })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除项目
   * @param {number} id - 项目ID
   */
  async function deleteProject(id) {
    try {
      loading.value = true
      
      // 业务验证
      const canDelete = await checkProjectCanDelete(id)
      if (!canDelete.allowed) {
        throw new Error(canDelete.reason)
      }
      
      await projectApi.deleteProject(id)
      
      ElMessage.success('项目删除成功')
      
      // 从列表中移除
      projectList.value = projectList.value.filter(project => project.id !== id)
      
      // 更新总数
      pagination.value.total = Math.max(0, pagination.value.total - 1)
      
      return true
    } catch (error) {
      console.error('删除项目失败:', error)
      showError(error, { showType: 'message' })
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量删除项目
   * @param {Array<number>} ids - 项目ID数组
   */
  async function batchDeleteProjects(ids) {
    try {
      loading.value = true
      
      // 批量业务验证
      for (const id of ids) {
        const canDelete = await checkProjectCanDelete(id)
        if (!canDelete.allowed) {
          throw new Error(`项目ID ${id}: ${canDelete.reason}`)
        }
      }
      
      await projectApi.batchDeleteProjects(ids)
      
      ElMessage.success(`成功删除 ${ids.length} 个项目`)
      
      // 从列表中移除
      projectList.value = projectList.value.filter(project => !ids.includes(project.id))
      
      // 更新总数
      pagination.value.total = Math.max(0, pagination.value.total - ids.length)
      
      return true
    } catch (error) {
      console.error('批量删除项目失败:', error)
      showError(error, { showType: 'message' })
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新项目状态
   * @param {number} id - 项目ID
   * @param {number} projectStatus - 项目状态
   */
  async function updateProjectStatus(id, projectStatus) {
    try {
      // 业务验证
      const canUpdate = await checkProjectStatusCanUpdate(id, projectStatus)
      if (!canUpdate.allowed) {
        throw new Error(canUpdate.reason)
      }
      
      await projectApi.updateProjectStatus(id, projectStatus)
      
      const statusName = getProjectStatusName(projectStatus)
      ElMessage.success(`项目状态已更新为${statusName}`)
      
      // 更新列表中的状态
      const project = projectList.value.find(p => p.id === id)
      if (project) {
        project.projectStatus = projectStatus
        project.projectStatusName = statusName
      }
      
      // 更新当前项目状态
      if (currentProject.value && currentProject.value.id === id) {
        currentProject.value.projectStatus = projectStatus
        currentProject.value.projectStatusName = statusName
      }
      
      return true
    } catch (error) {
      console.error('更新项目状态失败:', error)
      showError(error, { showType: 'message' })
      return false
    }
  }

  /**
   * 发布项目
   * @param {number} id - 项目ID
   */
  async function publishProject(id) {
    try {
      // 业务验证
      const canPublish = await checkProjectCanPublish(id)
      if (!canPublish.allowed) {
        throw new Error(canPublish.reason)
      }
      
      await projectApi.publishProject(id)
      
      ElMessage.success('项目发布成功')
      
      // 更新项目状态
      await updateProjectStatus(id, PROJECT_STATUS.PUBLISHED)
      
      return true
    } catch (error) {
      console.error('发布项目失败:', error)
      showError(error, { showType: 'message' })
      return false
    }
  }

  /**
   * 开始种植
   * @param {number} id - 项目ID
   * @param {Object} data - 种植信息
   */
  async function startPlanting(id, data) {
    try {
      await projectApi.startPlanting(id, data)

      ElMessage.success('项目已开始种植')

      // 更新项目状态
      await updateProjectStatus(id, PROJECT_STATUS.PLANTING)

      return true
    } catch (error) {
      console.error('开始种植失败:', error)
      showError(error, { showType: 'message' })
      return false
    }
  }

  /**
   * 开始收获
   * @param {number} id - 项目ID
   * @param {Object} data - 收获信息
   */
  async function startHarvesting(id, data) {
    try {
      await projectApi.startHarvesting(id, data)

      ElMessage.success('项目已开始收获')

      // 更新项目状态
      await updateProjectStatus(id, PROJECT_STATUS.HARVESTING)

      return true
    } catch (error) {
      console.error('开始收获失败:', error)
      showError(error, { showType: 'message' })
      return false
    }
  }

  /**
   * 完成项目
   * @param {number} id - 项目ID
   * @param {Object} data - 完成信息
   */
  async function completeProject(id, data) {
    try {
      await projectApi.completeProject(id, data)

      ElMessage.success('项目已完成')

      // 更新项目状态
      await updateProjectStatus(id, PROJECT_STATUS.COMPLETED)

      return true
    } catch (error) {
      console.error('完成项目失败:', error)
      showError(error, { showType: 'message' })
      return false
    }
  }

  /**
   * 取消项目
   * @param {number} id - 项目ID
   * @param {Object} data - 取消信息
   */
  async function cancelProject(id, data) {
    try {
      // 业务验证
      const canCancel = await checkProjectCanCancel(id)
      if (!canCancel.allowed) {
        throw new Error(canCancel.reason)
      }

      await projectApi.cancelProject(id, data)

      ElMessage.success('项目已取消')

      // 更新项目状态
      await updateProjectStatus(id, PROJECT_STATUS.CANCELLED)

      return true
    } catch (error) {
      console.error('取消项目失败:', error)
      showError(error, { showType: 'message' })
      return false
    }
  }

  /**
   * 获取项目统计信息
   * @param {number} id - 项目ID
   */
  async function fetchProjectStats(id) {
    try {
      const response = await projectApi.getProjectStats(id)
      return response.data
    } catch (error) {
      console.error('获取项目统计失败:', error)
      showError(error, { showType: 'message' })
      return null
    }
  }

  /**
   * 获取项目订单列表
   * @param {number} id - 项目ID
   * @param {Object} params - 查询参数
   */
  async function fetchProjectOrders(id, params = {}) {
    try {
      const response = await projectApi.getProjectOrders(id, params)
      return response.data
    } catch (error) {
      console.error('获取项目订单失败:', error)
      showError(error, { showType: 'message' })
      return null
    }
  }

  /**
   * 上传项目图片
   * @param {FormData} formData - 图片文件
   */
  async function uploadProjectImage(formData) {
    try {
      const response = await projectApi.uploadProjectImage(formData)

      if (response.data) {
        return response.data.url
      }
    } catch (error) {
      console.error('上传项目图片失败:', error)
      showError(error, { showType: 'message' })
      return null
    }
  }

  /**
   * 获取项目状态名称
   * @param {number} status - 状态值
   * @returns {string} 状态名称
   */
  function getProjectStatusName(status) {
    const statusMap = {
      [PROJECT_STATUS.DRAFT]: '草稿',
      [PROJECT_STATUS.PUBLISHED]: '已发布',
      [PROJECT_STATUS.ADOPTING]: '认养中',
      [PROJECT_STATUS.PLANTING]: '种植中',
      [PROJECT_STATUS.HARVESTING]: '收获中',
      [PROJECT_STATUS.COMPLETED]: '已完成',
      [PROJECT_STATUS.CANCELLED]: '已取消'
    }
    return statusMap[status] || '未知'
  }

  /**
   * 获取项目状态类型（用于标签颜色）
   * @param {number} status - 状态值
   * @returns {string} 状态类型
   */
  function getProjectStatusType(status) {
    const typeMap = {
      [PROJECT_STATUS.DRAFT]: 'info',
      [PROJECT_STATUS.PUBLISHED]: 'primary',
      [PROJECT_STATUS.ADOPTING]: 'warning',
      [PROJECT_STATUS.PLANTING]: 'success',
      [PROJECT_STATUS.HARVESTING]: 'warning',
      [PROJECT_STATUS.COMPLETED]: 'success',
      [PROJECT_STATUS.CANCELLED]: 'danger'
    }
    return typeMap[status] || 'info'
  }

  /**
   * 检查项目是否可以创建
   * @param {Object} projectData - 项目数据
   * @returns {Object} 检查结果
   */
  async function checkProjectCanCreate(projectData) {
    try {
      // 检查地块是否可用
      if (projectData.plotId) {
        // 这里应该调用地块API检查状态
        // const plotResponse = await plotApi.getPlotDetail(projectData.plotId)
        // if (!plotResponse.data.enabled) {
        //   return { allowed: false, reason: '选择的地块已被禁用' }
        // }
      }

      return { allowed: true }
    } catch (error) {
      console.warn('项目创建检查失败，跳过前端验证:', error)
      return { allowed: true }
    }
  }

  /**
   * 检查项目是否可以更新
   * @param {number} id - 项目ID
   * @param {Object} projectData - 项目数据
   * @returns {Object} 检查结果
   */
  async function checkProjectCanUpdate(id, projectData) {
    try {
      const project = projectList.value.find(p => p.id === id) || currentProject.value

      if (project) {
        // 已发布的项目不能修改基本信息
        if (project.projectStatus >= PROJECT_STATUS.PUBLISHED) {
          const restrictedFields = ['plotId', 'cropId', 'unitCount', 'unitPrice']
          const hasRestrictedChanges = restrictedFields.some(field =>
            projectData[field] !== undefined && projectData[field] !== project[field]
          )

          if (hasRestrictedChanges) {
            return {
              allowed: false,
              reason: '已发布的项目不能修改地块、作物、认养单位数量和价格'
            }
          }
        }
      }

      return { allowed: true }
    } catch (error) {
      console.warn('项目更新检查失败，跳过前端验证:', error)
      return { allowed: true }
    }
  }

  /**
   * 检查项目是否可以删除
   * @param {number} id - 项目ID
   * @returns {Object} 检查结果
   */
  async function checkProjectCanDelete(id) {
    try {
      const project = projectList.value.find(p => p.id === id) || currentProject.value

      if (project) {
        // 有订单的项目不能删除
        if (project.orderCount > 0) {
          return {
            allowed: false,
            reason: `项目下还有 ${project.orderCount} 个订单，无法删除`
          }
        }

        // 进行中的项目不能删除
        if ([PROJECT_STATUS.ADOPTING, PROJECT_STATUS.PLANTING, PROJECT_STATUS.HARVESTING].includes(project.projectStatus)) {
          return {
            allowed: false,
            reason: '进行中的项目无法删除，请先取消项目'
          }
        }
      }

      return { allowed: true }
    } catch (error) {
      console.warn('项目删除检查失败，跳过前端验证:', error)
      return { allowed: true }
    }
  }

  /**
   * 检查项目状态是否可以更新
   * @param {number} id - 项目ID
   * @param {number} newStatus - 新状态
   * @returns {Object} 检查结果
   */
  async function checkProjectStatusCanUpdate(id, newStatus) {
    try {
      const project = projectList.value.find(p => p.id === id) || currentProject.value

      if (project) {
        const currentStatus = project.projectStatus

        // 状态流转规则检查
        const allowedTransitions = {
          [PROJECT_STATUS.DRAFT]: [PROJECT_STATUS.PUBLISHED, PROJECT_STATUS.CANCELLED],
          [PROJECT_STATUS.PUBLISHED]: [PROJECT_STATUS.ADOPTING, PROJECT_STATUS.CANCELLED],
          [PROJECT_STATUS.ADOPTING]: [PROJECT_STATUS.PLANTING, PROJECT_STATUS.CANCELLED],
          [PROJECT_STATUS.PLANTING]: [PROJECT_STATUS.HARVESTING, PROJECT_STATUS.CANCELLED],
          [PROJECT_STATUS.HARVESTING]: [PROJECT_STATUS.COMPLETED, PROJECT_STATUS.CANCELLED],
          [PROJECT_STATUS.COMPLETED]: [],
          [PROJECT_STATUS.CANCELLED]: []
        }

        if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
          return {
            allowed: false,
            reason: `不能从${getProjectStatusName(currentStatus)}状态变更为${getProjectStatusName(newStatus)}状态`
          }
        }
      }

      return { allowed: true }
    } catch (error) {
      console.warn('项目状态检查失败，跳过前端验证:', error)
      return { allowed: true }
    }
  }

  /**
   * 检查项目是否可以发布
   * @param {number} id - 项目ID
   * @returns {Object} 检查结果
   */
  async function checkProjectCanPublish(id) {
    try {
      const project = projectList.value.find(p => p.id === id) || currentProject.value

      if (project) {
        // 检查必要信息是否完整
        if (!project.coverImage) {
          return { allowed: false, reason: '请先上传项目封面图片' }
        }

        if (!project.description || project.description.length < 10) {
          return { allowed: false, reason: '请完善项目描述（至少10个字符）' }
        }

        if (!project.unitCount || project.unitCount <= 0) {
          return { allowed: false, reason: '请设置认养单位数量' }
        }

        if (!project.unitPrice || project.unitPrice <= 0) {
          return { allowed: false, reason: '请设置认养单位价格' }
        }
      }

      return { allowed: true }
    } catch (error) {
      console.warn('项目发布检查失败，跳过前端验证:', error)
      return { allowed: true }
    }
  }

  /**
   * 检查项目是否可以取消
   * @param {number} id - 项目ID
   * @returns {Object} 检查结果
   */
  async function checkProjectCanCancel(id) {
    try {
      const project = projectList.value.find(p => p.id === id) || currentProject.value

      if (project) {
        // 已完成的项目不能取消
        if (project.projectStatus === PROJECT_STATUS.COMPLETED) {
          return { allowed: false, reason: '已完成的项目无法取消' }
        }

        // 已取消的项目不能再次取消
        if (project.projectStatus === PROJECT_STATUS.CANCELLED) {
          return { allowed: false, reason: '项目已经是取消状态' }
        }
      }

      return { allowed: true }
    } catch (error) {
      console.warn('项目取消检查失败，跳过前端验证:', error)
      return { allowed: true }
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
      projectName: '',
      farmId: null,
      plotId: null,
      cropId: null,
      projectStatus: null,
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
   * 清空当前项目数据
   */
  function clearCurrentProject() {
    currentProject.value = null
  }

  return {
    // 状态
    projectList,
    currentProject,
    loading,
    pagination,
    searchParams,
    projectSelector,
    projectStatusOptions,
    cropOptions,

    // 计算属性
    hasData,
    totalPages,

    // 常量
    PROJECT_STATUS,

    // 方法
    fetchProjectList,
    fetchMyProjectList,
    fetchProjectDetail,
    createProject,
    updateProject,
    deleteProject,
    batchDeleteProjects,
    updateProjectStatus,
    publishProject,
    startPlanting,
    startHarvesting,
    completeProject,
    cancelProject,
    fetchProjectStats,
    fetchProjectOrders,
    uploadProjectImage,
    getProjectStatusName,
    getProjectStatusType,
    setSearchParams,
    resetSearchParams,
    setPagination,
    clearCurrentProject
  }
})
