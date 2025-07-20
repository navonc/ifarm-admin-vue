<template>
  <div class="farm-detail">
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
              <h2>{{ farmData?.farmName || '农场详情' }}</h2>
              <el-tag 
                :type="farmData?.enabled ? 'success' : 'danger'" 
                size="large"
              >
                {{ farmData?.enabled ? '启用' : '禁用' }}
              </el-tag>
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
                  <el-dropdown-item command="toggle">
                    {{ farmData?.enabled ? '禁用' : '启用' }}农场
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    删除农场
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
                <div class="info-label">农场名称：</div>
                <div class="info-value">{{ farmData?.farmName || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">农场主：</div>
                <div class="info-value">{{ farmData?.ownerName || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">总面积：</div>
                <div class="info-value">{{ farmData?.totalArea || '-' }} 亩</div>
              </div>
              <div class="info-row">
                <div class="info-label">地址：</div>
                <div class="info-value">
                  {{ farmData?.province }} {{ farmData?.city }} {{ farmData?.district }} {{ farmData?.address }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">坐标：</div>
                <div class="info-value">
                  {{ farmData?.longitude && farmData?.latitude 
                    ? `${farmData.longitude}, ${farmData.latitude}` 
                    : '-' 
                  }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">联系电话：</div>
                <div class="info-value">{{ farmData?.contactPhone || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">营业时间：</div>
                <div class="info-value">{{ farmData?.businessHours || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">许可证号：</div>
                <div class="info-value">{{ farmData?.licenseNumber || '-' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">认证信息：</div>
                <div class="info-value">
                  <el-tag 
                    v-if="farmData?.certification?.organic" 
                    type="success" 
                    size="small"
                    style="margin-right: 8px"
                  >
                    有机认证
                  </el-tag>
                  <el-tag 
                    v-if="farmData?.certification?.greenFood" 
                    type="success" 
                    size="small"
                  >
                    绿色食品认证
                  </el-tag>
                  <span v-if="!farmData?.certification?.organic && !farmData?.certification?.greenFood">
                    暂无认证
                  </span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">农场描述：</div>
                <div class="info-value description">
                  {{ farmData?.description || '暂无描述' }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">创建时间：</div>
                <div class="info-value">{{ formatDate(farmData?.createTime) }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">更新时间：</div>
                <div class="info-value">{{ formatDate(farmData?.updateTime) }}</div>
              </div>
            </div>
          </el-card>

          <!-- 农场图片 -->
          <el-card class="ifarm-card images-card">
            <template #header>
              <div class="card-title">
                <el-icon><Picture /></el-icon>
                农场图片
              </div>
            </template>

            <div class="images-content">
              <div v-if="farmData?.coverImage" class="cover-image-section">
                <h4>封面图片</h4>
                <el-image
                  :src="farmData.coverImage"
                  :preview-src-list="[farmData.coverImage]"
                  fit="cover"
                  class="cover-image"
                />
              </div>

              <div v-if="farmData?.images && farmData.images.length > 0" class="gallery-section">
                <h4>农场相册</h4>
                <div class="image-gallery">
                  <el-image
                    v-for="(image, index) in farmData.images"
                    :key="index"
                    :src="image"
                    :preview-src-list="farmData.images"
                    fit="cover"
                    class="gallery-image"
                  />
                </div>
              </div>

              <div v-if="!farmData?.coverImage && (!farmData?.images || farmData.images.length === 0)" class="no-images">
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
                  <el-icon><Grid /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ farmData?.plotCount || 0 }}</div>
                  <div class="stat-label">地块数量</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-icon-success">
                  <el-icon><Crop /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ farmData?.projectCount || 0 }}</div>
                  <div class="stat-label">认养项目</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-icon-warning">
                  <el-icon><ShoppingCart /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ farmData?.totalAdoptionCount || 0 }}</div>
                  <div class="stat-label">认养总数</div>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon stat-icon-info">
                  <el-icon><Star /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ farmData?.rating || 0 }}</div>
                  <div class="stat-label">评分</div>
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
              <el-button type="primary" block @click="handleViewPlots">
                <el-icon><Grid /></el-icon>
                查看地块
              </el-button>
              <el-button type="success" block @click="handleViewProjects">
                <el-icon><Crop /></el-icon>
                查看项目
              </el-button>
              <el-button type="warning" block @click="handleCreatePlot">
                <el-icon><Plus /></el-icon>
                新建地块
              </el-button>
              <el-button type="info" block @click="handleCreateProject">
                <el-icon><Plus /></el-icon>
                新建项目
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFarmStore } from '@/stores/farm'
import { formatDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const farmStore = useFarmStore()

// 响应式数据
const farmData = ref(null)

// 计算属性
const farmId = computed(() => parseInt(route.params.id))

// 方法
const loadFarmData = async () => {
  const data = await farmStore.fetchFarmDetail(farmId.value)
  if (data) {
    farmData.value = data
  } else {
    ElMessage.error('农场不存在或已被删除')
    router.push('/farms')
  }
}

const handleBack = () => {
  router.push('/farms')
}

const handleEdit = () => {
  router.push(`/farms/${farmId.value}/edit`)
}

const handleDropdownCommand = async (command) => {
  if (command === 'toggle') {
    const newStatus = !farmData.value.enabled
    const success = await farmStore.toggleFarmStatus(farmId.value, newStatus)
    if (success) {
      farmData.value.enabled = newStatus
    }
  } else if (command === 'delete') {
    try {
      await ElMessageBox.confirm(
        `确定要删除农场"${farmData.value.farmName}"吗？此操作不可恢复！`,
        '删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      const success = await farmStore.deleteFarm(farmId.value)
      if (success) {
        router.push('/farms')
      }
    } catch (error) {
      // 用户取消操作
    }
  }
}

const handleViewPlots = () => {
  router.push(`/plots?farmId=${farmId.value}`)
}

const handleViewProjects = () => {
  router.push(`/projects?farmId=${farmId.value}`)
}

const handleCreatePlot = () => {
  router.push(`/plots/create?farmId=${farmId.value}`)
}

const handleCreateProject = () => {
  router.push(`/projects/create?farmId=${farmId.value}`)
}

// 生命周期
onMounted(() => {
  loadFarmData()
})
</script>

<style lang="scss" scoped>
.farm-detail {
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

  .images-card {
    margin-bottom: 20px;

    .images-content {
      .cover-image-section,
      .gallery-section {
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
      }

      .cover-image {
        width: 200px;
        height: 150px;
        border-radius: var(--ifarm-border-radius);
      }

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
  .farm-detail {
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

    .images-content {
      .cover-image {
        width: 100%;
        height: auto;
        max-width: 300px;
      }

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
