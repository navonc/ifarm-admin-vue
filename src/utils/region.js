/**
 * 省市区数据管理工具
 */

// 省份数据
export const PROVINCES = [
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
]

// 城市数据映射
export const CITIES = {
  '110000': [
    { code: '110100', name: '北京市', districts: [
      { code: '110101', name: '东城区' },
      { code: '110102', name: '西城区' },
      { code: '110105', name: '朝阳区' },
      { code: '110106', name: '丰台区' },
      { code: '110107', name: '石景山区' },
      { code: '110108', name: '海淀区' },
      { code: '110109', name: '门头沟区' },
      { code: '110111', name: '房山区' },
      { code: '110112', name: '通州区' },
      { code: '110113', name: '顺义区' },
      { code: '110114', name: '昌平区' },
      { code: '110115', name: '大兴区' },
      { code: '110116', name: '怀柔区' },
      { code: '110117', name: '平谷区' },
      { code: '110118', name: '密云区' },
      { code: '110119', name: '延庆区' }
    ]}
  ],
  '120000': [
    { code: '120100', name: '天津市', districts: [
      { code: '120101', name: '和平区' },
      { code: '120102', name: '河东区' },
      { code: '120103', name: '河西区' },
      { code: '120104', name: '南开区' },
      { code: '120105', name: '河北区' },
      { code: '120106', name: '红桥区' },
      { code: '120110', name: '东丽区' },
      { code: '120111', name: '西青区' },
      { code: '120112', name: '津南区' },
      { code: '120113', name: '北辰区' },
      { code: '120114', name: '武清区' },
      { code: '120115', name: '宝坻区' },
      { code: '120116', name: '滨海新区' },
      { code: '120117', name: '宁河区' },
      { code: '120118', name: '静海区' },
      { code: '120119', name: '蓟州区' }
    ]}
  ],
  '310000': [
    { code: '310100', name: '上海市', districts: [
      { code: '310101', name: '黄浦区' },
      { code: '310104', name: '徐汇区' },
      { code: '310105', name: '长宁区' },
      { code: '310106', name: '静安区' },
      { code: '310107', name: '普陀区' },
      { code: '310109', name: '虹口区' },
      { code: '310110', name: '杨浦区' },
      { code: '310112', name: '闵行区' },
      { code: '310113', name: '宝山区' },
      { code: '310114', name: '嘉定区' },
      { code: '310115', name: '浦东新区' },
      { code: '310116', name: '金山区' },
      { code: '310117', name: '松江区' },
      { code: '310118', name: '青浦区' },
      { code: '310120', name: '奉贤区' },
      { code: '310151', name: '崇明区' }
    ]}
  ],
  '440000': [
    { code: '440100', name: '广州市', districts: [
      { code: '440103', name: '荔湾区' },
      { code: '440104', name: '越秀区' },
      { code: '440105', name: '海珠区' },
      { code: '440106', name: '天河区' },
      { code: '440111', name: '白云区' },
      { code: '440112', name: '黄埔区' },
      { code: '440113', name: '番禺区' },
      { code: '440114', name: '花都区' },
      { code: '440115', name: '南沙区' },
      { code: '440117', name: '从化区' },
      { code: '440118', name: '增城区' }
    ]},
    { code: '440300', name: '深圳市', districts: [
      { code: '440303', name: '罗湖区' },
      { code: '440304', name: '福田区' },
      { code: '440305', name: '南山区' },
      { code: '440306', name: '宝安区' },
      { code: '440307', name: '龙岗区' },
      { code: '440308', name: '盐田区' },
      { code: '440309', name: '龙华区' },
      { code: '440310', name: '坪山区' },
      { code: '440311', name: '光明区' }
    ]},
    { code: '440600', name: '佛山市', districts: [
      { code: '440604', name: '禅城区' },
      { code: '440605', name: '南海区' },
      { code: '440606', name: '顺德区' },
      { code: '440607', name: '三水区' },
      { code: '440608', name: '高明区' }
    ]},
    { code: '441200', name: '肇庆市', districts: [
      { code: '441202', name: '端州区' },
      { code: '441203', name: '鼎湖区' },
      { code: '441204', name: '高要区' },
      { code: '441223', name: '广宁县' },
      { code: '441224', name: '怀集县' },
      { code: '441225', name: '封开县' },
      { code: '441226', name: '德庆县' },
      { code: '441284', name: '四会市' }
    ]}
  ],
  '320000': [
    { code: '320100', name: '南京市', districts: [
      { code: '320102', name: '玄武区' },
      { code: '320104', name: '秦淮区' },
      { code: '320105', name: '建邺区' },
      { code: '320106', name: '鼓楼区' },
      { code: '320111', name: '浦口区' },
      { code: '320113', name: '栖霞区' },
      { code: '320114', name: '雨花台区' },
      { code: '320115', name: '江宁区' },
      { code: '320116', name: '六合区' },
      { code: '320117', name: '溧水区' },
      { code: '320118', name: '高淳区' }
    ]},
    { code: '320200', name: '无锡市', districts: [
      { code: '320205', name: '锡山区' },
      { code: '320206', name: '惠山区' },
      { code: '320211', name: '滨湖区' },
      { code: '320213', name: '梁溪区' },
      { code: '320214', name: '新吴区' },
      { code: '320281', name: '江阴市' },
      { code: '320282', name: '宜兴市' }
    ]},
    { code: '320500', name: '苏州市', districts: [
      { code: '320505', name: '虎丘区' },
      { code: '320506', name: '吴中区' },
      { code: '320507', name: '相城区' },
      { code: '320508', name: '姑苏区' },
      { code: '320509', name: '吴江区' },
      { code: '320581', name: '常熟市' },
      { code: '320582', name: '张家港市' },
      { code: '320583', name: '昆山市' },
      { code: '320585', name: '太仓市' }
    ]}
  ]
}

// 数据缓存
const regionCache = new Map()

/**
 * 获取省份列表
 * @returns {Array} 省份列表
 */
export function getProvinces() {
  return PROVINCES
}

/**
 * 获取城市列表
 * @param {string} provinceCode - 省份代码
 * @returns {Array} 城市列表
 */
export function getCities(provinceCode) {
  if (!provinceCode) return []
  
  const cacheKey = `cities_${provinceCode}`
  if (regionCache.has(cacheKey)) {
    return regionCache.get(cacheKey)
  }
  
  const cities = CITIES[provinceCode] || []
  regionCache.set(cacheKey, cities)
  
  return cities
}

/**
 * 获取区县列表
 * @param {string} provinceCode - 省份代码
 * @param {string} cityCode - 城市代码
 * @returns {Array} 区县列表
 */
export function getDistricts(provinceCode, cityCode) {
  if (!provinceCode || !cityCode) return []
  
  const cacheKey = `districts_${provinceCode}_${cityCode}`
  if (regionCache.has(cacheKey)) {
    return regionCache.get(cacheKey)
  }
  
  const cities = getCities(provinceCode)
  const city = cities.find(c => c.code === cityCode)
  const districts = city?.districts || []
  
  regionCache.set(cacheKey, districts)
  
  return districts
}

/**
 * 根据代码获取名称
 * @param {string} code - 地区代码
 * @returns {string} 地区名称
 */
export function getRegionName(code) {
  if (!code) return ''
  
  // 查找省份
  const province = PROVINCES.find(p => p.code === code)
  if (province) return province.name
  
  // 查找城市
  for (const provinceCode in CITIES) {
    const cities = CITIES[provinceCode]
    const city = cities.find(c => c.code === code)
    if (city) return city.name
    
    // 查找区县
    for (const city of cities) {
      const district = city.districts?.find(d => d.code === code)
      if (district) return district.name
    }
  }
  
  return ''
}

/**
 * 获取完整地址
 * @param {string} provinceCode - 省份代码
 * @param {string} cityCode - 城市代码
 * @param {string} districtCode - 区县代码
 * @returns {string} 完整地址
 */
export function getFullAddress(provinceCode, cityCode, districtCode) {
  const parts = []
  
  if (provinceCode) {
    parts.push(getRegionName(provinceCode))
  }
  
  if (cityCode) {
    parts.push(getRegionName(cityCode))
  }
  
  if (districtCode) {
    parts.push(getRegionName(districtCode))
  }
  
  return parts.join(' ')
}

/**
 * 验证地区代码的有效性
 * @param {string} provinceCode - 省份代码
 * @param {string} cityCode - 城市代码
 * @param {string} districtCode - 区县代码
 * @returns {Object} 验证结果
 */
export function validateRegionCodes(provinceCode, cityCode, districtCode) {
  const result = {
    valid: true,
    errors: []
  }
  
  // 验证省份
  if (provinceCode && !PROVINCES.find(p => p.code === provinceCode)) {
    result.valid = false
    result.errors.push('无效的省份代码')
  }
  
  // 验证城市
  if (cityCode) {
    const cities = getCities(provinceCode)
    if (!cities.find(c => c.code === cityCode)) {
      result.valid = false
      result.errors.push('无效的城市代码')
    }
  }
  
  // 验证区县
  if (districtCode) {
    const districts = getDistricts(provinceCode, cityCode)
    if (!districts.find(d => d.code === districtCode)) {
      result.valid = false
      result.errors.push('无效的区县代码')
    }
  }
  
  return result
}

/**
 * 清除缓存
 */
export function clearRegionCache() {
  regionCache.clear()
}
