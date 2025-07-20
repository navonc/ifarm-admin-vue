<template>
  <div class="farm-form">
    <div class="page-container">
      <el-card class="ifarm-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ isEdit ? '编辑农场' : '新建农场' }}</span>
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
          </div>
        </template>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          size="large"
          class="farm-form-content"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="农场名称" prop="farmName">
                  <el-input
                    v-model="formData.farmName"
                    placeholder="请输入农场名称"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="总面积" prop="totalArea">
                  <el-input-number
                    v-model="formData.totalArea"
                    placeholder="请输入总面积"
                    :min="0"
                    :precision="2"
                    controls-position="right"
                    style="width: 100%"
                  />
                  <span class="input-suffix">亩</span>
                </el-form-item>
              </el-col>

              <el-col :xs="24">
                <el-form-item label="农场描述" prop="description">
                  <el-input
                    v-model="formData.description"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入农场描述"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 地址信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Location /></el-icon>
              地址信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24">
                <el-form-item label="地区选择" prop="region">
                  <RegionSelector
                    v-model="regionData"
                    :required="true"
                    @change="handleRegionChange"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24">
                <el-form-item label="详细地址" prop="address">
                  <el-input
                    v-model="formData.address"
                    placeholder="请输入详细地址"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="经度" prop="longitude">
                  <el-input-number
                    v-model="formData.longitude"
                    placeholder="请输入经度"
                    :precision="6"
                    :min="-180"
                    :max="180"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="纬度" prop="latitude">
                  <el-input-number
                    v-model="formData.latitude"
                    placeholder="请输入纬度"
                    :precision="6"
                    :min="-90"
                    :max="90"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 图片信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Picture /></el-icon>
              图片信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="封面图片" prop="coverImage">
                  <div class="image-upload">
                    <el-upload
                      class="cover-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeCoverUpload"
                      :http-request="handleCoverUpload"
                    >
                      <img 
                        v-if="formData.coverImage" 
                        :src="formData.coverImage" 
                        class="cover-image"
                      />
                      <div v-else class="upload-placeholder">
                        <el-icon><Plus /></el-icon>
                        <div class="upload-text">上传封面</div>
                      </div>
                    </el-upload>
                    <div class="upload-tip">
                      建议尺寸：800x600px，支持 JPG、PNG 格式，文件大小不超过 2MB
                    </div>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="农场图片">
                  <div class="images-upload">
                    <el-upload
                      class="images-uploader"
                      action="#"
                      :file-list="imageFileList"
                      list-type="picture-card"
                      :before-upload="beforeImageUpload"
                      :http-request="handleImageUpload"
                      :on-remove="handleImageRemove"
                      :limit="6"
                    >
                      <el-icon><Plus /></el-icon>
                    </el-upload>
                    <div class="upload-tip">
                      最多上传6张图片，支持 JPG、PNG 格式，单个文件不超过 2MB
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 联系信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Phone /></el-icon>
              联系信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input
                    v-model="formData.contactPhone"
                    placeholder="请输入联系电话"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="营业时间" prop="businessHours">
                  <el-input
                    v-model="formData.businessHours"
                    placeholder="例如：8:00-18:00"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="许可证号" prop="licenseNumber">
                  <el-input
                    v-model="formData.licenseNumber"
                    placeholder="请输入许可证号"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 认证信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Medal /></el-icon>
              认证信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24">
                <el-form-item label="认证类型">
                  <el-checkbox-group v-model="certificationTypes">
                    <el-checkbox label="organic">有机认证</el-checkbox>
                    <el-checkbox label="greenFood">绿色食品认证</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 表单操作 -->
          <div class="form-actions">
            <el-button size="large" @click="handleBack">
              取消
            </el-button>
            <el-button 
              type="primary" 
              size="large" 
              :loading="farmStore.loading"
              @click="handleSubmit"
            >
              {{ isEdit ? '更新' : '创建' }}
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useFarmStore } from '@/stores/farm'
import RegionSelector from '@/components/RegionSelector.vue'
import { createValidationRules, validateImageFile } from '@/utils/validation'
import { showError } from '@/utils/error-handler'

const route = useRoute()
const router = useRouter()
const farmStore = useFarmStore()

// 响应式数据
const formRef = ref()
const imageFileList = ref([])
const certificationTypes = ref([])

const formData = reactive({
  farmName: '',
  description: '',
  province: '',
  city: '',
  district: '',
  address: '',
  latitude: null,
  longitude: null,
  totalArea: null,
  coverImage: '',
  images: [],
  licenseNumber: '',
  contactPhone: '',
  businessHours: '',
  ownerId: null
})

const regionData = reactive({
  province: '',
  city: '',
  district: ''
})

// 删除Mock数据，使用RegionSelector组件

// 表单验证规则
const formRules = {
  farmName: [
    ...createValidationRules('required', { message: '请输入农场名称' }),
    { min: 2, max: 50, message: '农场名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  totalArea: [
    ...createValidationRules('required', { message: '请输入总面积' }),
    ...createValidationRules('area', { min: 0.01, max: 10000 })
  ],
  region: [
    {
      validator: (rule, value, callback) => {
        if (!regionData.province) {
          callback(new Error('请选择省份'))
        } else if (!regionData.city) {
          callback(new Error('请选择城市'))
        } else if (!regionData.district) {
          callback(new Error('请选择区县'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  address: [
    ...createValidationRules('required', { message: '请输入详细地址' }),
    { min: 5, max: 200, message: '详细地址长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  longitude: [
    ...createValidationRules('longitude')
  ],
  latitude: [
    ...createValidationRules('latitude')
  ],
  contactPhone: [
    ...createValidationRules('phone')
  ],
  coverImage: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请上传农场封面图片'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 计算属性
const isEdit = computed(() => !!route.params.id)
const farmId = computed(() => route.params.id ? parseInt(route.params.id) : null)

// 监听认证类型变化
watch(certificationTypes, (newVal) => {
  formData.certification = {
    organic: newVal.includes('organic'),
    greenFood: newVal.includes('greenFood')
  }
}, { deep: true })

// 方法
const handleRegionChange = (regionInfo) => {
  formData.province = regionInfo.province
  formData.city = regionInfo.city
  formData.district = regionInfo.district

  // 触发表单验证
  formRef.value?.validateField('region')
}

const beforeCoverUpload = (file) => {
  const validation = validateImageFile(file, {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg']
  })

  if (!validation.valid) {
    showError(new Error(validation.errors.join('；')))
    return false
  }

  return true
}

const handleCoverUpload = async (options) => {
  const uploadFormData = new FormData()
  uploadFormData.append('file', options.file)

  try {
    const url = await farmStore.uploadFarmImage(uploadFormData)
    if (url) {
      formData.coverImage = url
      // 触发表单验证
      formRef.value?.validateField('coverImage')
      ElMessage.success('封面图片上传成功')
    }
  } catch (error) {
    showError(error, { showType: 'message' })
  }
}

const beforeImageUpload = (file) => {
  const validation = validateImageFile(file, {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg']
  })

  if (!validation.valid) {
    showError(new Error(validation.errors.join('；')))
    return false
  }

  return true
}

const handleImageUpload = async (options) => {
  const uploadFormData = new FormData()
  uploadFormData.append('file', options.file)

  try {
    const url = await farmStore.uploadFarmImage(uploadFormData)
    if (url) {
      formData.images.push(url)
      imageFileList.value.push({
        name: options.file.name,
        url: url
      })
      ElMessage.success('图片上传成功')
    }
  } catch (error) {
    showError(error, { showType: 'message' })
  }
}

const handleImageRemove = (file) => {
  const index = imageFileList.value.findIndex(item => item.url === file.url)
  if (index !== -1) {
    imageFileList.value.splice(index, 1)
    formData.images.splice(index, 1)
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    const submitData = {
      ...formData,
      certification: {
        organic: certificationTypes.value.includes('organic'),
        greenFood: certificationTypes.value.includes('greenFood')
      }
    }

    let result
    if (isEdit.value) {
      result = await farmStore.updateFarm(farmId.value, submitData)
    } else {
      result = await farmStore.createFarm(submitData)
    }

    if (result) {
      router.push('/farms')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleBack = () => {
  router.back()
}

const loadFarmData = async () => {
  if (isEdit.value && farmId.value) {
    const farm = await farmStore.fetchFarmDetail(farmId.value)
    if (farm) {
      Object.assign(formData, {
        farmName: farm.farmName || '',
        description: farm.description || '',
        province: farm.province || '',
        city: farm.city || '',
        district: farm.district || '',
        address: farm.address || '',
        latitude: farm.latitude,
        longitude: farm.longitude,
        totalArea: farm.totalArea,
        coverImage: farm.coverImage || '',
        images: farm.images || [],
        licenseNumber: farm.licenseNumber || '',
        contactPhone: farm.contactPhone || '',
        businessHours: farm.businessHours || '',
        ownerId: farm.ownerId
      })

      // 设置认证类型
      if (farm.certification) {
        certificationTypes.value = []
        if (farm.certification.organic) {
          certificationTypes.value.push('organic')
        }
        if (farm.certification.greenFood) {
          certificationTypes.value.push('greenFood')
        }
      }

      // 设置图片列表
      if (farm.images && farm.images.length > 0) {
        imageFileList.value = farm.images.map((url, index) => ({
          name: `image-${index + 1}`,
          url: url
        }))
      }

      // 设置地区数据
      regionData.province = farm.province || ''
      regionData.city = farm.city || ''
      regionData.district = farm.district || ''
    }
  }
}

// 生命周期
onMounted(() => {
  loadFarmData()
})
</script>

<style lang="scss" scoped>
.farm-form {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .farm-form-content {
    .form-section {
      margin-bottom: 32px;
      padding: 24px;
      background-color: var(--el-bg-color-page);
      border-radius: var(--ifarm-border-radius);
      border: 1px solid var(--el-border-color-extra-light);

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: var(--ifarm-primary);
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--ifarm-primary-light);

        .el-icon {
          font-size: 18px;
        }
      }
    }

    .input-suffix {
      margin-left: 8px;
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }

    .image-upload {
      .cover-uploader {
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

        .cover-image {
          width: 200px;
          height: 150px;
          object-fit: cover;
          display: block;
        }

        .upload-placeholder {
          width: 200px;
          height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--el-text-color-secondary);

          .el-icon {
            font-size: 28px;
            margin-bottom: 8px;
          }

          .upload-text {
            font-size: 14px;
          }
        }
      }

      .upload-tip {
        margin-top: 8px;
        font-size: 12px;
        color: var(--el-text-color-placeholder);
        line-height: 1.4;
      }
    }

    .images-upload {
      .images-uploader {
        :deep(.el-upload--picture-card) {
          width: 100px;
          height: 100px;
        }

        :deep(.el-upload-list--picture-card .el-upload-list__item) {
          width: 100px;
          height: 100px;
        }
      }

      .upload-tip {
        margin-top: 8px;
        font-size: 12px;
        color: var(--el-text-color-placeholder);
        line-height: 1.4;
      }
    }

    .form-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid var(--el-border-color-extra-light);

      .el-button {
        min-width: 120px;
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .farm-form {
    .card-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;

      .card-title {
        text-align: center;
      }
    }

    .farm-form-content {
      .form-section {
        margin-bottom: 20px;
        padding: 16px;

        .section-title {
          font-size: 14px;
          margin-bottom: 16px;
        }
      }

      .image-upload {
        .cover-uploader {
          .cover-image,
          .upload-placeholder {
            width: 150px;
            height: 112px;
          }
        }
      }

      .images-upload {
        .images-uploader {
          :deep(.el-upload--picture-card) {
            width: 80px;
            height: 80px;
          }

          :deep(.el-upload-list--picture-card .el-upload-list__item) {
            width: 80px;
            height: 80px;
          }
        }
      }

      .form-actions {
        flex-direction: column;
        align-items: center;

        .el-button {
          width: 100%;
          max-width: 200px;
        }
      }
    }
  }
}
</style>
