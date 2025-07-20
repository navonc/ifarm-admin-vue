/**
 * API响应类型定义
 */

// 通用响应结构
export const ApiResponse = {
  code: 200,
  message: '操作成功',
  data: null
}

// 分页响应结构
export const PageResponse = {
  records: [],
  total: 0,
  size: 10,
  current: 1,
  pages: 1
}

// 农场相关类型
export const FarmTypes = {
  // 农场信息
  Farm: {
    id: null,
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
    certification: {
      organic: false,
      greenFood: false
    },
    contactPhone: '',
    businessHours: '',
    enabled: true,
    ownerId: null,
    ownerName: '',
    plotCount: 0,
    projectCount: 0,
    totalAdoptionCount: 0,
    rating: 0,
    reviewCount: 0,
    createTime: '',
    updateTime: ''
  },
  
  // 农场查询参数
  FarmQuery: {
    current: 1,
    size: 10,
    farmName: '',
    ownerId: null,
    enabled: null,
    province: '',
    city: ''
  }
}

// 地块相关类型
export const PlotTypes = {
  // 地块信息
  Plot: {
    id: null,
    plotName: '',
    description: '',
    farmId: null,
    farmName: '',
    area: null,
    soilType: '',
    irrigationType: '',
    locationInfo: {
      coordinates: [],
      boundaries: []
    },
    images: [],
    plotStatus: 1,
    plotStatusName: '',
    enabled: true,
    projectCount: 0,
    unitCount: 0,
    adoptedUnitCount: 0,
    adoptionRate: 0,
    currentCrop: '',
    createTime: '',
    updateTime: ''
  },
  
  // 地块查询参数
  PlotQuery: {
    current: 1,
    size: 10,
    plotName: '',
    farmId: null,
    plotStatus: null,
    enabled: null
  },
  
  // 地块状态枚举
  PlotStatus: {
    IDLE: 1,        // 空闲
    PLANTING: 2,    // 种植中
    HARVESTING: 3,  // 收获中
    FALLOW: 4       // 休耕
  }
}

// 认养项目相关类型
export const ProjectTypes = {
  // 认养项目信息
  Project: {
    id: null,
    name: '',
    description: '',
    plotId: null,
    plotName: '',
    farmId: null,
    farmName: '',
    farmOwner: '',
    cropId: null,
    cropName: '',
    totalUnits: 0,
    availableUnits: 0,
    adoptedUnits: 0,
    unitArea: 0,
    unitPrice: 0,
    expectedYield: 0,
    plantingDate: '',
    expectedHarvestDate: '',
    projectStatus: 1,
    projectStatusName: '',
    coverImage: '',
    adoptionRate: 0,
    totalRevenue: 0,
    createTime: '',
    updateTime: ''
  },
  
  // 项目查询参数
  ProjectQuery: {
    current: 1,
    size: 10,
    name: '',
    farmId: null,
    plotId: null,
    cropId: null,
    projectStatus: null,
    startDate: '',
    endDate: ''
  },
  
  // 项目状态枚举
  ProjectStatus: {
    DRAFT: 1,       // 草稿
    ADOPTING: 2,    // 认养中
    PLANTING: 3,    // 种植中
    HARVESTING: 4,  // 收获中
    COMPLETED: 5,   // 已完成
    CANCELLED: 6    // 已取消
  }
}

// 订单相关类型
export const OrderTypes = {
  // 订单信息
  Order: {
    id: null,
    orderNo: '',
    userId: null,
    userName: '',
    userPhone: '',
    projectId: null,
    projectName: '',
    farmId: null,
    farmName: '',
    farmOwner: '',
    cropName: '',
    unitCount: 0,
    unitPrice: 0,
    totalAmount: 0,
    discountAmount: 0,
    actualAmount: 0,
    orderStatus: 1,
    orderStatusName: '',
    paymentMethod: '',
    paymentTime: '',
    paymentNo: '',
    remark: '',
    createTime: '',
    updateTime: ''
  },
  
  // 订单查询参数
  OrderQuery: {
    current: 1,
    size: 10,
    orderNo: '',
    userId: null,
    projectId: null,
    farmId: null,
    orderStatus: null,
    paymentMethod: '',
    startDate: '',
    endDate: '',
    minAmount: null,
    maxAmount: null
  },
  
  // 订单状态枚举
  OrderStatus: {
    PENDING: 1,     // 待支付
    PAID: 2,        // 已支付
    CANCELLED: 3,   // 已取消
    REFUNDED: 4     // 已退款
  }
}

// 分类相关类型
export const CategoryTypes = {
  // 分类信息
  Category: {
    id: null,
    categoryName: '',
    code: '',
    icon: '',
    parentId: 0,
    parentName: '',
    sortOrder: 0,
    enabled: true,
    childrenCount: 0,
    cropCount: 0,
    createTime: '',
    updateTime: ''
  },
  
  // 分类查询参数
  CategoryQuery: {
    current: 1,
    size: 10,
    categoryName: '',
    parentId: null,
    enabled: null
  }
}

// 作物相关类型
export const CropTypes = {
  // 作物信息
  Crop: {
    id: null,
    cropName: '',
    scientificName: '',
    categoryId: null,
    categoryName: '',
    description: '',
    growthCycle: 0,
    plantingSeason: '',
    harvestSeason: '',
    soilRequirement: '',
    climateRequirement: '',
    nutritionInfo: {},
    images: [],
    enabled: true,
    createTime: '',
    updateTime: ''
  },
  
  // 作物查询参数
  CropQuery: {
    current: 1,
    size: 10,
    cropName: '',
    categoryId: null,
    enabled: null
  }
}

// 统计数据类型
export const StatTypes = {
  // 首页统计
  DashboardStats: {
    totalFarms: 0,
    totalPlots: 0,
    totalProjects: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    adoptionRate: 0,
    recentOrders: [],
    recentProjects: []
  }
}
