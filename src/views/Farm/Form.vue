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
              <el-col :xs="24" :sm="8">
                <el-form-item label="省份" prop="province">
                  <el-select
                    v-model="formData.province"
                    placeholder="请选择省份"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="handleProvinceChange"
                  >
                    <el-option
                      v-for="province in provinces"
                      :key="province.code"
                      :label="province.name"
                      :value="province.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="8">
                <el-form-item label="城市" prop="city">
                  <el-select
                    v-model="formData.city"
                    placeholder="请选择城市"
                    clearable
                    filterable
                    style="width: 100%"
                    :disabled="!formData.province"
                    @change="handleCityChange"
                  >
                    <el-option
                      v-for="city in cities"
                      :key="city.code"
                      :label="city.name"
                      :value="city.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="8">
                <el-form-item label="区县" prop="district">
                  <el-select
                    v-model="formData.district"
                    placeholder="请选择区县"
                    clearable
                    filterable
                    style="width: 100%"
                    :disabled="!formData.city"
                  >
                    <el-option
                      v-for="district in districts"
                      :key="district.code"
                      :label="district.name"
                      :value="district.code"
                    />
                  </el-select>
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

// Mock省市区数据
const provinces = ref([
  { code: '110000', name: '北京市' },
  { code: '120000', name: '天津市' },
  { code: '130000', name: '河北省' },
  { code: '140000', name: '山西省' },
  { code: '150000', name: '内蒙古自治区' },
  { code: '210000', name: '辽宁省' },
  { code: '220000', name: '吉林省' },
  { code: '230000', name: '黑龙江省' },
  { code: '310000', name: '上海市' },
  { code: '320000', name: '江苏省' },
  { code: '330000', name: '浙江省' },
  { code: '340000', name: '安徽省' },
  { code: '350000', name: '福建省' },
  { code: '360000', name: '江西省' },
  { code: '370000', name: '山东省' },
  { code: '410000', name: '河南省' },
  { code: '420000', name: '湖北省' },
  { code: '430000', name: '湖南省' },
  { code: '440000', name: '广东省' },
  { code: '450000', name: '广西壮族自治区' },
  { code: '460000', name: '海南省' },
  { code: '500000', name: '重庆市' },
  { code: '510000', name: '四川省' },
  { code: '520000', name: '贵州省' },
  { code: '530000', name: '云南省' },
  { code: '540000', name: '西藏自治区' },
  { code: '610000', name: '陕西省' },
  { code: '620000', name: '甘肃省' },
  { code: '630000', name: '青海省' },
  { code: '640000', name: '宁夏回族自治区' },
  { code: '650000', name: '新疆维吾尔自治区' }
])

const cities = ref([])
const districts = ref([])

// 表单验证规则
const formRules = {
  farmName: [
    { required: true, message: '请输入农场名称', trigger: 'blur' },
    { min: 2, max: 50, message: '农场名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  totalArea: [
    { required: true, message: '请输入总面积', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '总面积必须大于0', trigger: 'blur' }
  ],
  province: [
    { required: true, message: '请选择省份', trigger: 'change' }
  ],
  city: [
    { required: true, message: '请选择城市', trigger: 'change' }
  ],
  district: [
    { required: true, message: '请选择区县', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ],
  contactPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
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
const handleProvinceChange = (provinceCode) => {
  formData.city = ''
  formData.district = ''
  cities.value = []
  districts.value = []

  // 模拟获取城市数据
  if (provinceCode === '110000') {
    cities.value = [
      { code: '110100', name: '北京市' }
    ]
  } else if (provinceCode === '310000') {
    cities.value = [
      { code: '310100', name: '上海市' }
    ]
  } else if (provinceCode === '440000') {
    cities.value = [
      { code: '440100', name: '广州市' },
      { code: '440300', name: '深圳市' },
      { code: '440600', name: '佛山市' }
    ]
  }
}

const handleCityChange = (cityCode) => {
  formData.district = ''
  districts.value = []

  // 模拟获取区县数据
  if (cityCode === '440100') {
    districts.value = [
      { code: '440103', name: '荔湾区' },
      { code: '440104', name: '越秀区' },
      { code: '440105', name: '海珠区' },
      { code: '440106', name: '天河区' }
    ]
  } else if (cityCode === '440300') {
    districts.value = [
      { code: '440303', name: '罗湖区' },
      { code: '440304', name: '福田区' },
      { code: '440305', name: '南山区' },
      { code: '440306', name: '宝安区' }
    ]
  }
}

const beforeCoverUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('封面图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('封面图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleCoverUpload = async (options) => {
  const formData = new FormData()
  formData.append('file', options.file)

  try {
    const url = await farmStore.uploadFarmImage(formData)
    if (url) {
      formData.coverImage = url
      ElMessage.success('封面图片上传成功')
    }
  } catch (error) {
    ElMessage.error('封面图片上传失败')
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

      // 加载对应的城市和区县数据
      if (farm.province) {
        handleProvinceChange(farm.province)
        if (farm.city) {
          setTimeout(() => {
            handleCityChange(farm.city)
          }, 100)
        }
      }
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
