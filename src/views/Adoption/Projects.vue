<template>
  <div class="adoption-projects">
    <div class="page-container">
      <el-card class="ifarm-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">认养项目管理</span>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新建项目
            </el-button>
          </div>
        </template>

        <div class="coming-soon">
          <el-icon size="80" color="#52c41a">
            <Crop />
          </el-icon>
          <h3>认养项目管理</h3>
          <p>功能开发中，敬请期待...</p>
          <el-button type="primary" @click="$router.push('/dashboard')">
            返回首页
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const handleAdd = () => {
  ElMessage.info('新建项目功能开发中...')
}
</script>

<style lang="scss" scoped>
.adoption-projects {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .coming-soon {
    text-align: center;
    padding: 60px 20px;

    h3 {
      margin: 20px 0 10px 0;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 0 0 30px 0;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
