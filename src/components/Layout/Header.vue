<template>
  <div class="header">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 折叠按钮 -->
      <el-button
        type="text"
        size="large"
        @click="handleToggle"
        class="toggle-btn"
        :class="{ 'is-mobile': isMobile }"
      >
        <el-icon>
          <template v-if="isMobile">
            <Operation v-if="collapsed" />
            <Close v-else />
          </template>
          <template v-else>
            <Fold v-if="!collapsed" />
            <Expand v-else />
          </template>
        </el-icon>
      </el-button>
    </div>

    <!-- 右侧区域 -->
    <div class="header-right">
      <!-- 全屏按钮 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button
          type="text"
          size="large"
          @click="toggleFullscreen"
          class="action-btn"
        >
          <el-icon>
            <FullScreen />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 用户信息 -->
      <el-dropdown @command="handleUserCommand" class="user-dropdown">
        <div class="user-info">
          <el-avatar 
            :src="authStore.userAvatar" 
            :size="32"
            class="user-avatar"
          >
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="user-name">{{ authStore.userName }}</span>
          <el-icon class="dropdown-icon">
            <ArrowDown />
          </el-icon>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

// Props
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['toggle'])

const router = useRouter()
const authStore = useAuthStore()

// 响应式状态
const isFullscreen = ref(false)

// 方法
const handleToggle = () => {
  emit('toggle')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleUserCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await authStore.logout()
        router.push('/login')
      } catch (error) {
        // 用户取消操作
      }
      break
  }
}

// 监听全屏状态变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--el-bg-color);
}

.header-left {
  display: flex;
  align-items: center;

  .toggle-btn {
    color: var(--el-text-color-primary);

    &:hover {
      color: var(--ifarm-primary);
    }

    // 移动端汉堡菜单样式
    &.is-mobile {
      padding: 8px;

      .el-icon {
        font-size: 20px;
      }
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;

  .action-btn {
    color: var(--el-text-color-primary);
    
    &:hover {
      color: var(--ifarm-primary);
    }
  }
}

.user-dropdown {
  cursor: pointer;

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: var(--ifarm-border-radius);
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--el-bg-color-page);
    }

    .user-avatar {
      border: 2px solid var(--el-border-color-extra-light);
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-icon {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      transition: transform 0.3s ease;
    }
  }

  &:hover .dropdown-icon {
    transform: rotate(180deg);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .header {
    padding: 0 15px;
  }

  .header-right {
    gap: 8px;
  }

  .user-info .user-name {
    display: none;
  }
}
</style>
