<template>
  <div class="project-form">
    <div class="page-container">
      <el-card class="ifarm-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ isEdit ? '编辑项目' : '新建项目' }}</span>
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
          class="project-form-content"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="项目名称" prop="projectName">
                  <el-input
                    v-model="formData.projectName"
                    placeholder="请输入项目名称"
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
                    @change="handleFarmChange"
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
                <el-form-item label="所属地块" prop="plotId">
                  <el-select
                    v-model="formData.plotId"
                    placeholder="请选择地块"
                    clearable
                    filterable
                    style="width: 100%"
                    :disabled="!formData.farmId"
                  >
                    <el-option
                      v-for="plot in plotOptions"
                      :key="plot.id"
                      :label="plot.plotName"
                      :value="plot.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="作物类型" prop="cropId">
                  <el-select
                    v-model="formData.cropId"
                    placeholder="请选择作物"
                    clearable
                    filterable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="crop in cropOptions"
                      :key="crop.id"
                      :label="crop.cropName"
                      :value="crop.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :xs="24">
                <el-form-item label="项目描述" prop="description">
                  <el-input
                    v-model="formData.description"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入项目描述，详细介绍项目特色和亮点"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 认养设置 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Money /></el-icon>
              认养设置
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="8">
                <el-form-item label="认养单位" prop="unitName">
                  <el-input
                    v-model="formData.unitName"
                    placeholder="如：株、棵、平方米"
                    clearable
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="8">
                <el-form-item label="单位数量" prop="unitCount">
                  <el-input-number
                    v-model="formData.unitCount"
                    placeholder="请输入单位数量"
                    :min="1"
                    :max="99999"
                    controls-position="right"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="8">
                <el-form-item label="单位价格" prop="unitPrice">
                  <el-input-number
                    v-model="formData.unitPrice"
                    placeholder="请输入单位价格"
                    :min="0.01"
                    :precision="2"
                    controls-position="right"
                    style="width: 100%"
                  />
                  <template #append>元</template>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="认养期限" prop="adoptionPeriod">
                  <el-input-number
                    v-model="formData.adoptionPeriod"
                    placeholder="请输入认养期限"
                    :min="1"
                    :max="365"
                    controls-position="right"
                    style="width: 100%"
                  />
                  <template #append>天</template>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="预期产量" prop="expectedYield">
                  <el-input-number
                    v-model="formData.expectedYield"
                    placeholder="请输入预期产量"
                    :min="0.01"
                    :precision="2"
                    controls-position="right"
                    style="width: 100%"
                  />
                  <template #append>{{ formData.yieldUnit || 'kg' }}</template>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="产量单位" prop="yieldUnit">
                  <el-select
                    v-model="formData.yieldUnit"
                    placeholder="请选择产量单位"
                    style="width: 100%"
                  >
                    <el-option label="千克(kg)" value="kg" />
                    <el-option label="斤" value="斤" />
                    <el-option label="吨(t)" value="t" />
                    <el-option label="个" value="个" />
                    <el-option label="箱" value="箱" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 种植计划 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Calendar /></el-icon>
              种植计划
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="计划种植日期" prop="plannedPlantingDate">
                  <el-date-picker
                    v-model="formData.plannedPlantingDate"
                    type="date"
                    placeholder="请选择种植日期"
                    style="width: 100%"
                    :disabled-date="disabledPlantingDate"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="计划收获日期" prop="plannedHarvestDate">
                  <el-date-picker
                    v-model="formData.plannedHarvestDate"
                    type="date"
                    placeholder="请选择收获日期"
                    style="width: 100%"
                    :disabled-date="disabledHarvestDate"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24">
                <el-form-item label="种植说明" prop="plantingNotes">
                  <el-input
                    v-model="formData.plantingNotes"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入种植说明，包括种植方式、注意事项等"
                    maxlength="300"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 图片管理 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Picture /></el-icon>
              图片管理
            </div>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="项目封面" prop="coverImage" required>
                  <el-upload
                    class="cover-uploader"
                    :action="uploadAction"
                    :show-file-list="false"
                    :before-upload="beforeCoverUpload"
                    :on-success="handleCoverUpload"
                    :on-error="handleUploadError"
                  >
                    <img v-if="formData.coverImage" :src="formData.coverImage" class="cover-image" />
                    <div v-else class="cover-uploader-icon">
                      <el-icon><Plus /></el-icon>
                      <div class="upload-text">上传封面</div>
                    </div>
                  </el-upload>
                  <div class="upload-tip">
                    建议尺寸：400x300像素，支持JPG、PNG格式，大小不超过2MB
                  </div>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="项目图片">
                  <el-upload
                    class="image-uploader"
                    :action="uploadAction"
                    :file-list="imageFileList"
                    :before-upload="beforeImageUpload"
                    :on-success="handleImageUpload"
                    :on-error="handleUploadError"
                    :on-remove="handleImageRemove"
                    list-type="picture-card"
                    multiple
                  >
                    <el-icon><Plus /></el-icon>
                  </el-upload>
                  <div class="upload-tip">
                    最多上传6张图片，支持JPG、PNG格式，单张大小不超过2MB
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <el-button size="large" @click="handleBack">取消</el-button>
            <el-button type="info" size="large" @click="handleSaveDraft">
              保存草稿
            </el-button>
            <el-button type="primary" size="large" @click="handleSubmit">
              {{ isEdit ? '更新项目' : '创建项目' }}
            </el-button>
            <el-button 
              v-if="isEdit && formData.projectStatus === 1" 
              type="success" 
              size="large" 
              @click="handlePublish"
            >
              发布项目
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '@/stores/project'
import { useFarmStore } from '@/stores/farm'
import { usePlotStore } from '@/stores/plot'
import { createValidationRules, validateImageFile } from '@/utils/validation'
import { showError } from '@/utils/error-handler'

// 路由
const route = useRoute()
const router = useRouter()

// Store
const projectStore = useProjectStore()
const farmStore = useFarmStore()
const plotStore = usePlotStore()

// 响应式数据
const formRef = ref()
const imageFileList = ref([])

const formData = reactive({
  projectName: '',
  description: '',
  farmId: null,
  plotId: null,
  cropId: null,
  unitName: '',
  unitCount: null,
  unitPrice: null,
  adoptionPeriod: null,
  expectedYield: null,
  yieldUnit: 'kg',
  plannedPlantingDate: null,
  plannedHarvestDate: null,
  plantingNotes: '',
  coverImage: '',
  images: [],
  projectStatus: 1 // 默认草稿状态
})

const farmOptions = ref([])
const plotOptions = ref([])
const cropOptions = ref([])

// 计算属性
const isEdit = computed(() => !!route.params.id)
const projectId = computed(() => route.params.id ? parseInt(route.params.id) : null)
const uploadAction = computed(() => '/api/upload/image') // 上传接口地址

// 表单验证规则
const formRules = {
  projectName: [
    ...createValidationRules('required', { message: '请输入项目名称' }),
    { min: 2, max: 50, message: '项目名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  farmId: [
    ...createValidationRules('required', { message: '请选择农场' })
  ],
  plotId: [
    ...createValidationRules('required', { message: '请选择地块' })
  ],
  cropId: [
    ...createValidationRules('required', { message: '请选择作物类型' })
  ],
  description: [
    ...createValidationRules('required', { message: '请输入项目描述' }),
    { min: 10, max: 500, message: '项目描述长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  unitName: [
    ...createValidationRules('required', { message: '请输入认养单位' }),
    { max: 10, message: '认养单位不能超过 10 个字符', trigger: 'blur' }
  ],
  unitCount: [
    ...createValidationRules('required', { message: '请输入单位数量' }),
    { type: 'number', min: 1, max: 99999, message: '单位数量范围为 1-99999', trigger: 'blur' }
  ],
  unitPrice: [
    ...createValidationRules('required', { message: '请输入单位价格' }),
    ...createValidationRules('price', { min: 0.01, max: 999999 })
  ],
  adoptionPeriod: [
    ...createValidationRules('required', { message: '请输入认养期限' }),
    { type: 'number', min: 1, max: 365, message: '认养期限范围为 1-365 天', trigger: 'blur' }
  ],
  expectedYield: [
    { type: 'number', min: 0.01, message: '预期产量必须大于 0', trigger: 'blur' }
  ],
  yieldUnit: [
    ...createValidationRules('required', { message: '请选择产量单位' })
  ],
  plannedPlantingDate: [
    ...createValidationRules('required', { message: '请选择计划种植日期' })
  ],
  plannedHarvestDate: [
    ...createValidationRules('required', { message: '请选择计划收获日期' })
  ],
  coverImage: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请上传项目封面图片'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 方法
const loadFarmOptions = async () => {
  try {
    const farms = await farmStore.fetchFarmSelector()
    farmOptions.value = farms || []

    // 如果有预设的农场ID，设置默认值
    const presetFarmId = route.query.farmId
    if (presetFarmId && !isEdit.value) {
      formData.farmId = parseInt(presetFarmId)
      await loadPlotOptions(formData.farmId)
    }
  } catch (error) {
    console.error('加载农场选项失败:', error)
  }
}

const loadPlotOptions = async (farmId) => {
  if (!farmId) {
    plotOptions.value = []
    return
  }

  try {
    const plots = await plotStore.fetchPlotSelector({ farmId })
    plotOptions.value = plots || []

    // 如果有预设的地块ID，设置默认值
    const presetPlotId = route.query.plotId
    if (presetPlotId && !isEdit.value) {
      formData.plotId = parseInt(presetPlotId)
    }
  } catch (error) {
    console.error('加载地块选项失败:', error)
  }
}

const loadCropOptions = async () => {
  try {
    // 这里应该调用作物API
    // const crops = await cropStore.fetchCropSelector()
    // cropOptions.value = crops || []

    // 暂时使用Mock数据
    cropOptions.value = [
      { id: 1, cropName: '水稻' },
      { id: 2, cropName: '小麦' },
      { id: 3, cropName: '玉米' },
      { id: 4, cropName: '大豆' },
      { id: 5, cropName: '蔬菜' },
      { id: 6, cropName: '水果' },
      { id: 7, cropName: '茶叶' },
      { id: 8, cropName: '中药材' }
    ]
  } catch (error) {
    console.error('加载作物选项失败:', error)
  }
}

const handleFarmChange = async (farmId) => {
  formData.plotId = null
  plotOptions.value = []

  if (farmId) {
    await loadPlotOptions(farmId)
  }
}

const disabledPlantingDate = (time) => {
  // 种植日期不能早于今天
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const disabledHarvestDate = (time) => {
  // 收获日期不能早于种植日期
  if (!formData.plannedPlantingDate) {
    return time.getTime() < Date.now()
  }
  return time.getTime() < new Date(formData.plannedPlantingDate).getTime() + 24 * 60 * 60 * 1000
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

const handleCoverUpload = (response) => {
  if (response.success && response.data) {
    formData.coverImage = response.data.url
    // 触发表单验证
    formRef.value?.validateField('coverImage')
    ElMessage.success('封面图片上传成功')
  } else {
    ElMessage.error('封面图片上传失败')
  }
}

const beforeImageUpload = (file) => {
  if (imageFileList.value.length >= 6) {
    ElMessage.warning('最多只能上传6张图片')
    return false
  }

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

const handleImageUpload = (response, file) => {
  if (response.success && response.data) {
    formData.images.push(response.data.url)
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
    // 移除失败的文件
    const index = imageFileList.value.findIndex(item => item.uid === file.uid)
    if (index !== -1) {
      imageFileList.value.splice(index, 1)
    }
  }
}

const handleImageRemove = (file) => {
  // 从formData.images中移除对应的URL
  if (file.response && file.response.data) {
    const index = formData.images.indexOf(file.response.data.url)
    if (index !== -1) {
      formData.images.splice(index, 1)
    }
  }
}

const handleUploadError = (error) => {
  console.error('图片上传失败:', error)
  ElMessage.error('图片上传失败，请重试')
}

const loadProjectData = async () => {
  if (!projectId.value) return

  try {
    const project = await projectStore.fetchProjectDetail(projectId.value)
    if (project) {
      // 填充表单数据
      Object.assign(formData, {
        projectName: project.projectName || '',
        description: project.description || '',
        farmId: project.farmId || null,
        plotId: project.plotId || null,
        cropId: project.cropId || null,
        unitName: project.unitName || '',
        unitCount: project.unitCount || null,
        unitPrice: project.unitPrice || null,
        adoptionPeriod: project.adoptionPeriod || null,
        expectedYield: project.expectedYield || null,
        yieldUnit: project.yieldUnit || 'kg',
        plannedPlantingDate: project.plannedPlantingDate ? new Date(project.plannedPlantingDate) : null,
        plannedHarvestDate: project.plannedHarvestDate ? new Date(project.plannedHarvestDate) : null,
        plantingNotes: project.plantingNotes || '',
        coverImage: project.coverImage || '',
        images: project.images || [],
        projectStatus: project.projectStatus || 1
      })

      // 设置图片文件列表
      if (project.images && project.images.length > 0) {
        imageFileList.value = project.images.map((url, index) => ({
          uid: index,
          name: `image-${index}`,
          url: url,
          response: { success: true, data: { url } }
        }))
      }

      // 加载对应的地块数据
      if (project.farmId) {
        await loadPlotOptions(project.farmId)
      }
    }
  } catch (error) {
    console.error('加载项目数据失败:', error)
    ElMessage.error('加载项目数据失败')
    router.push('/projects')
  }
}

const validateForm = async () => {
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
    return false
  }
}

const handleSaveDraft = async () => {
  const isValid = await validateForm()
  if (!isValid) return

  try {
    const submitData = {
      ...formData,
      projectStatus: 1, // 草稿状态
      plannedPlantingDate: formData.plannedPlantingDate ?
        formData.plannedPlantingDate.toISOString().split('T')[0] : null,
      plannedHarvestDate: formData.plannedHarvestDate ?
        formData.plannedHarvestDate.toISOString().split('T')[0] : null
    }

    let result
    if (isEdit.value) {
      result = await projectStore.updateProject(projectId.value, submitData)
    } else {
      result = await projectStore.createProject(submitData)
    }

    if (result) {
      ElMessage.success('草稿保存成功')
      if (!isEdit.value) {
        router.push(`/projects/${result.id}/edit`)
      }
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
  }
}

const handleSubmit = async () => {
  const isValid = await validateForm()
  if (!isValid) return

  try {
    const submitData = {
      ...formData,
      plannedPlantingDate: formData.plannedPlantingDate ?
        formData.plannedPlantingDate.toISOString().split('T')[0] : null,
      plannedHarvestDate: formData.plannedHarvestDate ?
        formData.plannedHarvestDate.toISOString().split('T')[0] : null
    }

    let result
    if (isEdit.value) {
      result = await projectStore.updateProject(projectId.value, submitData)
    } else {
      result = await projectStore.createProject(submitData)
    }

    if (result) {
      ElMessage.success(isEdit.value ? '项目更新成功' : '项目创建成功')
      router.push('/projects')
    }
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handlePublish = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要发布这个项目吗？发布后项目将对用户可见，且部分信息将无法修改。',
      '发布项目确认',
      {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const success = await projectStore.publishProject(projectId.value)
    if (success) {
      formData.projectStatus = 2 // 更新本地状态
      ElMessage.success('项目发布成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('发布项目失败:', error)
    }
  }
}

const handleBack = () => {
  router.back()
}

// 监听农场变化
watch(() => formData.farmId, (newFarmId) => {
  if (newFarmId) {
    loadPlotOptions(newFarmId)
  } else {
    plotOptions.value = []
    formData.plotId = null
  }
})

// 监听种植日期变化，自动调整收获日期
watch(() => formData.plannedPlantingDate, (newDate) => {
  if (newDate && formData.plannedHarvestDate) {
    const plantingTime = new Date(newDate).getTime()
    const harvestTime = new Date(formData.plannedHarvestDate).getTime()

    // 如果收获日期早于种植日期，自动调整收获日期
    if (harvestTime <= plantingTime) {
      const newHarvestDate = new Date(plantingTime + 30 * 24 * 60 * 60 * 1000) // 默认30天后
      formData.plannedHarvestDate = newHarvestDate
    }
  }
})

// 生命周期
onMounted(async () => {
  await Promise.all([
    loadFarmOptions(),
    loadCropOptions()
  ])

  if (isEdit.value) {
    await loadProjectData()
  }
})
</script>

<style lang="scss" scoped>
.project-form {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .project-form-content {
    .form-section {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 20px;
        padding-bottom: 8px;
        border-bottom: 2px solid var(--el-color-primary-light-8);

        .el-icon {
          color: var(--el-color-primary);
        }
      }
    }

    .cover-uploader {
      .cover-image {
        width: 200px;
        height: 150px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid var(--el-border-color);
      }

      .cover-uploader-icon {
        width: 200px;
        height: 150px;
        border: 2px dashed var(--el-border-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--el-text-color-placeholder);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: var(--el-color-primary);
          color: var(--el-color-primary);
        }

        .el-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 14px;
        }
      }
    }

    .image-uploader {
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
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      margin-top: 8px;
      line-height: 1.4;
    }

    .form-actions {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--el-border-color-lighter);
      display: flex;
      justify-content: center;
      gap: 16px;

      .el-button {
        min-width: 120px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .project-form {
    .card-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;

      .card-title {
        font-size: 16px;
      }
    }

    .project-form-content {
      .section-title {
        font-size: 14px;
      }

      .cover-uploader {
        .cover-image,
        .cover-uploader-icon {
          width: 150px;
          height: 112px;
        }

        .cover-uploader-icon {
          .el-icon {
            font-size: 24px;
          }

          .upload-text {
            font-size: 12px;
          }
        }
      }

      .image-uploader {
        :deep(.el-upload--picture-card) {
          width: 80px;
          height: 80px;
        }

        :deep(.el-upload-list--picture-card .el-upload-list__item) {
          width: 80px;
          height: 80px;
        }
      }

      .form-actions {
        flex-direction: column;

        .el-button {
          width: 100%;
          min-width: auto;
        }
      }
    }
  }
}

// 表单项样式优化
:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-regular);
}

:deep(.el-input-number) {
  .el-input__wrapper {
    padding-right: 40px;
  }
}

:deep(.el-textarea) {
  .el-textarea__inner {
    resize: vertical;
    min-height: 80px;
  }
}

:deep(.el-date-editor) {
  width: 100%;
}
</style>
