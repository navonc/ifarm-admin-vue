<template>
  <div class="sidebar">
    <!-- Logo区域 -->
    <div class="sidebar-logo" :class="{ 'is-collapsed': collapsed }">
      <router-link to="/dashboard" class="logo-link">
        <img 
          src="/vite.svg" 
          alt="iFarm" 
          class="logo-image"
        />
        <span v-show="!collapsed" class="logo-text">iFarm农场</span>
      </router-link>
    </div>

    <!-- 导航菜单 -->
    <div class="sidebar-menu">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        router
        background-color="transparent"
        text-color="var(--el-text-color-primary)"
        active-text-color="var(--ifarm-primary)"
      >
        <template v-for="menu in menuList" :key="menu.name">
          <!-- 有子菜单的项 -->
          <el-sub-menu
            v-if="menu.children && menu.children.length > 0"
            :index="menu.path"
          >
            <template #title>
              <el-icon v-if="menu.icon">
                <component :is="menu.icon" />
              </el-icon>
              <span>{{ menu.title }}</span>
            </template>

            <el-menu-item
              v-for="child in menu.children"
              :key="child.name"
              :index="child.path"
              @click="handleMenuClick"
            >
              <el-icon v-if="child.icon">
                <component :is="child.icon" />
              </el-icon>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单的项 -->
          <el-menu-item
            v-else
            :index="menu.path"
            @click="handleMenuClick"
          >
            <el-icon v-if="menu.icon">
              <component :is="menu.icon" />
            </el-icon>
            <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { generateMenus } from '@/utils/permission'

// Props
const props = defineProps({
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

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 计算属性
const activeMenu = computed(() => {
  const { path } = route
  return path
})

const menuList = computed(() => {
  // 从路由配置中生成菜单
  const routes = router.getRoutes()
  const mainRoute = routes.find(r => r.path === '/')

  if (!mainRoute || !mainRoute.children) {
    return []
  }

  const menus = generateMenus(mainRoute.children, authStore.userRole, '')
  // 开发环境下输出菜单信息用于调试
  if (import.meta.env.DEV) {
    console.log('🔍 Generated menus:', menus)
  }
  return menus
})

// 方法
const handleMenuClick = () => {
  // 移动端点击菜单项后自动收起侧边栏
  if (props.isMobile && !props.collapsed) {
    emit('toggle')
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: var(--ifarm-header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  transition: all 0.3s ease;

  &.is-collapsed {
    padding: 0 12px;
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--el-text-color-primary);
    font-weight: 600;
    font-size: 18px;

    .logo-image {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    .logo-text {
      color: var(--ifarm-primary);
      white-space: nowrap;
    }
  }
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  :deep(.el-menu) {
    border-right: none;
    
    .el-menu-item,
    .el-sub-menu__title {
      height: 48px;
      line-height: 48px;
      margin: 4px 8px;
      border-radius: var(--ifarm-border-radius);
      
      &:hover {
        background-color: var(--ifarm-primary-light);
        color: var(--ifarm-primary);
      }

      &.is-active {
        background-color: var(--ifarm-primary-light);
        color: var(--ifarm-primary);
        font-weight: 600;
      }
    }

    .el-sub-menu {
      .el-menu-item {
        margin: 2px 16px;
        padding-left: 48px !important;
      }
    }

    .el-icon {
      width: 20px;
      margin-right: 8px;
    }
  }
}

// 收起状态样式
:deep(.el-menu--collapse) {
  .el-menu-item,
  .el-sub-menu__title {
    margin: 4px 12px;
    justify-content: center;

    .el-icon {
      margin-right: 0;
    }
  }
}

// 移动端优化
@media (max-width: 768px) {
  .sidebar-logo {
    &.is-collapsed {
      padding: 0 20px; // 移动端Logo区域保持可见
    }
  }

  .sidebar-menu {
    :deep(.el-menu) {
      .el-menu-item,
      .el-sub-menu__title {
        height: 52px; // 移动端增加触摸区域
        line-height: 52px;
        font-size: 16px;
      }

      .el-sub-menu {
        .el-menu-item {
          height: 48px;
          line-height: 48px;
          padding-left: 52px !important;
        }
      }
    }
  }
}

// 滚动条样式
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 2px;
}
</style>
