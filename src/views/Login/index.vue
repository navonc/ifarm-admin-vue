<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-background">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
    </div>

    <!-- 登录表单 -->
    <div class="login-form-container">
      <div class="login-form">
        <!-- Logo和标题 -->
        <div class="login-header">
          <img src="/vite.svg" alt="iFarm" class="login-logo" />
          <h1 class="login-title">iFarm智慧农场</h1>
          <p class="login-subtitle">后台管理系统</p>
        </div>

        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          size="large"
          class="login-form-content"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名或手机号"
              prefix-icon="User"
              clearable
            />
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <!-- 记住登录 -->
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="rememberLogin">
                记住登录状态
              </el-checkbox>
              <el-link type="primary" underline="never">
                忘记密码？
              </el-link>
            </div>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="authStore.isLoading"
              @click="handleLogin"
              class="login-btn"
            >
              {{ authStore.isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部信息 -->
        <div class="login-footer">
          <p class="copyright">
            © 2025 iFarm智慧农场. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { tokenStorage } from '@/utils/storage'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 响应式数据
const loginFormRef = ref()
const loginType = ref('password')
const rememberLogin = ref(tokenStorage.getRememberLogin())

const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名或手机号', trigger: 'blur' },
    { min: 3, max: 50, message: '用户名长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 方法
const handleLogin = async () => {
  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    // 执行登录
    const success = await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    if (success) {
      // 保存记住登录状态
      tokenStorage.setRememberLogin(rememberLogin.value)
      
      // 跳转到目标页面
      const redirect = route.query.redirect || '/dashboard'
      router.push(redirect)
    }
  } catch (error) {
    console.error('登录失败:', error)
  }
}

const handleWechatLogin = async () => {
  try {
    // 模拟微信登录数据
    const mockWechatData = {
      code: 'mock_wechat_code_' + Date.now(),
      nickname: '微信用户',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }

    const success = await authStore.wechatLogin(mockWechatData)

    if (success) {
      const redirect = route.query.redirect || '/dashboard'
      router.push(redirect)
    }
  } catch (error) {
    console.error('微信登录失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 如果已经登录，直接跳转
  if (authStore.isLoggedIn) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  }
})
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  .bg-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(82, 196, 26, 0.1);
    animation: float 6s ease-in-out infinite;

    &.bg-shape-1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    &.bg-shape-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    &.bg-shape-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.login-form-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .login-logo {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
  }

  .login-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--ifarm-primary);
    margin: 0 0 8px 0;
  }

  .login-subtitle {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

.login-form-content {
  .login-tabs {
    margin-bottom: 24px;

    :deep(.el-tabs__header) {
      margin: 0 0 24px 0;
    }

    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .login-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
  }
}

.wechat-login {
  text-align: center;
  padding: 40px 0;

  .wechat-qr {
    p {
      margin: 16px 0;
      color: var(--el-text-color-secondary);
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: 32px;

  .copyright {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    margin: 0;
  }
}

// 移动端适配
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-intro {
    display: none; // 移动端隐藏左侧简介
  }

  .login-form-container {
    width: 100%;
    padding: 20px;
  }

  .login-form {
    padding: 24px;
  }

  .form-header {
    margin-bottom: 24px;

    .form-title {
      font-size: 24px;
    }

    .form-subtitle {
      font-size: 13px;
    }
  }
}
</style>
