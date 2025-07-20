<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
        :to="index === breadcrumbs.length - 1 ? undefined : item.path"
      >
        <el-icon v-if="item.icon && index === 0">
          <component :is="item.icon" />
        </el-icon>
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbs } from '@/utils/permission'

const route = useRoute()

// 计算属性
const breadcrumbs = computed(() => {
  return getBreadcrumbs(route)
})
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  display: flex;
  align-items: center;

  :deep(.el-breadcrumb) {
    font-size: 14px;

    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--el-text-color-secondary);
        font-weight: 400;

        &:hover {
          color: var(--ifarm-primary);
        }

        &.is-link {
          cursor: pointer;
        }
      }

      &:last-child .el-breadcrumb__inner {
        color: var(--el-text-color-primary);
        font-weight: 500;
        cursor: default;

        &:hover {
          color: var(--el-text-color-primary);
        }
      }

      .el-breadcrumb__separator {
        color: var(--el-text-color-placeholder);
        margin: 0 8px;
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .breadcrumb-container {
    :deep(.el-breadcrumb) {
      font-size: 12px;

      .el-breadcrumb__item .el-breadcrumb__separator {
        margin: 0 4px;
      }
    }
  }
}
</style>
