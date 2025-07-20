<template>
  <div class="project-detail">
    <div class="page-container">
      <!-- 项目基本信息 -->
      <el-card class="ifarm-card project-header">
        <div class="project-info">
          <div class="project-cover">
            <el-image
              v-if="projectData?.coverImage"
              :src="projectData.coverImage"
              :preview-src-list="[projectData.coverImage]"
              fit="cover"
              class="cover-image"
            />
            <div v-else class="cover-placeholder">
              <el-icon><Crop /></el-icon>
            </div>
          </div>
          
          <div class="project-details">
            <div class="project-title">
              <h1>{{ projectData?.projectName || '项目名称' }}</h1>
              <el-tag 
                :type="projectStore.getProjectStatusType(projectData?.projectStatus)" 
                size="large"
              >
                {{ projectStore.getProjectStatusName(projectData?.projectStatus) }}
              </el-tag>
            </div>
            
            <div class="project-meta">
              <div class="meta-item">
                <span class="meta-label">所属农场：</span>
                <el-link 
                  v-if="projectData?.farmId" 
                  type="primary" 
                  @click="handleViewFarm"
                >
                  {{ projectData?.farmName || '未设置' }}
                </el-link>
                <span v-else>未设置</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">所属地块：</span>
                <el-link 
                  v-if="projectData?.plotId" 
                  type="primary" 
                  @click="handleViewPlot"
                >
                  {{ projectData?.plotName || '未设置' }}
                </el-link>
                <span v-else>未设置</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">作物类型：</span>
                <span>{{ projectData?.cropName || '未设置' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">创建时间：</span>
                <span>{{ formatDate(projectData?.createTime) }}</span>
              </div>
            </div>
            
            <div class="project-description">
              {{ projectData?.description || '暂无项目描述' }}
            </div>
          </div>
        </div>
        
        <div class="project-actions">
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑项目
          </el-button>
          <el-button 
            v-if="projectData?.projectStatus === 1" 
            type="success" 
            @click="handlePublish"
          >
            <el-icon><Upload /></el-icon>
            发布项目
          </el-button>
          <el-dropdown @command="handleDropdownCommand">
            <el-button>
              更多操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="status">更改状态</el-dropdown-item>
                <el-dropdown-item command="orders">查看订单</el-dropdown-item>
                <el-dropdown-item command="stats">查看统计</el-dropdown-item>
                <el-dropdown-item command="cancel" divided>取消项目</el-dropdown-item>
                <el-dropdown-item command="delete">删除项目</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-card>

      <el-row :gutter="20">
        <!-- 左侧内容 -->
        <el-col :xs="24" :lg="16">
          <!-- 认养信息 -->
          <el-card class="ifarm-card adoption-card">
            <template #header>
              <div class="card-title">
                <el-icon><Money /></el-icon>
                认养信息
              </div>
            </template>
            
            <div class="adoption-content">
              <div class="adoption-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ projectData?.unitCount || 0 }}</div>
                  <div class="stat-label">总{{ projectData?.unitName || '单位' }}数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectData?.adoptedUnitCount || 0 }}</div>
                  <div class="stat-label">已认养</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ projectData?.remainingUnitCount || 0 }}</div>
                  <div class="stat-label">剩余</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">¥{{ projectData?.unitPrice || 0 }}</div>
                  <div class="stat-label">单价</div>
                </div>
              </div>
              
              <div class="adoption-progress">
                <div class="progress-header">
                  <span>认养进度</span>
                  <span>{{ projectData?.adoptionRate || 0 }}%</span>
                </div>
                <el-progress 
                  :percentage="projectData?.adoptionRate || 0" 
                  :stroke-width="12"
                  :show-text="false"
                />
              </div>
              
              <div class="adoption-details">
                <div class="detail-item">
                  <span class="detail-label">认养期限：</span>
                  <span>{{ projectData?.adoptionPeriod || 0 }} 天</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">预期产量：</span>
                  <span>{{ projectData?.expectedYield || 0 }} {{ projectData?.yieldUnit || 'kg' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">总收入：</span>
                  <span class="income-amount">¥{{ calculateTotalIncome() }}</span>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 种植计划 -->
          <el-card class="ifarm-card planting-card">
            <template #header>
              <div class="card-title">
                <el-icon><Calendar /></el-icon>
                种植计划
              </div>
            </template>
            
            <div class="planting-content">
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">计划种植</div>
                    <div class="timeline-date">{{ formatDate(projectData?.plannedPlantingDate, 'YYYY-MM-DD') }}</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">计划收获</div>
                    <div class="timeline-date">{{ formatDate(projectData?.plannedHarvestDate, 'YYYY-MM-DD') }}</div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">实际种植</div>
                    <div class="timeline-date">
                      {{ projectData?.actualPlantingDate ? formatDate(projectData.actualPlantingDate, 'YYYY-MM-DD') : '未开始' }}
                    </div>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">实际收获</div>
                    <div class="timeline-date">
                      {{ projectData?.actualHarvestDate ? formatDate(projectData.actualHarvestDate, 'YYYY-MM-DD') : '未开始' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="projectData?.plantingNotes" class="planting-notes">
                <div class="notes-title">种植说明</div>
                <div class="notes-content">{{ projectData.plantingNotes }}</div>
              </div>
            </div>
          </el-card>

          <!-- 项目图片 -->
          <el-card v-if="projectData?.images?.length" class="ifarm-card images-card">
            <template #header>
              <div class="card-title">
                <el-icon><Picture /></el-icon>
                项目图片
              </div>
            </template>
            
            <div class="images-content">
              <div class="image-grid">
                <div 
                  v-for="(image, index) in projectData.images" 
                  :key="index"
                  class="image-item"
                >
                  <el-image
                    :src="image"
                    :preview-src-list="projectData.images"
                    :initial-index="index"
                    fit="cover"
                    class="project-image"
                  />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧侧边栏 -->
        <el-col :xs="24" :lg="8">
          <!-- 快速统计 -->
          <el-card class="ifarm-card stats-card">
            <template #header>
              <div class="card-title">
                <el-icon><DataAnalysis /></el-icon>
                项目统计
              </div>
            </template>
            
            <div class="stats-content">
              <div class="stat-row">
                <div class="stat-item">
                  <div class="stat-number">{{ statsData?.orderCount || 0 }}</div>
                  <div class="stat-text">订单数量</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ statsData?.userCount || 0 }}</div>
                  <div class="stat-text">认养用户</div>
                </div>
              </div>
              <div class="stat-row">
                <div class="stat-item">
                  <div class="stat-number">{{ statsData?.viewCount || 0 }}</div>
                  <div class="stat-text">浏览次数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ statsData?.favoriteCount || 0 }}</div>
                  <div class="stat-text">收藏次数</div>
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
              <el-button type="primary" block @click="handleViewOrders">
                <el-icon><List /></el-icon>
                查看订单
              </el-button>
              <el-button type="success" block @click="handleViewFarm">
                <el-icon><MapLocation /></el-icon>
                查看农场
              </el-button>
              <el-button type="warning" block @click="handleViewPlot">
                <el-icon><Grid /></el-icon>
                查看地块
              </el-button>
              <el-button type="info" block @click="handleViewStats">
                <el-icon><TrendCharts /></el-icon>
                详细统计
              </el-button>
            </div>
          </el-card>

          <!-- 状态管理 -->
          <el-card class="ifarm-card status-card">
            <template #header>
              <div class="card-title">
                <el-icon><Switch /></el-icon>
                状态管理
              </div>
            </template>
            
            <div class="status-content">
              <div class="current-status">
                <span class="status-label">当前状态：</span>
                <el-tag 
                  :type="projectStore.getProjectStatusType(projectData?.projectStatus)" 
                  size="large"
                >
                  {{ projectStore.getProjectStatusName(projectData?.projectStatus) }}
                </el-tag>
              </div>
              
              <div class="status-actions">
                <el-button 
                  v-if="projectData?.projectStatus === 1" 
                  type="success" 
                  size="small" 
                  block 
                  @click="handlePublish"
                >
                  发布项目
                </el-button>
                <el-button 
                  v-if="projectData?.projectStatus === 3" 
                  type="primary" 
                  size="small" 
                  block 
                  @click="handleStartPlanting"
                >
                  开始种植
                </el-button>
                <el-button 
                  v-if="projectData?.projectStatus === 4" 
                  type="warning" 
                  size="small" 
                  block 
                  @click="handleStartHarvesting"
                >
                  开始收获
                </el-button>
                <el-button 
                  v-if="projectData?.projectStatus === 5" 
                  type="success" 
                  size="small" 
                  block 
                  @click="handleCompleteProject"
                >
                  完成项目
                </el-button>
                <el-button 
                  v-if="![6, 7].includes(projectData?.projectStatus)" 
                  type="danger" 
                  size="small" 
                  block 
                  @click="handleCancelProject"
                >
                  取消项目
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 状态更改对话框 -->
      <el-dialog
        v-model="statusDialogVisible"
        title="更改项目状态"
        width="400px"
      >
        <el-form :model="statusForm" label-width="80px">
          <el-form-item label="当前状态">
            <el-tag :type="projectStore.getProjectStatusType(projectData?.projectStatus)">
              {{ projectStore.getProjectStatusName(projectData?.projectStatus) }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { formatDate } from '@/utils/date'

// 路由
const route = useRoute()
const router = useRouter()

// Store
const projectStore = useProjectStore()

// 响应式数据
const projectData = ref(null)
const statsData = ref(null)
const loading = ref(false)

// 状态更改对话框
const statusDialogVisible = ref(false)
const statusForm = reactive({
  projectStatus: null
})

// 计算属性
const projectId = computed(() => route.params.id ? parseInt(route.params.id) : null)

// 方法
const loadProjectData = async () => {
  if (!projectId.value) return

  try {
    loading.value = true
    const project = await projectStore.fetchProjectDetail(projectId.value)
    if (project) {
      projectData.value = project
    } else {
      ElMessage.error('项目不存在或已被删除')
      router.push('/projects')
    }
  } catch (error) {
    console.error('加载项目数据失败:', error)
    ElMessage.error('加载项目数据失败')
    router.push('/projects')
  } finally {
    loading.value = false
  }
}

const loadStatsData = async () => {
  if (!projectId.value) return

  try {
    const stats = await projectStore.fetchProjectStats(projectId.value)
    if (stats) {
      statsData.value = stats
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const calculateTotalIncome = () => {
  if (!projectData.value) return 0
  const adoptedCount = projectData.value.adoptedUnitCount || 0
  const unitPrice = projectData.value.unitPrice || 0
  return (adoptedCount * unitPrice).toFixed(2)
}

const handleEdit = () => {
  router.push(`/projects/${projectId.value}/edit`)
}

const handleViewFarm = () => {
  if (projectData.value?.farmId) {
    router.push(`/farms/${projectData.value.farmId}`)
  }
}

const handleViewPlot = () => {
  if (projectData.value?.plotId) {
    router.push(`/plots/${projectData.value.plotId}`)
  }
}

const handleViewOrders = () => {
  router.push(`/orders?projectId=${projectId.value}`)
}

const handleViewStats = () => {
  // 这里可以跳转到详细统计页面或打开统计对话框
  ElMessage.info('详细统计功能开发中')
}

const handlePublish = async () => {
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

    const success = await projectStore.publishProject(projectId.value)
    if (success) {
      await loadProjectData() // 重新加载数据
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布项目失败:', error)
    }
  }
}

const handleStartPlanting = async () => {
  try {
    const { value: notes } = await ElMessageBox.prompt(
      '请输入种植备注：',
      '开始种植',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '种植情况说明（可选）'
      }
    )

    const success = await projectStore.startPlanting(projectId.value, {
      actualPlantingDate: new Date().toISOString().split('T')[0],
      plantingNotes: notes || ''
    })

    if (success) {
      await loadProjectData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('开始种植失败:', error)
    }
  }
}

const handleStartHarvesting = async () => {
  try {
    const { value: notes } = await ElMessageBox.prompt(
      '请输入收获备注：',
      '开始收获',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '收获情况说明（可选）'
      }
    )

    const success = await projectStore.startHarvesting(projectId.value, {
      actualHarvestDate: new Date().toISOString().split('T')[0],
      harvestNotes: notes || ''
    })

    if (success) {
      await loadProjectData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('开始收获失败:', error)
    }
  }
}

const handleCompleteProject = async () => {
  try {
    const { value: notes } = await ElMessageBox.prompt(
      '请输入完成备注：',
      '完成项目',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '项目完成情况说明（可选）'
      }
    )

    const success = await projectStore.completeProject(projectId.value, {
      completedDate: new Date().toISOString().split('T')[0],
      completionNotes: notes || ''
    })

    if (success) {
      await loadProjectData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('完成项目失败:', error)
    }
  }
}

const handleCancelProject = async () => {
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

    const success = await projectStore.cancelProject(projectId.value, { reason })
    if (success) {
      await loadProjectData()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消项目失败:', error)
    }
  }
}

const handleDropdownCommand = (command) => {
  switch (command) {
    case 'status':
      handleChangeStatus()
      break
    case 'orders':
      handleViewOrders()
      break
    case 'stats':
      handleViewStats()
      break
    case 'cancel':
      handleCancelProject()
      break
    case 'delete':
      handleDeleteProject()
      break
  }
}

const handleChangeStatus = () => {
  statusForm.projectStatus = projectData.value?.projectStatus
  statusDialogVisible.value = true
}

const handleStatusConfirm = async () => {
  if (!statusForm.projectStatus) {
    ElMessage.warning('请选择新状态')
    return
  }

  if (statusForm.projectStatus === projectData.value?.projectStatus) {
    ElMessage.warning('新状态与当前状态相同')
    return
  }

  try {
    const success = await projectStore.updateProjectStatus(
      projectId.value,
      statusForm.projectStatus
    )

    if (success) {
      statusDialogVisible.value = false
      await loadProjectData()
    }
  } catch (error) {
    console.error('更改状态失败:', error)
  }
}

const handleDeleteProject = async () => {
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

    const success = await projectStore.deleteProject(projectId.value)
    if (success) {
      ElMessage.success('项目删除成功')
      router.push('/projects')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除项目失败:', error)
    }
  }
}

// 生命周期
onMounted(async () => {
  await Promise.all([
    loadProjectData(),
    loadStatsData()
  ])
})
</script>

<style lang="scss" scoped>
.project-detail {
  .project-header {
    margin-bottom: 20px;

    .project-info {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;

      .project-cover {
        flex-shrink: 0;

        .cover-image {
          width: 200px;
          height: 150px;
          border-radius: 12px;
        }

        .cover-placeholder {
          width: 200px;
          height: 150px;
          border-radius: 12px;
          background: var(--el-fill-color-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-text-color-placeholder);
          font-size: 48px;
        }
      }

      .project-details {
        flex: 1;
        min-width: 0;

        .project-title {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;

          h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .project-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;

          .meta-item {
            font-size: 14px;

            .meta-label {
              color: var(--el-text-color-regular);
              margin-right: 8px;
            }
          }
        }

        .project-description {
          color: var(--el-text-color-regular);
          line-height: 1.6;
          font-size: 14px;
        }
      }
    }

    .project-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--el-text-color-primary);

    .el-icon {
      color: var(--el-color-primary);
    }
  }

  .adoption-card {
    margin-bottom: 20px;

    .adoption-content {
      .adoption-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 24px;

        .stat-item {
          text-align: center;

          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--el-color-primary);
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: var(--el-text-color-regular);
          }
        }
      }

      .adoption-progress {
        margin-bottom: 24px;

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
        }
      }

      .adoption-details {
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--el-border-color-lighter);

          &:last-child {
            border-bottom: none;
          }

          .detail-label {
            color: var(--el-text-color-regular);
          }

          .income-amount {
            font-weight: 600;
            color: var(--el-color-success);
            font-size: 16px;
          }
        }
      }
    }
  }

  .planting-card {
    margin-bottom: 20px;

    .planting-content {
      .timeline {
        margin-bottom: 20px;

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .timeline-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--el-color-primary);
            flex-shrink: 0;
          }

          .timeline-content {
            flex: 1;

            .timeline-title {
              font-weight: 500;
              color: var(--el-text-color-primary);
              margin-bottom: 4px;
            }

            .timeline-date {
              font-size: 14px;
              color: var(--el-text-color-regular);
            }
          }
        }
      }

      .planting-notes {
        padding: 16px;
        background: var(--el-fill-color-light);
        border-radius: 8px;

        .notes-title {
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 8px;
        }

        .notes-content {
          color: var(--el-text-color-regular);
          line-height: 1.6;
        }
      }
    }
  }

  .images-card {
    margin-bottom: 20px;

    .images-content {
      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;

        .image-item {
          .project-image {
            width: 100%;
            height: 120px;
            border-radius: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .stats-card {
    margin-bottom: 20px;

    .stats-content {
      .stat-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .stat-item {
          text-align: center;
          padding: 16px;
          background: var(--el-fill-color-light);
          border-radius: 8px;

          .stat-number {
            font-size: 20px;
            font-weight: 600;
            color: var(--el-color-primary);
            margin-bottom: 4px;
          }

          .stat-text {
            font-size: 12px;
            color: var(--el-text-color-regular);
          }
        }
      }
    }
  }

  .actions-card {
    margin-bottom: 20px;

    .actions-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }

  .status-card {
    .status-content {
      .current-status {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .status-label {
          color: var(--el-text-color-regular);
        }
      }

      .status-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .project-detail {
    .project-header {
      .project-info {
        flex-direction: column;

        .project-cover {
          align-self: center;

          .cover-image,
          .cover-placeholder {
            width: 150px;
            height: 112px;
          }
        }

        .project-details {
          .project-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            h1 {
              font-size: 20px;
            }
          }

          .project-meta {
            grid-template-columns: 1fr;
          }
        }
      }

      .project-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    .adoption-card {
      .adoption-content {
        .adoption-stats {
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;

          .stat-item {
            .stat-value {
              font-size: 20px;
            }
          }
        }
      }
    }

    .images-card {
      .images-content {
        .image-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

          .image-item {
            .project-image {
              height: 100px;
            }
          }
        }
      }
    }
  }
}
</style>
