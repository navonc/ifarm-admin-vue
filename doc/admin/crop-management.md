# 作物与分类管理模块 API 文档

## 概述

作物与分类管理模块为管理员和农场主提供作物品种管理、分类管理等功能。管理员可以管理所有作物和分类，农场主可以管理作物信息。

## 分类管理

**基础路径**: `/api/categories`

### 1. 获取分类列表（管理端）

**接口描述**: 获取分类列表，支持分页和筛选

- **URL**: `GET /api/categories`
- **权限**: 需要认证（农场主/管理员）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| current | Integer | 否 | 1 | 页码 |
| size | Integer | 否 | 10 | 每页大小 |
| categoryName | String | 否 | - | 分类名称（模糊搜索） |
| parentId | Long | 否 | - | 父分类ID |
| enabled | Boolean | 否 | - | 是否启用 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "id": 1,
        "categoryName": "叶菜类",
        "code": "leafy_vegetables",
        "icon": "https://example.com/icons/leafy.png",
        "parentId": 0,
        "parentName": null,
        "sortOrder": 1,
        "enabled": true,
        "childrenCount": 5,
        "cropCount": 12,
        "createTime": "2025-01-19T10:00:00",
        "updateTime": "2025-01-19T15:30:00"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

### 2. 创建分类

**接口描述**: 创建新的分类

- **URL**: `POST /api/categories`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**:

```json
{
  "categoryName": "叶菜类",                    // 分类名称 (必填)
  "code": "leafy_vegetables",                // 分类编码 (可选)
  "icon": "https://example.com/icons/leafy.png",  // 分类图标 (可选)
  "parentId": 0,                             // 父分类ID，0表示顶级分类 (可选，默认0)
  "sortOrder": 1,                            // 排序 (可选，默认0)
  "enabled": true                            // 是否启用 (可选，默认true)
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "categoryName": "叶菜类",
    "code": "leafy_vegetables",
    "icon": "https://example.com/icons/leafy.png",
    "parentId": 0,
    "parentName": null,
    "sortOrder": 1,
    "enabled": true,
    "childrenCount": 0,
    "cropCount": 0,
    "createTime": "2025-01-19T10:00:00"
  }
}
```

### 3. 更新分类

**接口描述**: 更新分类信息

- **URL**: `PUT /api/categories/{id}`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 分类ID |

- **请求参数**: 同创建分类，所有字段都是可选的
- **响应示例**: 同创建分类响应

### 4. 删除分类

**接口描述**: 删除分类

- **URL**: `DELETE /api/categories/{id}`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 分类ID |

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 5. 批量删除分类

**接口描述**: 批量删除分类

- **URL**: `DELETE /api/categories/batch`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**:

```json
{
  "ids": [1, 2, 3]  // 分类ID数组 (必填)
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

## 作物管理

**基础路径**: `/api/crops`

### 1. 获取作物列表（管理端）

**接口描述**: 获取作物列表，支持分页和筛选

- **URL**: `GET /api/crops`
- **权限**: 需要认证（农场主/管理员）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**:

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| current | Integer | 否 | 1 | 页码 |
| size | Integer | 否 | 10 | 每页大小 |
| cropName | String | 否 | - | 作物名称（模糊搜索） |
| categoryId | Long | 否 | - | 分类ID |
| enabled | Boolean | 否 | - | 是否启用 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "id": 1,
        "name": "小白菜",
        "variety": "上海青",
        "description": "营养丰富的绿叶蔬菜，口感鲜嫩",
        "categoryId": 2,
        "categoryName": "白菜类",
        "growthCycle": 30,
        "plantingSeason": "春季、秋季",
        "harvestSeason": "春季、秋季",
        "yieldPerUnit": 2.5,
        "nutritionInfo": {
          "vitamin_c": "高",
          "fiber": "丰富",
          "calories": "低"
        },
        "plantingGuide": "选择疏松肥沃的土壤，保持适当湿度，定期施肥。",
        "coverImage": "https://example.com/crops/xiaobai.jpg",
        "images": ["https://example.com/crops/xiaobai1.jpg"],
        "enabled": true,
        "createTime": "2025-01-19T10:00:00",
        "updateTime": "2025-01-19T15:30:00"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

### 2. 创建作物

**接口描述**: 创建新的作物

- **URL**: `POST /api/crops`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**:

```json
{
  "name": "小白菜",                          // 作物名称 (必填)
  "variety": "上海青",                       // 品种 (可选)
  "description": "营养丰富的绿叶蔬菜，口感鲜嫩",  // 作物描述 (可选)
  "categoryId": 2,                          // 作物分类ID (可选)
  "growthCycle": 30,                        // 生长周期（天） (可选)
  "plantingSeason": "春季、秋季",             // 种植季节 (可选)
  "harvestSeason": "春季、秋季",              // 收获季节 (可选)
  "yieldPerUnit": 2.5,                      // 单位产量（kg） (可选)
  "nutritionInfo": {                        // 营养信息（JSON格式） (可选)
    "vitamin_c": "高",
    "fiber": "丰富",
    "calories": "低"
  },
  "plantingGuide": "选择疏松肥沃的土壤，保持适当湿度，定期施肥。",  // 种植指南 (可选)
  "coverImage": "https://example.com/crops/xiaobai.jpg",           // 封面图片 (可选)
  "images": ["https://example.com/crops/xiaobai1.jpg"],            // 作物图片 (可选)
  "enabled": true                           // 是否启用 (可选，默认true)
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "小白菜",
    "variety": "上海青",
    "description": "营养丰富的绿叶蔬菜，口感鲜嫩",
    "categoryId": 2,
    "categoryName": "白菜类",
    "growthCycle": 30,
    "plantingSeason": "春季、秋季",
    "harvestSeason": "春季、秋季",
    "yieldPerUnit": 2.5,
    "nutritionInfo": {
      "vitamin_c": "高",
      "fiber": "丰富",
      "calories": "低"
    },
    "plantingGuide": "选择疏松肥沃的土壤，保持适当湿度，定期施肥。",
    "coverImage": "https://example.com/crops/xiaobai.jpg",
    "images": ["https://example.com/crops/xiaobai1.jpg"],
    "enabled": true,
    "createTime": "2025-01-19T10:00:00"
  }
}
```

### 3. 更新作物

**接口描述**: 更新作物信息

- **URL**: `PUT /api/crops/{id}`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 作物ID |

- **请求参数**: 同创建作物，所有字段都是可选的
- **响应示例**: 同创建作物响应

### 4. 删除作物

**接口描述**: 删除作物

- **URL**: `DELETE /api/crops/{id}`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 作物ID |

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 5. 更新作物状态

**接口描述**: 启用或禁用作物

- **URL**: `PUT /api/crops/{id}/status`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Long | 是 | 作物ID |

- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| enabled | Boolean | 是 | 是否启用 |

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 6. 批量删除作物

**接口描述**: 批量删除作物

- **URL**: `DELETE /api/crops/batch`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**:

```json
{
  "ids": [1, 2, 3]  // 作物ID数组 (必填)
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 7. 导入作物数据

**接口描述**: 批量导入作物数据

- **URL**: `POST /api/crops/import`
- **权限**: 需要认证（管理员）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**: 文件上传（Excel格式）
- **响应示例**:

```json
{
  "code": 200,
  "message": "导入成功",
  "data": {
    "totalCount": 100,
    "successCount": 95,
    "failureCount": 5,
    "failureDetails": [
      {
        "row": 10,
        "reason": "作物名称不能为空"
      }
    ]
  }
}
```

### 8. 导出作物数据

**接口描述**: 导出作物数据

- **URL**: `GET /api/crops/export`
- **权限**: 需要认证（管理员/农场主）
- **请求头**: `Authorization: Bearer {accessToken}`
- **请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| categoryId | Long | 否 | 分类ID |
| enabled | Boolean | 否 | 是否启用 |

- **响应**: Excel文件下载

## 数据字典

### 种植季节

- 春季：3-5月
- 夏季：6-8月
- 秋季：9-11月
- 冬季：12-2月
- 全年：不限季节

### 营养信息等级

- 高：含量丰富
- 中等：含量适中
- 低：含量较少

### 分类层级

- 一级分类：如叶菜类、根茎类、果实类
- 二级分类：如白菜类、萝卜类、茄果类
- 三级分类：具体品种分类

## 业务规则

1. **分类删除规则**：
   - 有子分类的分类不能删除
   - 有关联作物的分类不能删除

2. **作物删除规则**：
   - 有关联认养项目的作物不能删除
   - 可以先禁用作物，再删除

3. **数据导入规则**：
   - 支持Excel格式文件
   - 必填字段：作物名称
   - 重复名称会跳过导入

## 权限说明

- **管理员**: 可以管理所有分类和作物
- **农场主**: 可以管理作物信息，查看分类信息
- **普通用户**: 无权限访问管理接口

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未认证或Token无效 |
| 403 | 权限不足 |
| 404 | 分类或作物不存在 |
| 409 | 业务冲突（如分类有子分类或关联作物） |
| 500 | 服务器内部错误 |
