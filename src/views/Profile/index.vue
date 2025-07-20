<template>
  <div class="profile">
    <div class="page-container">
      <el-row :gutter="20">
        <!-- 用户信息卡片 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="6">
          <el-card class="ifarm-card profile-card">
            <div class="profile-header">
              <el-avatar :src="userInfo.avatar" :size="80">
                <el-icon><User /></el-icon>
              </el-avatar>
              <h3 class="profile-name">{{ userInfo.nickname }}</h3>
              <p class="profile-role">{{ userInfo.userTypeDesc }}</p>
              <el-tag 
                :type="userInfo.status === 1 ? 'success' : 'danger'"
                size="small"
              >
                {{ userInfo.statusDesc }}
              </el-tag>
            </div>
            
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-value">{{ userInfo.loginDays || 0 }}</div>
                <div class="stat-label">登录天数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userInfo.projectCount || 0 }}</div>
                <div class="stat-label">管理项目</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 编辑表单 -->
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="18">
          <el-card class="ifarm-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">个人信息</span>
              </div>
            </template>

            <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-width="100px"
              size="large"
            >
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="用户名" prop="username">
                    <el-input 
                      v-model="profileForm.username" 
                      disabled
                      placeholder="用户名"
                    />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                  <el-form-item label="昵称" prop="nickname">
                    <el-input 
                      v-model="profileForm.nickname" 
                      placeholder="请输入昵称"
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                  <el-form-item label="手机号" prop="phone">
                    <el-input 
                      v-model="profileForm.phone" 
                      placeholder="请输入手机号"
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                  <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="profileForm.gender">
                      <el-radio :label="0">未知</el-radio>
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <el-col :xs="24">
                  <el-form-item label="头像" prop="avatar">
                    <div class="avatar-upload">
                      <el-upload
                        class="avatar-uploader"
                        action="#"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        :http-request="handleAvatarUpload"
                      >
                        <img 
                          v-if="profileForm.avatar" 
                          :src="profileForm.avatar" 
                          class="avatar-preview"
                        />
                        <div v-else class="avatar-placeholder">
                          <el-icon><Plus /></el-icon>
                          <div class="upload-text">上传头像</div>
                        </div>
                      </el-upload>
                      <div class="upload-tip">
                        支持 JPG、PNG 格式，文件大小不超过 2MB
                      </div>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :xs="24">
                  <el-form-item label="注册时间">
                    <el-input 
                      :value="formatDate(userInfo.createTime)" 
                      disabled
                    />
                  </el-form-item>
                </el-col>

                <el-col :xs="24">
                  <el-form-item label="最后登录">
                    <el-input 
                      :value="formatDate(userInfo.lastLoginTime)" 
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item>
                <el-button 
                  type="primary" 
                  :loading="isLoading"
                  @click="handleSubmit"
                >
                  保存修改
                </el-button>
                <el-button @click="handleReset">
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 响应式数据
const profileFormRef = ref()
const isLoading = ref(false)

const profileForm = reactive({
  username: '',
  nickname: '',
  phone: '',
  gender: 0,
  avatar: ''
})

// 表单验证规则
const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 计算属性
const userInfo = computed(() => {
  return authStore.userInfo || {}
})

// 方法
const initForm = () => {
  const info = userInfo.value
  profileForm.username = info.username || ''
  profileForm.nickname = info.nickname || ''
  profileForm.phone = info.phone || ''
  profileForm.gender = info.gender || 0
  profileForm.avatar = info.avatar || ''
}

const formatDate = (dateString) => {
  if (!dateString) return '暂无'
  return new Date(dateString).toLocaleString('zh-CN')
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarUpload = (options) => {
  // 这里应该上传到服务器，现在模拟本地预览
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  try {
    await profileFormRef.value.validate()
    
    isLoading.value = true
    
    const updateData = {
      nickname: profileForm.nickname,
      phone: profileForm.phone,
      gender: profileForm.gender,
      avatar: profileForm.avatar
    }
    
    const success = await authStore.updateUserInfo(updateData)
    
    if (success) {
      ElMessage.success('个人信息更新成功')
    }
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    isLoading.value = false
  }
}

const handleReset = () => {
  initForm()
  ElMessage.info('已重置为原始信息')
}

// 生命周期
onMounted(() => {
  initForm()
})
</script>

<style lang="scss" scoped>
.profile {
  .profile-card {
    .profile-header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--el-border-color-extra-light);
      margin-bottom: 20px;

      .profile-name {
        margin: 16px 0 8px 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .profile-role {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }
    }

    .profile-stats {
      display: flex;
      justify-content: space-around;

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: var(--ifarm-primary);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }

  .card-header {
    .card-title {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .avatar-upload {
    .avatar-uploader {
      :deep(.el-upload) {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);

        &:hover {
          border-color: var(--ifarm-primary);
        }
      }

      .avatar-preview {
        width: 100px;
        height: 100px;
        object-fit: cover;
        display: block;
      }

      .avatar-placeholder {
        width: 100px;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--el-text-color-secondary);

        .el-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 12px;
        }
      }
    }

    .upload-tip {
      margin-top: 8px;
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .profile {
    .profile-stats {
      .stat-item {
        .stat-value {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
