/**
 * API测试工具
 * 用于开发环境下测试API接口的可用性
 */

import { 
  farmApi, 
  plotApi, 
  projectApi, 
  orderApi, 
  categoryApi, 
  cropApi, 
  dashboardApi 
} from '@/api'

/**
 * API测试配置
 */
const API_TEST_CONFIG = {
  // 是否启用API测试
  enabled: import.meta.env.DEV,
  
  // 测试超时时间（毫秒）
  timeout: 5000,
  
  // 测试间隔时间（毫秒）
  interval: 10000
}

/**
 * API测试用例
 */
const API_TEST_CASES = [
  {
    name: '农场列表',
    api: () => farmApi.getFarmList({ current: 1, size: 10 }),
    module: 'farm'
  },
  {
    name: '地块列表',
    api: () => plotApi.getPlotList({ current: 1, size: 10 }),
    module: 'plot'
  },
  {
    name: '项目列表',
    api: () => projectApi.getProjectList({ current: 1, size: 10 }),
    module: 'project'
  },
  {
    name: '订单列表',
    api: () => orderApi.getOrderList({ current: 1, size: 10 }),
    module: 'order'
  },
  {
    name: '分类树',
    api: () => categoryApi.getCategoryTree(),
    module: 'category'
  },
  {
    name: '作物列表',
    api: () => cropApi.getCropList({ current: 1, size: 10 }),
    module: 'crop'
  },
  {
    name: '首页统计',
    api: () => dashboardApi.getDashboardStats(),
    module: 'dashboard'
  }
]

/**
 * 执行单个API测试
 * @param {Object} testCase - 测试用例
 * @returns {Promise<Object>} 测试结果
 */
async function runSingleTest(testCase) {
  const startTime = Date.now()
  
  try {
    const response = await Promise.race([
      testCase.api(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), API_TEST_CONFIG.timeout)
      )
    ])
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    return {
      name: testCase.name,
      module: testCase.module,
      success: true,
      duration,
      response: response?.data || response,
      error: null
    }
  } catch (error) {
    const endTime = Date.now()
    const duration = endTime - startTime
    
    return {
      name: testCase.name,
      module: testCase.module,
      success: false,
      duration,
      response: null,
      error: error.message || 'Unknown error'
    }
  }
}

/**
 * 执行所有API测试
 * @returns {Promise<Array>} 测试结果列表
 */
export async function runApiTests() {
  if (!API_TEST_CONFIG.enabled) {
    console.log('🔧 API测试已禁用')
    return []
  }
  
  console.group('🧪 开始API接口测试')
  
  const results = []
  
  for (const testCase of API_TEST_CASES) {
    console.log(`🔍 测试: ${testCase.name}`)
    const result = await runSingleTest(testCase)
    results.push(result)
    
    if (result.success) {
      console.log(`✅ ${testCase.name} - ${result.duration}ms`)
    } else {
      console.error(`❌ ${testCase.name} - ${result.error}`)
    }
  }
  
  // 统计结果
  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length
  
  console.log(`📊 测试完成: ${successCount}成功, ${failCount}失败, 平均耗时${avgDuration.toFixed(0)}ms`)
  console.groupEnd()
  
  return results
}

/**
 * 启动定期API测试
 */
export function startApiMonitoring() {
  if (!API_TEST_CONFIG.enabled) {
    return
  }
  
  console.log('🔄 启动API监控')
  
  // 立即执行一次测试
  runApiTests()
  
  // 定期执行测试
  setInterval(() => {
    runApiTests()
  }, API_TEST_CONFIG.interval)
}

/**
 * 测试特定模块的API
 * @param {string} moduleName - 模块名称
 * @returns {Promise<Array>} 测试结果
 */
export async function testApiModule(moduleName) {
  const moduleTests = API_TEST_CASES.filter(test => test.module === moduleName)
  
  if (moduleTests.length === 0) {
    console.warn(`⚠️ 未找到模块 ${moduleName} 的测试用例`)
    return []
  }
  
  console.group(`🧪 测试模块: ${moduleName}`)
  
  const results = []
  
  for (const testCase of moduleTests) {
    const result = await runSingleTest(testCase)
    results.push(result)
    
    if (result.success) {
      console.log(`✅ ${testCase.name} - ${result.duration}ms`)
    } else {
      console.error(`❌ ${testCase.name} - ${result.error}`)
    }
  }
  
  console.groupEnd()
  
  return results
}

/**
 * 生成API测试报告
 * @param {Array} results - 测试结果
 * @returns {Object} 测试报告
 */
export function generateTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    total: results.length,
    success: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    avgDuration: results.reduce((sum, r) => sum + r.duration, 0) / results.length,
    details: results,
    modules: {}
  }
  
  // 按模块分组统计
  results.forEach(result => {
    if (!report.modules[result.module]) {
      report.modules[result.module] = {
        total: 0,
        success: 0,
        failed: 0,
        avgDuration: 0
      }
    }
    
    const moduleStats = report.modules[result.module]
    moduleStats.total++
    
    if (result.success) {
      moduleStats.success++
    } else {
      moduleStats.failed++
    }
  })
  
  // 计算各模块平均耗时
  Object.keys(report.modules).forEach(module => {
    const moduleResults = results.filter(r => r.module === module)
    report.modules[module].avgDuration = 
      moduleResults.reduce((sum, r) => sum + r.duration, 0) / moduleResults.length
  })
  
  return report
}

// 开发环境下自动启动API监控
if (API_TEST_CONFIG.enabled) {
  // 延迟启动，等待应用初始化完成
  setTimeout(() => {
    startApiMonitoring()
  }, 3000)
}
