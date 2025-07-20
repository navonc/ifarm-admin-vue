<template>
  <div class="farm-list">
    <div class="page-container">
      <el-card class="ifarm-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">农场列表</span>
          </div>
        </template>

        <div class="coming-soon">
          <el-icon size="80" color="#52c41a">
            <MapLocation />
          </el-icon>
          <h3>农场管理</h3>
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
// 组件逻辑
</script>

<style lang="scss" scoped>
.farm-list {
  .card-header {
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
