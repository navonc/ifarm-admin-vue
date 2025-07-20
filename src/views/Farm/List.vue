<template>
  <div class="farm-list">
    <div class="page-container">
      <!-- 搜索区域 -->
      <el-card class="ifarm-card search-card">
        <el-form
          ref="searchFormRef"
          :model="searchForm"
          :inline="true"
          class="search-form"
        >
          <el-form-item label="农场名称" prop="farmName">
            <el-input
              v-model="searchForm.farmName"
              placeholder="请输入农场名称"
              clearable
              style="width: 200px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item label="省份" prop="province">
            <el-select
              v-model="searchForm.province"
              placeholder="请选择省份"
              clearable
              style="width: 150px"
              @change="handleProvinceChange"
            >
              <el-option
                v-for="province in provinces"
                :key="province.code"
                :label="province.name"
                :value="province.code"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="城市" prop="city">
            <el-select
              v-model="searchForm.city"
              placeholder="请选择城市"
              clearable
              style="width: 150px"
              :disabled="!searchForm.province"
            >
              <el-option
                v-for="city in cities"
                :key="city.code"
                :label="city.name"
                :value="city.code"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="enabled">
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
              新建农场
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
          v-loading="farmStore.loading"
          :data="farmStore.farmList"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />

          <el-table-column prop="id" label="ID" width="80" />

          <el-table-column label="农场信息" min-width="200">
            <template #default="{ row }">
              <div class="farm-info">
                <div class="farm-avatar">
                  <el-image
                    v-if="row.coverImage"
                    :src="row.coverImage"
                    :preview-src-list="[row.coverImage]"
                    fit="cover"
                    style="width: 50px; height: 50px; border-radius: 8px"
                  />
                  <div v-else class="avatar-placeholder">
                    <el-icon><MapLocation /></el-icon>
                  </div>
                </div>
                <div class="farm-details">
                  <div class="farm-name">{{ row.farmName }}</div>
                  <div class="farm-owner">{{ row.ownerName || '未设置' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="地址" min-width="180">
            <template #default="{ row }">
              <div class="address-info">
                <div class="region">{{ row.province }} {{ row.city }} {{ row.district }}</div>
                <div class="detail-address">{{ row.address }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="totalArea" label="总面积(亩)" width="100" align="center">
            <template #default="{ row }">
              <span>{{ row.totalArea || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="统计信息" width="120" align="center">
            <template #default="{ row }">
              <div class="stats-info">
                <div class="stat-item">
                  <span class="stat-label">地块:</span>
                  <span class="stat-value">{{ row.plotCount || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">项目:</span>
                  <span class="stat-value">{{ row.projectCount || 0 }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="enabled" label="状态" width="80" align="center">
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

          <el-table-column label="操作" width="200" align="center" fixed="right">
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
            v-model:current-page="farmStore.pagination.current"
            v-model:page-size="farmStore.pagination.size"
            :total="farmStore.pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFarmStore } from '@/stores/farm'
import { formatDate } from '@/utils/date'

const router = useRouter()
const farmStore = useFarmStore()

// 响应式数据
const searchFormRef = ref()
const tableRef = ref()
const selectedRows = ref([])

const searchForm = reactive({
  farmName: '',
  province: '',
  city: '',
  enabled: null
})

// Mock省市数据，实际应该从API获取
const provinces = ref([
  { code: '110000', name: '北京市' },
  { code: '120000', name: '天津市' },
  { code: '130000', name: '河北省' },
  { code: '140000', name: '山西省' },
  { code: '150000', name: '内蒙古自治区' },
  { code: '210000', name: '辽宁省' },
  { code: '220000', name: '吉林省' },
  { code: '230000', name: '黑龙江省' },
  { code: '310000', name: '上海市' },
  { code: '320000', name: '江苏省' },
  { code: '330000', name: '浙江省' },
  { code: '340000', name: '安徽省' },
  { code: '350000', name: '福建省' },
  { code: '360000', name: '江西省' },
  { code: '370000', name: '山东省' },
  { code: '410000', name: '河南省' },
  { code: '420000', name: '湖北省' },
  { code: '430000', name: '湖南省' },
  { code: '440000', name: '广东省' },
  { code: '450000', name: '广西壮族自治区' },
  { code: '460000', name: '海南省' },
  { code: '500000', name: '重庆市' },
  { code: '510000', name: '四川省' },
  { code: '520000', name: '贵州省' },
  { code: '530000', name: '云南省' },
  { code: '540000', name: '西藏自治区' },
  { code: '610000', name: '陕西省' },
  { code: '620000', name: '甘肃省' },
  { code: '630000', name: '青海省' },
  { code: '640000', name: '宁夏回族自治区' },
  { code: '650000', name: '新疆维吾尔自治区' }
])

const cities = ref([])

// 计算属性
const hasSelection = computed(() => selectedRows.value.length > 0)

// 方法
const handleProvinceChange = (provinceCode) => {
  searchForm.city = ''
  // 这里应该根据省份获取城市数据
  // 暂时使用Mock数据
  if (provinceCode === '110000') {
    cities.value = [
      { code: '110100', name: '北京市' }
    ]
  } else if (provinceCode === '310000') {
    cities.value = [
      { code: '310100', name: '上海市' }
    ]
  } else {
    cities.value = []
  }
}

const handleSearch = () => {
  farmStore.setSearchParams(searchForm)
  farmStore.setPagination({ current: 1 })
  farmStore.fetchFarmList()
}

const handleReset = () => {
  searchFormRef.value?.resetFields()
  Object.assign(searchForm, {
    farmName: '',
    province: '',
    city: '',
    enabled: null
  })
  cities.value = []
  farmStore.resetSearchParams()
  farmStore.setPagination({ current: 1 })
  farmStore.fetchFarmList()
}

const handleCreate = () => {
  router.push('/farms/create')
}

const handleView = (row) => {
  router.push(`/farms/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/farms/${row.id}/edit`)
}

const handleRefresh = () => {
  farmStore.fetchFarmList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleBatchEnable = async () => {
  const ids = selectedRows.value.map(row => row.id)
  const success = await farmStore.batchToggleFarmStatus(ids, true)
  if (success) {
    selectedRows.value = []
  }
}

const handleBatchDisable = async () => {
  const ids = selectedRows.value.map(row => row.id)
  const success = await farmStore.batchToggleFarmStatus(ids, false)
  if (success) {
    selectedRows.value = []
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个农场吗？此操作不可恢复！`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = selectedRows.value.map(row => row.id)
    const success = await farmStore.batchDeleteFarms(ids)
    if (success) {
      selectedRows.value = []
    }
  } catch (error) {
    // 用户取消操作
  }
}

const handleDropdownCommand = async (command, row) => {
  const [action, id] = command.split('-')

  if (action === 'toggle') {
    await farmStore.toggleFarmStatus(parseInt(id), !row.enabled)
  } else if (action === 'delete') {
    try {
      await ElMessageBox.confirm(
        `确定要删除农场"${row.farmName}"吗？此操作不可恢复！`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await farmStore.deleteFarm(parseInt(id))
    } catch (error) {
      // 用户取消操作
    }
  }
}

const handleSizeChange = (size) => {
  farmStore.setPagination({ size, current: 1 })
  farmStore.fetchFarmList()
}

const handleCurrentChange = (current) => {
  farmStore.setPagination({ current })
  farmStore.fetchFarmList()
}

// 生命周期
onMounted(() => {
  farmStore.fetchFarmList()
})
</script>

<style lang="scss" scoped>
.farm-list {
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
    .farm-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .farm-avatar {
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

      .farm-details {
        .farm-name {
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .farm-owner {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .address-info {
      .region {
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
      }

      .detail-address {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 160px;
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
  .farm-list {
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

      .farm-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;

        .farm-avatar {
          align-self: center;
        }
      }

      .address-info {
        .detail-address {
          max-width: 120px;
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
