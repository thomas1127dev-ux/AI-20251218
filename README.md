
# GIG-Flash 项目配置与运行文档

## 项目概述

**GIG-Flash** 是一个基于 **uni-app** 框架开发的跨平台移动应用，支持多端部署（H5、小程序、App）。项目采用 Vue 3 + JavaScript 技术栈，集成了 uview-plus UI 组件库和 Pinia 状态管理。

## 技术架构

- **前端框架**: Vue 3 + uni-app
- **UI组件库**: uview-plus
- **状态管理**: Pinia
- **样式预处理**: SCSS
- **构建工具**: HBuilderX / uni-app CLI
- **目标平台**: App

## 配置文件详解

### 2. 应用配置 (manifest.json)

**基本信息**:
- 应用名称: appName //使用HBuilderX修改
- 应用ID: appId
- 版本号: 1.0.0
- 版本代码: 100

**平台配置**:
- **App端**: 支持Android和iOS，包含相机、视频播放等模块
- **小程序端**: 支持微信、支付宝、百度、头条小程序
- **权限配置**: 包含相机、网络、存储等必要权限

### 3. 依赖配置 (package.json)

```json
{
  "dependencies": {
    "clipboard": "^2.0.11",    // 剪贴板操作
    "dayjs": "^1.11.13",       // 日期处理
    "pinia": "^3.0.3"          // 状态管理
  }
}
```

### 4. 主入口配置 (main.js)

```javascript
import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import { createPinia } from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

// z-paging分页组件配置
uni.$zp = {
    config: {
        'default-page-size': 20,
    }
}

// Vue 3 应用创建
export function createApp() {
    const app = createSSRApp(App)
    app.use(uviewPlus).use(pinia)
    return { app }
}
```

## API配置详解

### 1. HTTP请求配置 (utils/http.js)

**请求配置**:
- 基础URL: 从.env获取
- 请求头: 包含token认证、开发标识
- 超时时间: 15秒
- 加载提示: 800ms后显示loading

**主要功能**:
- 自动token管理
- 请求防重复
- 统一错误处理
- 身份过期自动跳转

**API方法**:
- `request()`: 通用请求方法
- `getRequest()`: GET请求
- `postRequest()`: POST请求
- `putRequest()`: PUT请求

### 2. API接口模块

#### 社区模块 (api/community.js)
- 动态创建、查询、点赞、分享
- 评论管理
- 关注功能

#### 内容模块 (api/content.js)
- 内容列表获取
- 收藏功能
- 长视频相关

#### 消息模块 (api/message.js)
- 消息列表查询
- 消息创建
- 会话详情

## 页面路由配置 (pages.json)

**主要页面**:
- 欢迎页: `/pages/welecome/index`
- 引导页: `/pages/guide/guide`
- 首页: `/pages/index/index` (App端) / `/pages/index/index-v` (其他端)
- 发现页: `/pages/discover/discover`
- 社区页: `/pages/community/community`
- 个人中心: `/pages/my/my`

## 样式配置 (uni.scss)

**全局样式变量**:
- 主题色彩系统
- 尺寸规范
- 间距标准
- 透明度设置

**集成组件**:
- uview-plus主题样式
- 自定义主题变量

## 运行与开发

### 开发环境要求

1. **Node.js**: 建议版本 22+
2. **HBuilderX**: 推荐使用HBuilderX进行开发
3. **依赖安装**: `yarn`

### 开发命令

```bash
# 安装依赖
yarn

# 开发模式 (HBuilderX中操作)
# 1. 点击运行 -> 运行到浏览器
# 2. 点击运行 -> 运行到手机或模拟器
# 3. 点击发行 -> 原生App-云打包
```

### 调试配置

**开发环境**:
- API地址: `http://192.168.0.109:8080/collide-all/api/v1`
- 开启console输出
- 显示请求loading

**生产环境**:
- 关闭console输出
- 隐藏开发标识

## 打包配置

### App端打包

**Android配置**:
- 支持架构: armeabi-v7a, arm64-v8a, x86
- 权限: 相机、网络、存储等
- 图标: 72x72, 96x96, 144x144, 192x192

**iOS配置**:
- 图标尺寸: 1024x1024 (App Store)
- 支持iPhone和iPad


## 部署说明

### 开发部署

1. 在HBuilderX中运行到目标平台
2. 检查网络请求和功能正常性

### 生产部署

1. 配置生产环境API地址
2. 使用HBuilderX进行云打包
3. 上传到各应用商店或平台

## 注意事项

1. **API地址配置**: 开发和生产环境需要不同的API地址
2. **权限管理**: App端需要配置相应的权限声明
3. **跨平台兼容**: 注意不同平台的差异，使用条件编译
4. **性能优化**: 生产环境关闭console输出，优化加载性能
5. **版本管理**: 及时更新manifest.json中的版本信息

## 开发规范

### 三端兼容原则 ⚠️ 重要

**本项目支持 H5、Android、iOS 三个平台，所有功能开发必须考虑三端兼容性。**

#### 1. 状态管理兼容

由于 Pinia 在 APP 端存在兼容性问题，项目采用双 store 架构：

- **H5端**: 使用 Pinia (`src/store/userinfos.js`)
- **APP端**: 使用原生类实现 (`src/store/userinfos-app.js`)

**开发规范**:
```javascript
// ✅ 正确：在两个 store 文件中同步添加新状态和方法
// H5: src/store/userinfos.js
export const userinfoStore = defineStore('userinfos', {
  state: () => ({
    newState: ''  // 新增状态
  }),
  actions: {
    newMethod() {}  // 新增方法
  }
})

// APP: src/store/userinfos-app.js
class UserinfoStore {
  constructor() {
    this.newState = ''  // 同步新增状态
  }
  newMethod() {}  // 同步新增方法
}
```

#### 2. API 响应式数据兼容

在 APP 端使用 Pinia storeToRefs 会导致响应式失效，需要区分处理：

```vue
<script setup>
import { userinfoStore } from '@/store/userinfos.js'

// #ifdef H5
import { storeToRefs } from 'pinia'
const store = userinfoStore()
const { personInfo } = storeToRefs(store)
// #endif

// #ifdef APP-PLUS
const store = userinfoStore()
const personInfo = ref(uni.getStorageSync('userinfos_personInfo') || {})
// 需要时手动同步
const updatePersonInfo = () => {
  personInfo.value = uni.getStorageSync('userinfos_personInfo') || {}
}
// #endif
</script>
```

#### 3. 条件编译使用规范

使用 uni-app 条件编译处理平台差异：

```vue
<!-- 仅H5显示 -->
<!-- #ifdef H5 -->
<view>H5专属内容</view>
<!-- #endif -->

<!-- 仅APP显示 -->
<!-- #ifdef APP-PLUS -->
<view>APP专属内容</view>
<!-- #endif -->

<!-- 排除H5 -->
<!-- #ifndef H5 -->
<view>非H5内容</view>
<!-- #endif -->
```

```javascript
// JavaScript 中的条件编译
// #ifdef H5
console.log('H5平台')
// #endif

// #ifdef APP-PLUS
console.log('APP平台')
// #endif
```

#### 4. 功能开发检查清单

在开发任何新功能时，必须完成以下检查：

- [ ] H5 端测试通过
- [ ] Android 端测试通过
- [ ] iOS 端测试通过（如有条件）
- [ ] 状态管理在两个 store 文件中同步更新
- [ ] API 调用在三端均正常
- [ ] 响应式数据在三端均生效
- [ ] UI 布局在不同屏幕尺寸下正常显示

#### 5. 常见兼容性问题

**问题1: Store 数据不同步**
- 原因: 只修改了一个 store 文件
- 解决: 在 `userinfos.js` 和 `userinfos-app.js` 中同步修改

**问题2: APP端响应式数据失效**
- 原因: 使用了 storeToRefs
- 解决: APP端使用 ref + 手动同步机制

**问题3: 某些API仅在H5生效**
- 原因: 使用了浏览器专属API
- 解决: 使用 uni-app 提供的跨平台API

**问题4: 样式在不同端表现不一致**
- 原因: 使用了平台特定的CSS属性
- 解决: 使用 uni-app 推荐的 rpx 单位和兼容性样式

## 常见问题

1. **网络请求失败**: 检查API地址配置和网络连接
2. **权限问题**: 确认manifest.json中的权限配置
3. **打包失败**: 检查依赖版本兼容性和配置完整性
4. **跨平台问题**: 使用条件编译处理平台差异



----------------------------

# H5 PWA项目配置

**需要严格按照要求配置**



- 使用[工具](https://favicon.inbrowser.app/tools/favicon-generator)生成图标并放到项目中

- 修改`.env`文件

```js

VITE_API_NAME = X //app名

VITE_API_SHORT_NAME = x //app短名

VITE_API_DESCRIPTION = A short-video app //app描述

// 图标覆盖对应的路径文件，图片名称不变   /static/icon/pwa-192x192.png
```


- 修改`index.html`,加入head中

``` html
    <!-- 根据需求调整  不会调就确保文件名一致 -->
    <link rel="apple-touch-icon" href="/static/icon/apple-touch-icon.png">
		<link rel="icon" href="/static/icon/favicon-32x32.png" type="image/png" sizes="32x32">
		<link rel="icon" href="/static/icon/favicon-16x16.png" type="image/png" sizes="16x16">
		<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
		<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">

```

> 如果认为这么配置麻烦,就形成配置,然后引用对应变量


<!-- 如果打包app 需要在config.js中 把服务器地址修改一下 -->