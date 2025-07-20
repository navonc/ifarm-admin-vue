<template>
  <div class="dashboard">
    <div class="page-container">
      <!-- 欢迎信息 -->
      <div class="welcome-section">
        <el-card class="ifarm-card welcome-card">
          <div class="welcome-content">
            <div class="welcome-info">
              <h2 class="welcome-title">
                欢迎回来，{{ authStore.userName }}！
              </h2>
              <p class="welcome-subtitle">
                今天是 {{ currentDate }}，祝您工作愉快！
              </p>
            </div>
            <div class="welcome-avatar">
              <el-avatar :src="authStore.userAvatar" :size="64">
                <el-icon><User /></el-icon>
              </el-avatar>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 数据统计卡片 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
            <el-card class="ifarm-card stats-card">
              <div class="stats-content">
                <div class="stats-icon stats-icon-primary">
                  <el-icon size="24"><Crop /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-value">{{ mockData.totalProjects }}</div>
                  <div class="stats-label">认养项目</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
            <el-card class="ifarm-card stats-card">
              <div class="stats-content">
                <div class="stats-icon stats-icon-success">
                  <el-icon size="24"><User /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-value">{{ mockData.totalUsers }}</div>
                  <div class="stats-label">注册用户</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
            <el-card class="ifarm-card stats-card">
              <div class="stats-content">
                <div class="stats-icon stats-icon-warning">
                  <el-icon size="24"><ShoppingCart /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-value">{{ mockData.totalOrders }}</div>
                  <div class="stats-label">认养订单</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6">
            <el-card class="ifarm-card stats-card">
              <div class="stats-content">
                <div class="stats-icon stats-icon-info">
                  <el-icon size="24"><Money /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-value">¥{{ mockData.totalRevenue }}</div>
                  <div class="stats-label">总收入</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 图表和列表区域 -->
      <div class="content-section">
        <el-row :gutter="20">
          <!-- 最近认养项目 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-card class="ifarm-card">
              <template #header>
                <div class="card-header">
                  <span class="card-title">最近认养项目</span>
                  <el-button type="text" size="small">查看更多</el-button>
                </div>
              </template>
              
              <div class="project-list">
                <div 
                  v-for="project in mockData.recentProjects" 
                  :key="project.id"
                  class="project-item"
                >
                  <div class="project-info">
                    <div class="project-name">{{ project.name }}</div>
                    <div class="project-meta">
                      <span class="project-crop">{{ project.crop }}</span>
                      <span class="project-status" :class="`status-${project.status}`">
                        {{ getStatusText(project.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="project-progress">
                    <el-progress 
                      :percentage="project.progress" 
                      :stroke-width="6"
                      :show-text="false"
                    />
                    <span class="progress-text">{{ project.progress }}%</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 快速操作 -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-card class="ifarm-card">
              <template #header>
                <div class="card-header">
                  <span class="card-title">快速操作</span>
                </div>
              </template>
              
              <div class="quick-actions">
                <div class="action-grid">
                  <div 
                    v-for="action in quickActions" 
                    :key="action.name"
                    class="action-item"
                    @click="handleQuickAction(action.path)"
                  >
                    <div class="action-icon" :class="`action-icon-${action.color}`">
                      <el-icon size="20">
                        <component :is="action.icon" />
                      </el-icon>
                    </div>
                    <div class="action-label">{{ action.label }}</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const mockData = ref({
  totalProjects: 156,
  totalUsers: 2340,
  totalOrders: 1890,
  totalRevenue: '234,567',
  recentProjects: [
    {
      id: 1,
      name: '有机番茄认养',
      crop: '番茄',
      status: 'active',
      progress: 75
    },
    {
      id: 2,
      name: '绿色蔬菜基地',
      crop: '白菜',
      status: 'planning',
      progress: 30
    },
    {
      id: 3,
      name: '生态水稻田',
      crop: '水稻',
      status: 'harvest',
      progress: 95
    },
    {
      id: 4,
      name: '有机玉米地',
      crop: '玉米',
      status: 'active',
      progress: 60
    }
  ]
})

const quickActions = ref([
  {
    name: 'new-project',
    label: '新建项目',
    icon: 'Plus',
    color: 'primary',
    path: '/adoption/projects'
  },
  {
    name: 'user-management',
    label: '用户管理',
    icon: 'User',
    color: 'success',
    path: '/users'
  },
  {
    name: 'order-management',
    label: '订单管理',
    icon: 'ShoppingCart',
    color: 'warning',
    path: '/adoption/orders'
  },
  {
    name: 'system-settings',
    label: '系统设置',
    icon: 'Setting',
    color: 'info',
    path: '/system/config'
  }
])

// 计算属性
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 方法
const getStatusText = (status) => {
  const statusMap = {
    planning: '筹备中',
    active: '进行中',
    harvest: '收获中',
    completed: '已完成'
  }
  return statusMap[status] || '未知'
}

const handleQuickAction = (path) => {
  router.push(path)
}

// 生命周期
onMounted(() => {
  // 这里可以加载真实的数据
  console.log('Dashboard mounted')
})
</script>

<style lang="scss" scoped>
.dashboard {
  .welcome-section {
    margin-bottom: 20px;

    .welcome-card {
      background: linear-gradient(135deg, var(--ifarm-primary-light) 0%, #ffffff 100%);
      border: none;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .welcome-info {
        .welcome-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin: 0 0 8px 0;
        }

        .welcome-subtitle {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          margin: 0;
        }
      }

      .welcome-avatar {
        :deep(.el-avatar) {
          border: 3px solid var(--ifarm-primary);
        }
      }
    }
  }

  .stats-section {
    margin-bottom: 20px;

    .stats-card {
      .stats-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stats-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          &.stats-icon-primary {
            background-color: var(--ifarm-primary);
          }

          &.stats-icon-success {
            background-color: var(--ifarm-success);
          }

          &.stats-icon-warning {
            background-color: var(--ifarm-warning);
          }

          &.stats-icon-info {
            background-color: var(--ifarm-info);
          }
        }

        .stats-info {
          .stats-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            line-height: 1;
            margin-bottom: 4px;
          }

          .stats-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }

  .content-section {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }

    .project-list {
      .project-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid var(--el-border-color-extra-light);

        &:last-child {
          border-bottom: none;
        }

        .project-info {
          .project-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            margin-bottom: 4px;
          }

          .project-meta {
            display: flex;
            gap: 8px;
            align-items: center;

            .project-crop {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }

            .project-status {
              font-size: 12px;
              padding: 2px 6px;
              border-radius: 4px;

              &.status-planning {
                background-color: var(--el-color-info-light-8);
                color: var(--el-color-info);
              }

              &.status-active {
                background-color: var(--ifarm-primary-light);
                color: var(--ifarm-primary);
              }

              &.status-harvest {
                background-color: var(--el-color-warning-light-8);
                color: var(--el-color-warning);
              }
            }
          }
        }

        .project-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;

          :deep(.el-progress) {
            flex: 1;
          }

          .progress-text {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            min-width: 30px;
          }
        }
      }
    }

    .quick-actions {
      .action-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-radius: var(--ifarm-border-radius);
          border: 1px solid var(--el-border-color-extra-light);
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            border-color: var(--ifarm-primary);
            transform: translateY(-2px);
            box-shadow: var(--ifarm-box-shadow);
          }

          .action-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            color: white;

            &.action-icon-primary {
              background-color: var(--ifarm-primary);
            }

            &.action-icon-success {
              background-color: var(--ifarm-success);
            }

            &.action-icon-warning {
              background-color: var(--ifarm-warning);
            }

            &.action-icon-info {
              background-color: var(--ifarm-info);
            }
          }

          .action-label {
            font-size: 14px;
            color: var(--el-text-color-primary);
            text-align: center;
          }
        }
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .dashboard {
    .welcome-content {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }

    .stats-section {
      .stats-content {
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }
    }

    .project-item {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 8px;

      .project-progress {
        width: 100%;
        min-width: auto;
      }
    }

    .action-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px;

      .action-item {
        padding: 16px;
      }
    }
  }
}
</style>
