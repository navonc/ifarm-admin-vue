# 用户认证相关接口

## 1. 用户密码登录

### 接口信息
- **URL**: `POST /auth/login`
- **描述**: 使用用户名/手机号和密码进行登录
- **认证**: 无需认证

### 请求参数
```json
{
  "username": "string",              // 用户名或手机号，必填
  "password": "string"               // 密码，必填
}
```

### 响应数据
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "userInfo": {
      "id": 1,
      "username": "user123",
      "nickname": "农场小主",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "13800138000",
      "userType": 1,
      "userTypeDesc": "普通用户",
      "status": 1,
      "statusDesc": "正常"
    },
    "needChangePassword": false
  }
}
```

## 2. 微信小程序登录

### 接口信息
- **URL**: `POST /auth/wechat-login`
- **描述**: 使用微信授权码进行登录，如果用户不存在则自动注册
- **认证**: 无需认证

### 请求参数
```json
{
  "code": "string",              // 微信登录凭证，必填
  "encryptedData": "string",     // 加密的用户数据，可选
  "iv": "string",                // 初始向量，可选
  "nickname": "string",          // 用户昵称，可选
  "avatar": "string"             // 用户头像，可选
}
```

### 响应数据
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "userInfo": {
      "id": 1,
      "username": "wx_user_123",
      "nickname": "农场小主",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "13800138000",
      "userType": 1,
      "userTypeDesc": "普通用户",
      "status": 1,
      "statusDesc": "正常"
    },
    "needChangePassword": false
  }
}
```

## 3. 刷新Token

### 接口信息
- **URL**: `POST /auth/refresh`
- **描述**: 使用刷新Token获取新的访问Token
- **认证**: 无需认证

### 请求参数
```json
{
  "refreshToken": "string"       // 刷新Token，必填
}
```

### 响应数据
```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "userInfo": {
      "id": 1,
      "username": "wx_user_123",
      "nickname": "农场小主",
      "avatar": "https://example.com/avatar.jpg",
      "userType": 1,
      "status": 1
    }
  }
}
```

## 4. 退出登录

### 接口信息
- **URL**: `POST /auth/logout`
- **描述**: 用户退出登录，使Token失效
- **认证**: 需要Token

### 请求参数
无

### 响应数据
```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

## 5. 获取当前用户信息

### 接口信息
- **URL**: `GET /auth/profile`
- **描述**: 获取当前登录用户的详细信息
- **认证**: 需要Token

### 请求参数
无

### 响应数据
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "wx_user_123",
    "nickname": "农场小主",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "13800138000",
    "userType": 1,
    "userTypeDesc": "普通用户",
    "gender": 1,
    "genderDesc": "男",
    "status": 1,
    "statusDesc": "正常",
    "lastLoginTime": "2025-01-19T10:30:00Z",
    "createTime": "2025-01-01T12:00:00Z"
  }
}
```

## 6. 更新用户信息

### 接口信息
- **URL**: `PUT /auth/profile`
- **描述**: 更新当前用户的个人信息
- **认证**: 需要Token

### 请求参数
```json
{
  "nickname": "string",          // 用户昵称，可选
  "avatar": "string",            // 头像地址，可选
  "phone": "string",             // 手机号，可选
  "gender": 1                    // 性别：0-未知，1-男，2-女，可选
}
```

### 响应数据
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "wx_user_123",
    "nickname": "农场小主",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "13800138000",
    "userType": 1,
    "gender": 1,
    "status": 1,
    "updateTime": "2025-01-19T10:30:00Z"
  }
}
```



## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 401 | Token无效或已过期 |
| 400 | 微信登录凭证无效 |
| 500 | 微信接口调用失败 |
| 409 | 用户已存在 |
| 403 | 用户已被禁用 |
