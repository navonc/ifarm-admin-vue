<template>
  <div class="region-selector">
    <el-row :gutter="12">
      <el-col :span="provinceSpan">
        <el-select
          v-model="selectedProvince"
          placeholder="请选择省份"
          clearable
          filterable
          :disabled="disabled"
          :size="size"
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
      </el-col>

      <el-col v-if="showCity" :span="citySpan">
        <el-select
          v-model="selectedCity"
          placeholder="请选择城市"
          clearable
          filterable
          :disabled="disabled || !selectedProvince"
          :size="size"
          style="width: 100%"
          @change="handleCityChange"
        >
          <el-option
            v-for="city in cities"
            :key="city.code"
            :label="city.name"
            :value="city.code"
          />
        </el-select>
      </el-col>

      <el-col v-if="showDistrict" :span="districtSpan">
        <el-select
          v-model="selectedDistrict"
          placeholder="请选择区县"
          clearable
          filterable
          :disabled="disabled || !selectedCity"
          :size="size"
          style="width: 100%"
          @change="handleDistrictChange"
        >
          <el-option
            v-for="district in districts"
            :key="district.code"
            :label="district.name"
            :value="district.code"
          />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getProvinces, getCities, getDistricts, getFullAddress } from '@/utils/region'

// Props
const props = defineProps({
  // 当前选中的值
  modelValue: {
    type: Object,
    default: () => ({
      province: '',
      city: '',
      district: ''
    })
  },
  
  // 是否显示城市选择
  showCity: {
    type: Boolean,
    default: true
  },
  
  // 是否显示区县选择
  showDistrict: {
    type: Boolean,
    default: true
  },
  
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  
  // 尺寸
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  
  // 是否必填
  required: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// 响应式数据
const selectedProvince = ref('')
const selectedCity = ref('')
const selectedDistrict = ref('')

const provinces = ref([])
const cities = ref([])
const districts = ref([])

// 计算属性
const provinceSpan = computed(() => {
  if (!props.showCity && !props.showDistrict) return 24
  if (!props.showDistrict) return 12
  return 8
})

const citySpan = computed(() => {
  if (!props.showDistrict) return 12
  return 8
})

const districtSpan = computed(() => 8)

// 方法
const loadProvinces = () => {
  provinces.value = getProvinces()
}

const handleProvinceChange = (provinceCode) => {
  selectedCity.value = ''
  selectedDistrict.value = ''
  cities.value = []
  districts.value = []
  
  if (provinceCode) {
    cities.value = getCities(provinceCode)
  }
  
  emitChange()
}

const handleCityChange = (cityCode) => {
  selectedDistrict.value = ''
  districts.value = []
  
  if (cityCode && selectedProvince.value) {
    districts.value = getDistricts(selectedProvince.value, cityCode)
  }
  
  emitChange()
}

const handleDistrictChange = () => {
  emitChange()
}

const emitChange = () => {
  const value = {
    province: selectedProvince.value,
    city: selectedCity.value,
    district: selectedDistrict.value
  }
  
  const fullAddress = getFullAddress(
    selectedProvince.value,
    selectedCity.value,
    selectedDistrict.value
  )
  
  emit('update:modelValue', value)
  emit('change', {
    ...value,
    fullAddress,
    provinceName: provinces.value.find(p => p.code === selectedProvince.value)?.name || '',
    cityName: cities.value.find(c => c.code === selectedCity.value)?.name || '',
    districtName: districts.value.find(d => d.code === selectedDistrict.value)?.name || ''
  })
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedProvince.value = newValue.province || ''
    selectedCity.value = newValue.city || ''
    selectedDistrict.value = newValue.district || ''
    
    // 加载对应的城市和区县数据
    if (newValue.province) {
      cities.value = getCities(newValue.province)
      
      if (newValue.city) {
        districts.value = getDistricts(newValue.province, newValue.city)
      }
    }
  }
}, { immediate: true, deep: true })

// 生命周期
onMounted(() => {
  loadProvinces()
})

// 暴露方法给父组件
defineExpose({
  validate: () => {
    if (props.required) {
      if (!selectedProvince.value) {
        return { valid: false, message: '请选择省份' }
      }
      if (props.showCity && !selectedCity.value) {
        return { valid: false, message: '请选择城市' }
      }
      if (props.showDistrict && !selectedDistrict.value) {
        return { valid: false, message: '请选择区县' }
      }
    }
    return { valid: true }
  },
  
  reset: () => {
    selectedProvince.value = ''
    selectedCity.value = ''
    selectedDistrict.value = ''
    cities.value = []
    districts.value = []
  }
})
</script>

<style lang="scss" scoped>
.region-selector {
  width: 100%;
}
</style>
