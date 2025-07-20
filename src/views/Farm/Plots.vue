<template>
  <div class="plot-list">
    <div class="page-container">
      <!-- 搜索区域 -->
      <el-card class="ifarm-card search-card">
        <el-form
          ref="searchFormRef"
          :model="searchForm"
          :inline="true"
          class="search-form"
        >
          <el-form-item label="地块名称" prop="plotName">
            <el-input
              v-model="searchForm.plotName"
              placeholder="请输入地块名称"
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
              @change="handleSearch"
            >
              <el-option
                v-for="farm in farmOptions"
                :key="farm.id"
                :label="farm.farmName"
                :value="farm.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="地块状态" prop="plotStatus">
            <el-select
              v-model="searchForm.plotStatus"
              placeholder="请选择状态"
              clearable
              style="width: 150px"
            >
              <el-option label="空闲" :value="1" />
              <el-option label="种植中" :value="2" />
              <el-option label="收获中" :value="3" />
              <el-option label="休耕" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="启用状态" prop="enabled">
            <el-select
              v-model="searchForm.enabled"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="启用" :value="true" />
              <el-option label="禁用" :value="false" />
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
              新建地块
            </el-button>
            <el-button
              type="success"
              :disabled="!hasSelection"
              @click="handleBatchEnable"
            >
              <el-icon><Check /></el-icon>
              批量启用
            </el-button>
            <el-button
              type="warning"
              :disabled="!hasSelection"
              @click="handleBatchDisable"
            >
              <el-icon><Close /></el-icon>
              批量禁用
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
          v-loading="plotStore.loading"
          :data="plotStore.plotList"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column prop="id" label="ID" width="80" />

          <el-table-column label="地块信息" min-width="200">
            <template #default="{ row }">
              <div class="plot-info">
                <div class="plot-avatar">
                  <el-image
                    v-if="row.images && row.images.length > 0"
                    :src="row.images[0]"
                    :preview-src-list="row.images"
                    fit="cover"
                    style="width: 50px; height: 50px; border-radius: 8px"
                  />
                  <div v-else class="avatar-placeholder">
                    <el-icon><Grid /></el-icon>
                  </div>
                </div>
                <div class="plot-details">
                  <div class="plot-name">{{ row.plotName }}</div>
                  <div class="plot-farm">{{ row.farmName || '未设置' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="area" label="面积(亩)" width="100" align="center">
            <template #default="{ row }">
              <span>{{ row.area || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="土壤/灌溉" width="140" align="center">
            <template #default="{ row }">
              <div class="soil-irrigation">
                <div class="soil-type">{{ row.soilType || '-' }}</div>
                <div class="irrigation-type">{{ row.irrigationType || '-' }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="统计信息" width="120" align="center">
            <template #default="{ row }">
              <div class="stats-info">
                <div class="stat-item">
                  <span class="stat-label">项目:</span>
                  <span class="stat-value">{{ row.projectCount || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">认养:</span>
                  <span class="stat-value">{{ row.adoptedUnitCount || 0 }}/{{ row.unitCount || 0 }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="plotStatus" label="地块状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getPlotStatusType(row.plotStatus)"
                size="small"
              >
                {{ getPlotStatusName(row.plotStatus) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="enabled" label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'danger'" size="small">
                {{ row.enabled ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" width="160" align="center">
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="220" align="center" fixed="right">
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
                      <el-dropdown-item :command="`status-${row.id}`">
                        更改状态
                      </el-dropdown-item>
                      <el-dropdown-item :command="`toggle-${row.id}`">
                        {{ row.enabled ? '禁用' : '启用' }}
                      </el-dropdown-item>
                      <el-dropdown-item :command="`delete-${row.id}`" divided>
                        删除
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
            v-model:current-page="plotStore.pagination.current"
            v-model:page-size="plotStore.pagination.size"
            :total="plotStore.pagination.total"
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
        title="更改地块状态"
        width="400px"
      >
        <el-form :model="statusForm" label-width="80px">
          <el-form-item label="地块名称">
            <span>{{ currentPlotForStatus?.plotName }}</span>
          </el-form-item>
          <el-form-item label="当前状态">
            <el-tag :type="getPlotStatusType(currentPlotForStatus?.plotStatus)">
              {{ getPlotStatusName(currentPlotForStatus?.plotStatus) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="新状态" required>
            <el-select v-model="statusForm.plotStatus" placeholder="请选择新状态" style="width: 100%">
              <el-option label="空闲" :value="1" />
              <el-option label="种植中" :value="2" />
              <el-option label="收获中" :value="3" />
              <el-option label="休耕" :value="4" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePlotStore } from '@/stores/plot'
import { useFarmStore } from '@/stores/farm'
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const plotStore = usePlotStore()
const farmStore = useFarmStore()

// 响应式数据
const searchFormRef = ref()
const tableRef = ref()
const selectedRows = ref([])
const statusDialogVisible = ref(false)
const currentPlotForStatus = ref(null)

const searchForm = reactive({
  plotName: '',
  farmId: null,
  plotStatus: null,
  enabled: null
})

const statusForm = reactive({
  plotStatus: null
})

const farmOptions = ref([])

// 计算属性
const hasSelection = computed(() => selectedRows.value.length > 0)

// 方法
const loadFarmOptions = async () => {
  const farms = await farmStore.fetchFarmSelector({ enabled: true })
  farmOptions.value = farms || []
}

const handleSearch = () => {
  plotStore.setSearchParams(searchForm)
  plotStore.setPagination({ current: 1 })
  plotStore.fetchPlotList()
}

const handleReset = () => {
  searchFormRef.value?.resetFields()
  Object.assign(searchForm, {
    plotName: '',
    farmId: null,
    plotStatus: null,
    enabled: null
  })
  plotStore.resetSearchParams()
  plotStore.setPagination({ current: 1 })
  plotStore.fetchPlotList()
}

const handleCreate = () => {
  const farmId = route.query.farmId
  if (farmId) {
    router.push(`/plots/create?farmId=${farmId}`)
  } else {
    router.push('/plots/create')
  }
}

const handleView = (row) => {
  router.push(`/plots/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/plots/${row.id}/edit`)
}

const handleRefresh = () => {
  plotStore.fetchPlotList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleBatchEnable = async () => {
  const ids = selectedRows.value.map(row => row.id)
  const success = await plotStore.batchTogglePlotStatus(ids, true)
  if (success) {
    selectedRows.value = []
  }
}

const handleBatchDisable = async () => {
  const ids = selectedRows.value.map(row => row.id)
  const success = await plotStore.batchTogglePlotStatus(ids, false)
  if (success) {
    selectedRows.value = []
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个地块吗？此操作不可恢复！`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selectedRows.value.map(row => row.id)
    const success = await plotStore.batchDeletePlots(ids)
    if (success) {
      selectedRows.value = []
    }
  } catch (error) {
    // 用户取消操作
  }
}

const handleDropdownCommand = async (command, row) => {
  const [action, id] = command.split('-')

  if (action === 'status') {
    currentPlotForStatus.value = row
    statusForm.plotStatus = row.plotStatus
    statusDialogVisible.value = true
  } else if (action === 'toggle') {
    await plotStore.togglePlotStatus(parseInt(id), !row.enabled)
  } else if (action === 'delete') {
    try {
      await ElMessageBox.confirm(
        `确定要删除地块"${row.plotName}"吗？此操作不可恢复！`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await plotStore.deletePlot(parseInt(id))
    } catch (error) {
      // 用户取消操作
    }
  }
}

const handleStatusConfirm = async () => {
  if (!statusForm.plotStatus) {
    ElMessage.warning('请选择新状态')
    return
  }

  const success = await plotStore.updatePlotStatus(
    currentPlotForStatus.value.id,
    statusForm.plotStatus
  )

  if (success) {
    statusDialogVisible.value = false
    currentPlotForStatus.value = null
    statusForm.plotStatus = null
  }
}

const handleSizeChange = (size) => {
  plotStore.setPagination({ size, current: 1 })
  plotStore.fetchPlotList()
}

const handleCurrentChange = (current) => {
  plotStore.setPagination({ current })
  plotStore.fetchPlotList()
}

const getPlotStatusName = (status) => {
  return plotStore.getPlotStatusName(status)
}

const getPlotStatusType = (status) => {
  const typeMap = {
    1: 'info',     // 空闲
    2: 'success',  // 种植中
    3: 'warning',  // 收获中
    4: 'danger'    // 休耕
  }
  return typeMap[status] || 'info'
}

// 生命周期
onMounted(async () => {
  // 如果URL中有farmId参数，设置到搜索条件中
  if (route.query.farmId) {
    searchForm.farmId = parseInt(route.query.farmId)
    plotStore.setSearchParams({ farmId: searchForm.farmId })
  }

  await loadFarmOptions()
  await plotStore.fetchPlotList()
})
</script>

<style lang="scss" scoped>
.plot-list {
  .search-card {
    margin-bottom: 16px;

    .search-form {
      .el-form-item {
        margin-bottom: 16px;
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
    .plot-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .plot-avatar {
        .avatar-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          background-color: var(--el-bg-color-page);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-text-color-placeholder);
          font-size: 20px;
        }
      }

      .plot-details {
        .plot-name {
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .plot-farm {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .soil-irrigation {
      .soil-type {
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
        font-size: 12px;
      }

      .irrigation-type {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .stats-info {
      .stat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        font-size: 12px;

        .stat-label {
          color: var(--el-text-color-secondary);
        }

        .stat-value {
          color: var(--ifarm-primary);
          font-weight: 500;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .plot-list {
    .search-form {
      .el-form-item {
        width: 100%;
        margin-bottom: 12px;

        :deep(.el-input),
        :deep(.el-select) {
          width: 100% !important;
        }
      }
    }

    .action-bar {
      flex-direction: column;
      gap: 12px;
      align-items: stretch !important;

      .action-left {
        flex-wrap: wrap;
        gap: 8px;
      }

      .action-right {
        align-self: center;
      }
    }

    .table-card {
      :deep(.el-table) {
        .el-table__cell {
          padding: 8px 4px;
        }
      }

      .plot-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;

        .plot-avatar {
          align-self: center;
        }
      }

      .action-buttons {
        flex-direction: column;
        gap: 4px;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
