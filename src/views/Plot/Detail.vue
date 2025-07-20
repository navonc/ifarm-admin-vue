<template>
  <div class="plot-detail">
    <div class="page-container">
      <!-- 头部操作区 -->
      <el-card class="ifarm-card header-card">
        <div class="header-content">
          <div class="header-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <div class="page-title">
              <h2>{{ plotData?.plotName || '地块详情' }}</h2>
              <div class="status-tags">
                <el-tag 
                  :type="getPlotStatusType(plotData?.plotStatus)" 
                  size="large"
                >
                  {{ getPlotStatusName(plotData?.plotStatus) }}
                </el-tag>
                <el-tag 
                  :type="plotData?.enabled ? 'success' : 'danger'" 
                  size="large"
                >
                  {{ plotData?.enabled ? '启用' : '禁用' }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="handleEdit">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-dropdown @command="handleDropdownCommand">
              <el-button>
                更多操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="status">
                    更改状态
                  </el-dropdown-item>
                  <el-dropdown-item command="toggle">
                    {{ plotData?.enabled ? '禁用' : '启用' }}地块
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    删除地块
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>

      <el-row :gutter="20">
        <!-- 左侧信息区 -->
        <el-col :xs="24" :lg="16">
          <!-- 基本信息 -->
          <el-card class="ifarm-card info-card">
            <template #header>
              <div class="card-title">
                <el-icon><InfoFilled /></el-icon>
                基本信息
              </div>
            </template>

            <div class="info-content">
              <div class="info-row">
                <div class="info-label">地块名称：</div>
                <div class="info-value">{{ plotData?.plotName || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">所属农场：</div>
                <div class="info-value">
                  <el-link 
                    v-if="plotData?.farmId" 
                    type="primary" 
                    @click="handleViewFarm"
                  >
                    {{ plotData?.farmName || '-' }}
                  </el-link>
                  <span v-else>-</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">地块面积：</div>
                <div class="info-value">{{ plotData?.area || '-' }} 亩</div>
              </div>
              <div class="info-row">
                <div class="info-label">土壤类型：</div>
                <div class="info-value">{{ plotData?.soilType || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">灌溉方式：</div>
                <div class="info-value">{{ plotData?.irrigationType || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">当前作物：</div>
                <div class="info-value">{{ plotData?.currentCrop || '暂无' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">地块描述：</div>
                <div class="info-value description">
                  {{ plotData?.description || '暂无描述' }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">创建时间：</div>
                <div class="info-value">{{ formatDate(plotData?.createTime) }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">更新时间：</div>
                <div class="info-value">{{ formatDate(plotData?.updateTime) }}</div>
              </div>
            </div>
          </el-card>

          <!-- 位置信息 -->
          <el-card class="ifarm-card location-card">
            <template #header>
              <div class="card-title">
                <el-icon><Location /></el-icon>
                位置信息
              </div>
            </template>

            <div class="location-content">
              <div v-if="plotData?.locationInfo?.coordinates?.length === 2" class="coordinates-info">
                <h4>中心坐标</h4>
                <p>经度：{{ plotData.locationInfo.coordinates[0] }}</p>
                <p>纬度：{{ plotData.locationInfo.coordinates[1] }}</p>
              </div>

              <div v-if="plotData?.locationInfo?.boundaries?.length > 0" class="boundaries-info">
                <h4>边界坐标</h4>
                <div class="boundary-points">
                  <div 
                    v-for="(point, index) in plotData.locationInfo.boundaries" 
                    :key="index"
                    class="boundary-point"
                  >
                    <span class="point-label">点{{ index + 1 }}：</span>
                    <span class="point-coords">{{ point[0] }}, {{ point[1] }}</span>
                  </div>
                </div>
              </div>

              <div v-if="!plotData?.locationInfo?.coordinates?.length && !plotData?.locationInfo?.boundaries?.length" class="no-location">
                <el-icon size="48" color="#dcdfe6"><Location /></el-icon>
                <p>暂无位置信息</p>
              </div>
            </div>
          </el-card>

          <!-- 地块图片 -->
          <el-card class="ifarm-card images-card">
            <template #header>
              <div class="card-title">
                <el-icon><Picture /></el-icon>
                地块图片
              </div>
            </template>

            <div class="images-content">
              <div v-if="plotData?.images && plotData.images.length > 0" class="image-gallery">
                <el-image
                  v-for="(image, index) in plotData.images"
                  :key="index"
                  :src="image"
                  :preview-src-list="plotData.images"
                  fit="cover"
                  class="gallery-image"
                />
              </div>

              <div v-else class="no-images">
                <el-icon size="48" color="#dcdfe6"><Picture /></el-icon>
                <p>暂无图片</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧统计区 -->
        <el-col :xs="24" :lg="8">
          <!-- 统计信息 -->
          <el-card class="ifarm-card stats-card">
            <template #header>
              <div class="card-title">
                <el-icon><DataAnalysis /></el-icon>
                统计信息
              </div>
            </template>

            <div class="stats-content">
              <div class="stat-item">
                <div class="stat-icon stat-icon-primary">
                  <el-icon><Crop /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ plotData?.projectCount || 0 }}</div>
                  <div class="stat-label">认养项目</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-icon-success">
                  <el-icon><Grid /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ plotData?.unitCount || 0 }}</div>
                  <div class="stat-label">认养单位</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-icon-warning">
                  <el-icon><ShoppingCart /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ plotData?.adoptedUnitCount || 0 }}</div>
                  <div class="stat-label">已认养</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-icon-info">
                  <el-icon><TrendCharts /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ plotData?.adoptionRate || 0 }}%</div>
                  <div class="stat-label">认养率</div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 快速操作 -->
          <el-card class="ifarm-card actions-card">
            <template #header>
              <div class="card-title">
                <el-icon><Operation /></el-icon>
                快速操作
              </div>
            </template>

            <div class="actions-content">
              <el-button type="primary" block @click="handleViewProjects">
                <el-icon><Crop /></el-icon>
                查看项目
              </el-button>
              <el-button type="success" block @click="handleCreateProject">
                <el-icon><Plus /></el-icon>
                新建项目
              </el-button>
              <el-button type="warning" block @click="handleViewFarm">
                <el-icon><MapLocation /></el-icon>
                查看农场
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 状态更改对话框 -->
      <el-dialog
        v-model="statusDialogVisible"
        title="更改地块状态"
        width="400px"
      >
        <el-form :model="statusForm" label-width="80px">
          <el-form-item label="地块名称">
            <span>{{ plotData?.plotName }}</span>
          </el-form-item>
          <el-form-item label="当前状态">
            <el-tag :type="getPlotStatusType(plotData?.plotStatus)">
              {{ getPlotStatusName(plotData?.plotStatus) }}
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
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const plotStore = usePlotStore()

// 响应式数据
const plotData = ref(null)
const statusDialogVisible = ref(false)

const statusForm = reactive({
  plotStatus: null
})

// 计算属性
const plotId = computed(() => parseInt(route.params.id))

// 方法
const loadPlotData = async () => {
  const data = await plotStore.fetchPlotDetail(plotId.value)
  if (data) {
    plotData.value = data
  } else {
    ElMessage.error('地块不存在或已被删除')
    router.push('/plots')
  }
}

const handleBack = () => {
  router.push('/plots')
}

const handleEdit = () => {
  router.push(`/plots/${plotId.value}/edit`)
}

const handleDropdownCommand = async (command) => {
  if (command === 'status') {
    statusForm.plotStatus = plotData.value.plotStatus
    statusDialogVisible.value = true
  } else if (command === 'toggle') {
    const newStatus = !plotData.value.enabled
    const success = await plotStore.togglePlotStatus(plotId.value, newStatus)
    if (success) {
      plotData.value.enabled = newStatus
    }
  } else if (command === 'delete') {
    try {
      await ElMessageBox.confirm(
        `确定要删除地块"${plotData.value.plotName}"吗？此操作不可恢复！`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      const success = await plotStore.deletePlot(plotId.value)
      if (success) {
        router.push('/plots')
      }
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

  const success = await plotStore.updatePlotStatus(plotId.value, statusForm.plotStatus)

  if (success) {
    plotData.value.plotStatus = statusForm.plotStatus
    plotData.value.plotStatusName = getPlotStatusName(statusForm.plotStatus)
    statusDialogVisible.value = false
  }
}

const handleViewFarm = () => {
  if (plotData.value?.farmId) {
    router.push(`/farms/${plotData.value.farmId}`)
  }
}

const handleViewProjects = () => {
  router.push(`/projects?plotId=${plotId.value}`)
}

const handleCreateProject = () => {
  router.push(`/projects/create?plotId=${plotId.value}`)
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
onMounted(() => {
  loadPlotData()
})
</script>

<style lang="scss" scoped>
.plot-detail {
  .header-card {
    margin-bottom: 20px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;

        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;

          h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .status-tags {
            display: flex;
            gap: 8px;
          }
        }
      }

      .header-right {
        display: flex;
        gap: 12px;
      }
    }
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    .el-icon {
      color: var(--ifarm-primary);
    }
  }

  .info-card {
    margin-bottom: 20px;

    .info-content {
      .info-row {
        display: flex;
        margin-bottom: 16px;
        align-items: flex-start;

        &:last-child {
          margin-bottom: 0;
        }

        .info-label {
          width: 100px;
          flex-shrink: 0;
          color: var(--el-text-color-secondary);
          font-weight: 500;
        }

        .info-value {
          flex: 1;
          color: var(--el-text-color-primary);

          &.description {
            line-height: 1.6;
          }
        }
      }
    }
  }

  .location-card {
    margin-bottom: 20px;

    .location-content {
      .coordinates-info,
      .boundaries-info {
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        p {
          margin: 4px 0;
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }

      .boundary-points {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 8px;

        .boundary-point {
          font-size: 12px;

          .point-label {
            color: var(--el-text-color-secondary);
          }

          .point-coords {
            color: var(--el-text-color-primary);
            font-family: monospace;
          }
        }
      }

      .no-location {
        text-align: center;
        padding: 40px 20px;
        color: var(--el-text-color-placeholder);

        p {
          margin: 12px 0 0 0;
          font-size: 14px;
        }
      }
    }
  }

  .images-card {
    margin-bottom: 20px;

    .images-content {
      .image-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;

        .gallery-image {
          width: 100%;
          height: 90px;
          border-radius: var(--ifarm-border-radius);
        }
      }

      .no-images {
        text-align: center;
        padding: 40px 20px;
        color: var(--el-text-color-placeholder);

        p {
          margin: 12px 0 0 0;
          font-size: 14px;
        }
      }
    }
  }

  .stats-card {
    margin-bottom: 20px;

    .stats-content {
      .stat-item {
        display: flex;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid var(--el-border-color-extra-light);

        &:last-child {
          border-bottom: none;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;

          .el-icon {
            font-size: 20px;
            color: white;
          }

          &.stat-icon-primary {
            background-color: var(--ifarm-primary);
          }

          &.stat-icon-success {
            background-color: var(--el-color-success);
          }

          &.stat-icon-warning {
            background-color: var(--el-color-warning);
          }

          &.stat-icon-info {
            background-color: var(--el-color-info);
          }
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            line-height: 1;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }

  .actions-card {
    .actions-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .plot-detail {
    .header-card {
      .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;

        .header-left {
          justify-content: center;

          .page-title {
            flex-direction: column;
            align-items: center;
            gap: 8px;

            h2 {
              font-size: 18px;
            }
          }
        }

        .header-right {
          justify-content: center;
        }
      }
    }

    .info-card {
      .info-content {
        .info-row {
          flex-direction: column;
          gap: 4px;

          .info-label {
            width: auto;
            font-size: 12px;
          }

          .info-value {
            font-size: 14px;
          }
        }
      }
    }

    .location-content {
      .boundary-points {
        grid-template-columns: 1fr;
      }
    }

    .images-content {
      .image-gallery {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));

        .gallery-image {
          height: 60px;
        }
      }
    }

    .stats-content {
      .stat-item {
        .stat-icon {
          width: 40px;
          height: 40px;

          .el-icon {
            font-size: 16px;
          }
        }

        .stat-info {
          .stat-value {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
