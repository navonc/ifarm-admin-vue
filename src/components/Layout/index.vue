<template>
  <div class="layout-container">
    <!-- 移动端遮罩层 -->
    <transition name="mask-fade">
      <div
        v-if="isMobile && !isCollapsed"
        class="layout-mask"
        @click="handleToggleSidebar"
      ></div>
    </transition>

    <!-- 侧边栏 -->
    <div
      class="layout-sidebar"
      :class="{
        'is-collapsed': isCollapsed,
        'is-mobile': isMobile
      }"
    >
      <Sidebar
        :collapsed="isCollapsed"
        :is-mobile="isMobile"
        @toggle="handleToggleSidebar"
      />
    </div>

    <!-- 主内容区域 -->
    <div class="layout-main" :class="{ 'is-mobile': isMobile }">
      <!-- 顶部导航 -->
      <div class="layout-header">
        <Header
          :collapsed="isCollapsed"
          :is-mobile="isMobile"
          @toggle="handleToggleSidebar"
        />
      </div>

      <!-- 内容区域 -->
      <div class="layout-content">
        <!-- 面包屑导航 -->
        <div class="layout-breadcrumb">
          <Breadcrumb />
        </div>

        <!-- 页面内容 -->
        <div class="layout-page">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
              <keep-alive :include="cachedViews">
                <component :is="Component" :key="route.path" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Breadcrumb from './Breadcrumb.vue'

// 响应式状态
const isCollapsed = ref(false)
const cachedViews = ref([])
const isMobile = ref(false)
let resizeTimer = null

const route = useRoute()

// 方法
const handleToggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleResize = () => {
  // 防抖处理
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }

  resizeTimer = setTimeout(() => {
    const mobile = window.innerWidth < 768
    const wasMobile = isMobile.value

    // 如果状态发生变化
    if (mobile !== wasMobile) {
      console.log(`📱 Layout mode changed: ${wasMobile ? 'Mobile' : 'Desktop'} -> ${mobile ? 'Mobile' : 'Desktop'}`)

      // 更新移动端状态
      isMobile.value = mobile

      // 如果从桌面端切换到移动端，自动收起侧边栏
      if (mobile && !wasMobile) {
        console.log('🔄 Switching to mobile: collapsing sidebar')
        isCollapsed.value = true
      }
      // 如果从移动端切换到桌面端，自动展开侧边栏
      else if (!mobile && wasMobile) {
        console.log('🔄 Switching to desktop: expanding sidebar')
        isCollapsed.value = false
      }
    }
  }, 100) // 100ms防抖
}

// 生命周期
onMounted(() => {
  // 初始化移动端状态
  isMobile.value = window.innerWidth < 768

  // 移动端默认收起侧边栏，桌面端默认展开
  isCollapsed.value = isMobile.value

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
})
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background-color: var(--el-bg-color-page);
  position: relative;
}

// 移动端遮罩层
.layout-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.layout-sidebar {
  width: var(--ifarm-sidebar-width);
  transition: all 0.3s ease;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-extra-light);
  z-index: 1001;
  position: relative;

  &.is-collapsed {
    width: var(--ifarm-sidebar-collapsed-width);
  }

  // 移动端样式
  &.is-mobile {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: var(--ifarm-sidebar-width);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transform: translateX(0);
    transition: transform 0.3s ease;

    &.is-collapsed {
      transform: translateX(-100%);
      width: var(--ifarm-sidebar-width); // 移动端保持固定宽度
    }
  }
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.3s ease;

  // 移动端样式
  &.is-mobile {
    width: 100%;
    margin-left: 0;
  }
}

.layout-header {
  height: var(--ifarm-header-height);
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  z-index: 1000;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-breadcrumb {
  padding: 12px 20px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.layout-page {
  flex: 1;
  overflow: auto;
  background-color: var(--el-bg-color-page);
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 遮罩层动画
.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mask-fade-enter-from,
.mask-fade-leave-to {
  opacity: 0;
}

// 移动端适配
@media (max-width: 768px) {
  .layout-breadcrumb {
    padding: 8px 15px;
  }

  .layout-page {
    padding: 10px;
  }
}
</style>
