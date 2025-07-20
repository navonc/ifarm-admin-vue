<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-image">
        <el-icon size="120" color="#52c41a">
          <Lock />
        </el-icon>
      </div>
      
      <div class="error-info">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">权限不足</h2>
        <p class="error-description">
          抱歉，您没有权限访问该页面。<br>
          请联系管理员获取相应权限。
        </p>
        
        <div class="error-actions">
          <el-button type="primary" @click="goBack">
            返回上一页
          </el-button>
          <el-button @click="goHome">
            回到首页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
}

.error-image {
  margin-bottom: 32px;
}

.error-info {
  .error-code {
    font-size: 72px;
    font-weight: 700;
    color: var(--ifarm-primary);
    margin: 0 0 16px 0;
    line-height: 1;
  }

  .error-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 16px 0;
  }

  .error-description {
    font-size: 16px;
    color: var(--el-text-color-secondary);
    line-height: 1.6;
    margin: 0 0 32px 0;
  }

  .error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .error-content {
    padding: 20px;
  }

  .error-info {
    .error-code {
      font-size: 48px;
    }

    .error-title {
      font-size: 20px;
    }

    .error-description {
      font-size: 14px;
    }

    .error-actions {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
