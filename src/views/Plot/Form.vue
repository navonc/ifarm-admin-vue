<template>
  <div class="plot-form">
    <div class="page-container">
      <el-card class="ifarm-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ isEdit ? '编辑地块' : '新建地块' }}</span>
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
          class="plot-form-content"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="地块名称" prop="plotName">
                  <el-input
                    v-model="formData.plotName"
                    placeholder="请输入地块名称"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="所属农场" prop="farmId">
                  <el-select
                    v-model="formData.farmId"
                    placeholder="请选择农场"
                    clearable
                    filterable
                    style="width: 100%"
                    :disabled="!!presetFarmId"
                  >
                    <el-option
                      v-for="farm in farmOptions"
                      :key="farm.id"
                      :label="farm.farmName"
                      :value="farm.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="地块面积" prop="area">
                  <el-input-number
                    v-model="formData.area"
                    placeholder="请输入地块面积"
                    :min="0"
                    :precision="2"
                    controls-position="right"
                    style="width: 100%"
                  />
                  <span class="input-suffix">亩</span>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="地块状态" prop="plotStatus">
                  <el-select
                    v-model="formData.plotStatus"
                    placeholder="请选择地块状态"
                    style="width: 100%"
                  >
                    <el-option label="空闲" :value="1" />
                    <el-option label="种植中" :value="2" />
                    <el-option label="收获中" :value="3" />
                    <el-option label="休耕" :value="4" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24">
                <el-form-item label="地块描述" prop="description">
                  <el-input
                    v-model="formData.description"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入地块描述"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 土壤与灌溉 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Crop /></el-icon>
              土壤与灌溉
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="土壤类型" prop="soilType">
                  <el-select
                    v-model="formData.soilType"
                    placeholder="请选择土壤类型"
                    clearable
                    style="width: 100%"
                  >
                    <el-option label="沙土" value="沙土" />
                    <el-option label="壤土" value="壤土" />
                    <el-option label="黏土" value="黏土" />
                    <el-option label="沙壤土" value="沙壤土" />
                    <el-option label="黏壤土" value="黏壤土" />
                    <el-option label="有机土" value="有机土" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="灌溉方式" prop="irrigationType">
                  <el-select
                    v-model="formData.irrigationType"
                    placeholder="请选择灌溉方式"
                    clearable
                    style="width: 100%"
                  >
                    <el-option label="滴灌" value="滴灌" />
                    <el-option label="喷灌" value="喷灌" />
                    <el-option label="漫灌" value="漫灌" />
                    <el-option label="微喷" value="微喷" />
                    <el-option label="渗灌" value="渗灌" />
                    <el-option label="自然降雨" value="自然降雨" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 位置信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Location /></el-icon>
              位置信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24">
                <el-form-item label="位置坐标">
                  <div class="location-input">
                    <el-input
                      v-model="locationText"
                      placeholder="请输入位置坐标，格式：经度,纬度 或 经度1,纬度1;经度2,纬度2"
                      type="textarea"
                      :rows="3"
                      @blur="parseLocationInfo"
                    />
                    <div class="location-tip">
                      支持单点坐标或多点边界坐标，多个坐标点用分号分隔
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 地块图片 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Picture /></el-icon>
              地块图片
            </div>

            <el-row :gutter="20">
              <el-col :xs="24">
                <el-form-item label="地块图片">
                  <div class="images-upload">
                    <el-upload
                      class="images-uploader"
                      action="#"
                      :file-list="imageFileList"
                      list-type="picture-card"
                      :before-upload="beforeImageUpload"
                      :http-request="handleImageUpload"
                      :on-remove="handleImageRemove"
                      :limit="8"
                    >
                      <el-icon><Plus /></el-icon>
                    </el-upload>
                    <div class="upload-tip">
                      最多上传8张图片，支持 JPG、PNG 格式，单个文件不超过 2MB
                    </div>
                  </div>
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
              :loading="plotStore.loading"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePlotStore } from '@/stores/plot'
import { useFarmStore } from '@/stores/farm'

const route = useRoute()
const router = useRouter()
const plotStore = usePlotStore()
const farmStore = useFarmStore()

// 响应式数据
const formRef = ref()
const imageFileList = ref([])
const locationText = ref('')

const formData = reactive({
  plotName: '',
  description: '',
  farmId: null,
  area: null,
  soilType: '',
  irrigationType: '',
  locationInfo: {
    coordinates: [],
    boundaries: []
  },
  images: [],
  plotStatus: 1
})

const farmOptions = ref([])
const presetFarmId = ref(null)

// 表单验证规则
const formRules = {
  plotName: [
    { required: true, message: '请输入地块名称', trigger: 'blur' },
    { min: 2, max: 50, message: '地块名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  farmId: [
    { required: true, message: '请选择所属农场', trigger: 'change' }
  ],
  area: [
    { required: true, message: '请输入地块面积', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '地块面积必须大于0', trigger: 'blur' }
  ],
  plotStatus: [
    { required: true, message: '请选择地块状态', trigger: 'change' }
  ]
}

// 计算属性
const isEdit = computed(() => !!route.params.id)
const plotId = computed(() => route.params.id ? parseInt(route.params.id) : null)

// 方法
const loadFarmOptions = async () => {
  const farms = await farmStore.fetchFarmSelector({ enabled: true })
  farmOptions.value = farms || []
}

const parseLocationInfo = () => {
  if (!locationText.value.trim()) {
    formData.locationInfo = { coordinates: [], boundaries: [] }
    return
  }

  try {
    const points = locationText.value.split(';').map(point => {
      const [lng, lat] = point.trim().split(',').map(coord => parseFloat(coord.trim()))
      if (isNaN(lng) || isNaN(lat)) {
        throw new Error('坐标格式错误')
      }
      return [lng, lat]
    })

    if (points.length === 1) {
      // 单点坐标
      formData.locationInfo.coordinates = points[0]
      formData.locationInfo.boundaries = []
    } else {
      // 多点边界
      formData.locationInfo.coordinates = []
      formData.locationInfo.boundaries = points
    }
  } catch (error) {
    ElMessage.warning('坐标格式错误，请检查输入格式')
    formData.locationInfo = { coordinates: [], boundaries: [] }
  }
}

const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleImageUpload = async (options) => {
  const uploadFormData = new FormData()
  uploadFormData.append('file', options.file)

  try {
    const url = await plotStore.uploadPlotImage(uploadFormData)
    if (url) {
      formData.images.push(url)
      imageFileList.value.push({
        name: options.file.name,
        url: url
      })
      ElMessage.success('图片上传成功')
    }
  } catch (error) {
    ElMessage.error('图片上传失败')
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

    let result
    if (isEdit.value) {
      result = await plotStore.updatePlot(plotId.value, formData)
    } else {
      result = await plotStore.createPlot(formData)
    }

    if (result) {
      router.push('/plots')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleBack = () => {
  router.back()
}

const loadPlotData = async () => {
  if (isEdit.value && plotId.value) {
    const plot = await plotStore.fetchPlotDetail(plotId.value)
    if (plot) {
      Object.assign(formData, {
        plotName: plot.plotName || '',
        description: plot.description || '',
        farmId: plot.farmId,
        area: plot.area,
        soilType: plot.soilType || '',
        irrigationType: plot.irrigationType || '',
        locationInfo: plot.locationInfo || { coordinates: [], boundaries: [] },
        images: plot.images || [],
        plotStatus: plot.plotStatus || 1
      })

      // 设置位置文本
      if (plot.locationInfo) {
        if (plot.locationInfo.coordinates && plot.locationInfo.coordinates.length === 2) {
          locationText.value = `${plot.locationInfo.coordinates[0]},${plot.locationInfo.coordinates[1]}`
        } else if (plot.locationInfo.boundaries && plot.locationInfo.boundaries.length > 0) {
          locationText.value = plot.locationInfo.boundaries
            .map(point => `${point[0]},${point[1]}`)
            .join(';')
        }
      }

      // 设置图片列表
      if (plot.images && plot.images.length > 0) {
        imageFileList.value = plot.images.map((url, index) => ({
          name: `image-${index + 1}`,
          url: url
        }))
      }
    }
  }
}

// 生命周期
onMounted(async () => {
  // 检查是否有预设的农场ID
  if (route.query.farmId) {
    presetFarmId.value = parseInt(route.query.farmId)
    formData.farmId = presetFarmId.value
  }

  await loadFarmOptions()
  await loadPlotData()
})
</script>

<style lang="scss" scoped>
.plot-form {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .plot-form-content {
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

    .location-input {
      width: 100%;

      .location-tip {
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
  .plot-form {
    .card-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;

      .card-title {
        text-align: center;
      }
    }

    .plot-form-content {
      .form-section {
        margin-bottom: 20px;
        padding: 16px;

        .section-title {
          font-size: 14px;
          margin-bottom: 16px;
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
