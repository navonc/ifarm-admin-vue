<template>
  <div class="project-list">
    <div class="page-container">
      <!-- 搜索区域 -->
      <el-card class="ifarm-card search-card">
        <el-form
          ref="searchFormRef"
          :model="searchForm"
          :inline="true"
          class="search-form"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="searchForm.projectName"
              placeholder="请输入项目名称"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item label="所属农场" prop="farmId">
            <el-select
              v-model="searchForm.farmId"
              placeholder="请选择农场"
              clearable
              filterable
              style="width: 200px"
              @change="handleFarmChange"
            >
              <el-option
                v-for="farm in farmOptions"
                :key="farm.id"
                :label="farm.farmName"
                :value="farm.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属地块" prop="plotId">
            <el-select
              v-model="searchForm.plotId"
              placeholder="请选择地块"
              clearable
              filterable
              style="width: 200px"
              :disabled="!searchForm.farmId"
            >
              <el-option
                v-for="plot in plotOptions"
                :key="plot.id"
                :label="plot.plotName"
                :value="plot.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="作物类型" prop="cropId">
            <el-select
              v-model="searchForm.cropId"
              placeholder="请选择作物"
              clearable
              filterable
              style="width: 150px"
            >
              <el-option
                v-for="crop in cropOptions"
                :key="crop.id"
                :label="crop.cropName"
                :value="crop.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="项目状态" prop="projectStatus">
            <el-select
              v-model="searchForm.projectStatus"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="草稿" :value="1" />
              <el-option label="已发布" :value="2" />
              <el-option label="认养中" :value="3" />
              <el-option label="种植中" :value="4" />
              <el-option label="收获中" :value="5" />
              <el-option label="已完成" :value="6" />
              <el-option label="已取消" :value="7" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 操作区域 -->
      <el-card class="ifarm-card action-card">
        <div class="action-bar">
          <div class="action-left">
            <el-button type="primary" @click="handleCreate">
              <el-icon><Plus /></el-icon>
              新建项目
            </el-button>
            <el-button
              type="success"
              :disabled="!hasSelection"
              @click="handleBatchPublish"
            >
              <el-icon><Upload /></el-icon>
              批量发布
            </el-button>
            <el-button
              type="warning"
              :disabled="!hasSelection"
              @click="handleBatchCancel"
            >
              <el-icon><Close /></el-icon>
              批量取消
            </el-button>
            <el-button
              type="danger"
              :disabled="!hasSelection"
              @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
          </div>
          <div class="action-right">
            <el-tooltip content="刷新数据" placement="top">
              <el-button circle @click="handleRefresh">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-card>

      <!-- 数据表格 -->
      <el-card class="ifarm-card table-card">
        <el-table
          ref="tableRef"
          v-loading="projectStore.loading"
          :data="projectStore.projectList"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          
          <el-table-column prop="id" label="ID" width="80" />
          
          <el-table-column label="项目信息" min-width="250">
            <template #default="{ row }">
              <div class="project-info">
                <div class="project-avatar">
                  <el-image
                    v-if="row.coverImage"
                    :src="row.coverImage"
                    :preview-src-list="[row.coverImage]"
                    fit="cover"
                    style="width: 60px; height: 60px; border-radius: 8px"
                  />
                  <div v-else class="avatar-placeholder">
                    <el-icon><Crop /></el-icon>
                  </div>
                </div>
                <div class="project-details">
                  <div class="project-name">{{ row.projectName }}</div>
                  <div class="project-meta">
                    <span class="meta-item">{{ row.farmName || '未设置' }}</span>
                    <span class="meta-divider">|</span>
                    <span class="meta-item">{{ row.plotName || '未设置' }}</span>
                  </div>
                  <div class="project-crop">{{ row.cropName || '未设置作物' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="认养信息" width="140" align="center">
            <template #default="{ row }">
              <div class="adoption-info">
                <div class="adoption-progress">
                  <el-progress
                    :percentage="row.adoptionRate || 0"
                    :stroke-width="6"
                    :show-text="false"
                  />
                  <div class="progress-text">
                    {{ row.adoptedUnitCount || 0 }}/{{ row.unitCount || 0 }}
                  </div>
                </div>
                <div class="unit-price">
                  ¥{{ row.unitPrice || 0 }}/单位
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="种植计划" width="120" align="center">
            <template #default="{ row }">
              <div class="planting-plan">
                <div class="plan-item">
                  <span class="plan-label">种植:</span>
                  <span class="plan-date">{{ formatDate(row.plannedPlantingDate, 'MM-DD') }}</span>
                </div>
                <div class="plan-item">
                  <span class="plan-label">收获:</span>
                  <span class="plan-date">{{ formatDate(row.plannedHarvestDate, 'MM-DD') }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="projectStatus" label="项目状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="projectStore.getProjectStatusType(row.projectStatus)" 
                size="small"
              >
                {{ projectStore.getProjectStatusName(row.projectStatus) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" width="160" align="center">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="240" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" @click="handleView(row)">
                  查看
                </el-button>
                <el-button type="success" size="small" @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-dropdown @command="(command) => handleDropdownCommand(command, row)">
                  <el-button size="small">
                    更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item 
                        :command="`publish-${row.id}`"
                        :disabled="row.projectStatus !== 1"
                      >
                        发布项目
                      </el-dropdown-item>
                      <el-dropdown-item :command="`status-${row.id}`">
                        更改状态
                      </el-dropdown-item>
                      <el-dropdown-item :command="`orders-${row.id}`">
                        查看订单
                      </el-dropdown-item>
                      <el-dropdown-item :command="`cancel-${row.id}`" divided>
                        取消项目
                      </el-dropdown-item>
                      <el-dropdown-item :command="`delete-${row.id}`">
                        删除项目
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="projectStore.pagination.current"
            v-model:page-size="projectStore.pagination.size"
            :total="projectStore.pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <!-- 状态更改对话框 -->
      <el-dialog
        v-model="statusDialogVisible"
        title="更改项目状态"
        width="400px"
      >
        <el-form :model="statusForm" label-width="80px">
          <el-form-item label="项目名称">
            <span>{{ currentProjectForStatus?.projectName }}</span>
          </el-form-item>
          <el-form-item label="当前状态">
            <el-tag :type="projectStore.getProjectStatusType(currentProjectForStatus?.projectStatus)">
              {{ projectStore.getProjectStatusName(currentProjectForStatus?.projectStatus) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="新状态" required>
            <el-select v-model="statusForm.projectStatus" placeholder="请选择新状态" style="width: 100%">
              <el-option label="草稿" :value="1" />
              <el-option label="已发布" :value="2" />
              <el-option label="认养中" :value="3" />
              <el-option label="种植中" :value="4" />
              <el-option label="收获中" :value="5" />
              <el-option label="已完成" :value="6" />
              <el-option label="已取消" :value="7" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleStatusConfirm">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { useFarmStore } from '@/stores/farm'
import { usePlotStore } from '@/stores/plot'
import { formatDate } from '@/utils/date'

// 路由
const router = useRouter()

// Store
const projectStore = useProjectStore()
const farmStore = useFarmStore()
const plotStore = usePlotStore()

// 响应式数据
const searchFormRef = ref()
const tableRef = ref()
const selectedRows = ref([])

const searchForm = reactive({
  projectName: '',
  farmId: null,
  plotId: null,
  cropId: null,
  projectStatus: null
})

const farmOptions = ref([])
const plotOptions = ref([])
const cropOptions = ref([])

// 状态更改对话框
const statusDialogVisible = ref(false)
const currentProjectForStatus = ref(null)
const statusForm = reactive({
  projectStatus: null
})

// 计算属性
const hasSelection = computed(() => selectedRows.value.length > 0)

// 方法
const loadFarmOptions = async () => {
  try {
    const farms = await farmStore.fetchFarmSelector()
    farmOptions.value = farms || []
  } catch (error) {
    console.error('加载农场选项失败:', error)
  }
}

const loadPlotOptions = async (farmId) => {
  if (!farmId) {
    plotOptions.value = []
    return
  }

  try {
    const plots = await plotStore.fetchPlotSelector({ farmId })
    plotOptions.value = plots || []
  } catch (error) {
    console.error('加载地块选项失败:', error)
  }
}

const loadCropOptions = async () => {
  try {
    // 这里应该调用作物API
    // const crops = await cropStore.fetchCropSelector()
    // cropOptions.value = crops || []

    // 暂时使用Mock数据
    cropOptions.value = [
      { id: 1, cropName: '水稻' },
      { id: 2, cropName: '小麦' },
      { id: 3, cropName: '玉米' },
      { id: 4, cropName: '大豆' },
      { id: 5, cropName: '蔬菜' }
    ]
  } catch (error) {
    console.error('加载作物选项失败:', error)
  }
}

const handleFarmChange = (farmId) => {
  searchForm.plotId = null
  loadPlotOptions(farmId)
}

const handleSearch = () => {
  projectStore.setSearchParams(searchForm)
  projectStore.setPagination({ current: 1 })
  projectStore.fetchProjectList()
}

const handleReset = () => {
  Object.assign(searchForm, {
    projectName: '',
    farmId: null,
    plotId: null,
    cropId: null,
    projectStatus: null
  })
  plotOptions.value = []
  projectStore.resetSearchParams()
  projectStore.setPagination({ current: 1 })
  projectStore.fetchProjectList()
}

const handleRefresh = () => {
  projectStore.fetchProjectList()
}

const handleCreate = () => {
  router.push('/projects/create')
}

const handleView = (row) => {
  router.push(`/projects/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/projects/${row.id}/edit`)
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleBatchPublish = async () => {
  const draftProjects = selectedRows.value.filter(row => row.projectStatus === 1)

  if (draftProjects.length === 0) {
    ElMessage.warning('请选择草稿状态的项目进行发布')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要发布选中的 ${draftProjects.length} 个项目吗？`,
      '批量发布确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 批量发布
    for (const project of draftProjects) {
      await projectStore.publishProject(project.id)
    }

    ElMessage.success(`成功发布 ${draftProjects.length} 个项目`)
    handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量发布失败:', error)
    }
  }
}

const handleBatchCancel = async () => {
  const cancelableProjects = selectedRows.value.filter(row =>
    ![6, 7].includes(row.projectStatus) // 排除已完成和已取消的项目
  )

  if (cancelableProjects.length === 0) {
    ElMessage.warning('请选择可取消的项目')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要取消选中的 ${cancelableProjects.length} 个项目吗？`,
      '批量取消确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 批量取消
    for (const project of cancelableProjects) {
      await projectStore.cancelProject(project.id, { reason: '批量取消操作' })
    }

    ElMessage.success(`成功取消 ${cancelableProjects.length} 个项目`)
    handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量取消失败:', error)
    }
  }
}

const handleBatchDelete = async () => {
  const deletableProjects = selectedRows.value.filter(row =>
    [1, 7].includes(row.projectStatus) // 只能删除草稿和已取消的项目
  )

  if (deletableProjects.length === 0) {
    ElMessage.warning('只能删除草稿或已取消状态的项目')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${deletableProjects.length} 个项目吗？删除后无法恢复！`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
    )

    const ids = deletableProjects.map(project => project.id)
    const success = await projectStore.batchDeleteProjects(ids)

    if (success) {
      // 清空选择
      selectedRows.value = []
      tableRef.value?.clearSelection()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
    }
  }
}

const handleDropdownCommand = async (command, row) => {
  const [action, id] = command.split('-')
  const projectId = parseInt(id)

  switch (action) {
    case 'publish':
      await handlePublishProject(projectId)
      break
    case 'status':
      handleChangeStatus(row)
      break
    case 'orders':
      router.push(`/orders?projectId=${projectId}`)
      break
    case 'cancel':
      await handleCancelProject(projectId)
      break
    case 'delete':
      await handleDeleteProject(projectId)
      break
  }
}

const handlePublishProject = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要发布这个项目吗？发布后项目将对用户可见。',
      '发布项目确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await projectStore.publishProject(id)
    handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布项目失败:', error)
    }
  }
}

const handleChangeStatus = (row) => {
  currentProjectForStatus.value = row
  statusForm.projectStatus = row.projectStatus
  statusDialogVisible.value = true
}

const handleStatusConfirm = async () => {
  if (!statusForm.projectStatus) {
    ElMessage.warning('请选择新状态')
    return
  }

  if (statusForm.projectStatus === currentProjectForStatus.value.projectStatus) {
    ElMessage.warning('新状态与当前状态相同')
    return
  }

  try {
    await projectStore.updateProjectStatus(
      currentProjectForStatus.value.id,
      statusForm.projectStatus
    )

    statusDialogVisible.value = false
    handleRefresh()
  } catch (error) {
    console.error('更改状态失败:', error)
  }
}

const handleCancelProject = async (id) => {
  try {
    const { value: reason } = await ElMessageBox.prompt(
      '请输入取消原因：',
      '取消项目',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{1,}/,
        inputErrorMessage: '取消原因不能为空'
      }
    )

    await projectStore.cancelProject(id, { reason })
    handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消项目失败:', error)
    }
  }
}

const handleDeleteProject = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个项目吗？删除后无法恢复！',
      '删除项目确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
    )

    await projectStore.deleteProject(id)
    handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除项目失败:', error)
    }
  }
}

const handleSizeChange = (size) => {
  projectStore.setPagination({ size, current: 1 })
  projectStore.fetchProjectList()
}

const handleCurrentChange = (current) => {
  projectStore.setPagination({ current })
  projectStore.fetchProjectList()
}

// 监听农场变化
watch(() => searchForm.farmId, (newFarmId) => {
  if (newFarmId) {
    loadPlotOptions(newFarmId)
  } else {
    plotOptions.value = []
    searchForm.plotId = null
  }
})

// 生命周期
onMounted(async () => {
  await Promise.all([
    loadFarmOptions(),
    loadCropOptions(),
    projectStore.fetchProjectList()
  ])
})
</script>

<style lang="scss" scoped>
.project-list {
  .search-card {
    margin-bottom: 16px;

    .search-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .action-card {
    margin-bottom: 16px;

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .action-left {
        display: flex;
        gap: 12px;
      }
    }
  }

  .table-card {
    .project-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .project-avatar {
        flex-shrink: 0;

        .avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: var(--el-fill-color-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-text-color-placeholder);
          font-size: 24px;
        }
      }

      .project-details {
        flex: 1;
        min-width: 0;

        .project-name {
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-meta {
          font-size: 12px;
          color: var(--el-text-color-regular);
          margin-bottom: 4px;

          .meta-item {
            display: inline-block;
          }

          .meta-divider {
            margin: 0 6px;
            color: var(--el-border-color);
          }
        }

        .project-crop {
          font-size: 12px;
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }
      }
    }

    .adoption-info {
      text-align: center;

      .adoption-progress {
        margin-bottom: 8px;

        .progress-text {
          font-size: 12px;
          color: var(--el-text-color-regular);
          margin-top: 4px;
        }
      }

      .unit-price {
        font-size: 12px;
        color: var(--el-color-success);
        font-weight: 600;
      }
    }

    .planting-plan {
      .plan-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        font-size: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .plan-label {
          color: var(--el-text-color-regular);
        }

        .plan-date {
          color: var(--el-text-color-primary);
          font-weight: 500;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .project-list {
    .search-form {
      .el-form-item {
        width: 100%;
        margin-bottom: 12px;

        .el-input,
        .el-select {
          width: 100% !important;
        }
      }
    }

    .action-bar {
      flex-direction: column;
      gap: 12px;

      .action-left {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    .project-info {
      .project-details {
        .project-name {
          font-size: 14px;
        }

        .project-meta,
        .project-crop {
          font-size: 11px;
        }
      }
    }

    .action-buttons {
      .el-button {
        padding: 4px 8px;
        font-size: 12px;
      }
    }
  }
}
</style>
