# GIG-X 项目开发规则

## 项目概述
- **项目名称**: GIG-X
- **技术栈**: uni-app + Vue3 + Pinia + SCSS
- **支持平台**: H5、Android、iOS 三端
- **UI框架**: uview-plus + z-paging

## 核心开发规则

### 1. 三端适配要求（强制）
所有代码修改必须确保 H5、Android、iOS 三端兼容：

- ✅ **使用 rpx 单位**：所有尺寸使用 `rpx`，不用 `px`
- ✅ **条件编译**：平台特定样式使用条件编译
  ```scss
  // #ifdef H5
  cursor: pointer;
  // #endif
  ```
- ✅ **uni-app API**：使用 `uni.*` API 而非浏览器原生 API
- ✅ **避免平台特定属性**：如 `cursor: pointer` 仅在 H5 有效
- ✅ **测试验证**：修改后需在三端测试验证

### 2. 文件操作规范
- **优先编辑现有文件**：除非必要，不创建新文件
- **不创建文档文件**：不主动创建 README.md 或其他文档
- **文件路径**：使用绝对路径，从项目根目录开始

### 3. 代码风格
- **缩进**: 2空格
- **引号**: 单引号
- **分号**: 不使用分号
- **命名**:
  - 组件: PascalCase (如 `RecommendUsers.vue`)
  - 变量/函数: camelCase (如 `loadUserList`)
  - 常量: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

### 4. Vue3 开发规范
- 使用 Composition API (`<script setup>`)
- 响应式数据使用 `ref` 或 `reactive`
- 生命周期使用组合式 API: `onMounted`, `onShow`, `onActivated`
- Props 定义使用 `defineProps`

### 5. 样式编写规范
- 使用 SCSS，不使用 CSS
- 使用嵌套语法提高可读性
- 颜色使用 rgba 或十六进制
- 适当添加注释说明复杂样式
- 使用 `scoped` 避免样式污染

### 6. 目录结构约定
```
src/
├── pages/          # 页面
│   ├── discover/   # 首页（推荐用户+动态）
│   ├── community/  # 朋友圈（关注内容）
│   ├── my/         # 我的
│   └── ...
├── components/     # 全局组件
├── api/            # API接口
├── store/          # Pinia状态管理
├── utils/          # 工具函数
└── static/         # 静态资源
```

### 7. Git 提交规范
- 提交前检查代码质量
- 提交信息格式：`类型: 描述`
  - `feat`: 新功能
  - `fix`: 修复bug
  - `style`: 样式调整
  - `refactor`: 重构
  - `docs`: 文档
  - `chore`: 构建/工具

### 8. 注释规范
- 重要逻辑添加注释
- 条件编译添加说明注释
- 临时注释代码需说明原因
- 使用中文注释

### 9. 项目特定规则

#### 底部导航配置
- 顺序：首页、朋友圈、消息、我的
- 图标大小：22px
- 文字大小：12px
- 配置文件：`src/pages.json`

#### 页面配置
- 首页：推荐用户 + 动态（Tab形式）
- 朋友圈：仅显示关注内容
- 消息：对话列表 + 克隆人管理
- 新鲜玩法：已注释，暂不使用

#### 样式适配
- 消息气泡：宽度自适应内容，最大70%
- 图标使用：`/static/images/` 路径
- 主题色：`#00D9C5` (选中), `#5662E1` (渐变)

### 10. API 调用规范
- 使用 async/await 处理异步
- 统一错误处理
- loading 状态管理
- 请求取消机制（必要时）

### 11. 性能优化要求
- 图片懒加载
- 列表虚拟滚动（长列表）
- 合理使用缓存
- 避免重复请求

### 12. 安全规范
- 不提交敏感信息
- API密钥使用环境变量
- 用户输入验证
- XSS防护

## 常用命令
```bash
# 开发
npm run dev:h5           # H5开发
pnpm dev:h5              # H5开发（pnpm）

# 构建
npm run build:h5         # H5构建

# 代码检查
npm run lint             # ESLint检查
npm run lint:fix         # 自动修复
npm run format           # Prettier格式化
```

## 工作流程

### 修改代码流程
1. 理解需求
2. 创建 Todo 列表（使用 TodoWrite）
3. 读取相关文件
4. 编辑文件
5. 检查三端适配
6. 更新 Todo 状态
7. 总结修改内容

### 问题排查流程
1. 读取错误日志
2. 定位问题文件
3. 分析代码逻辑
4. 提出解决方案
5. 实施修复
6. 验证结果

## 注意事项
- ⚠️ 修改前先阅读现有代码
- ⚠️ 保持代码风格一致
- ⚠️ 避免过度工程化
- ⚠️ 只修改必要的部分
- ⚠️ 及时更新 Todo 状态
- ⚠️ 修改后提供清晰的总结

## 禁止操作
- ❌ 不创建不必要的文件
- ❌ 不修改 node_modules
- ❌ 不提交敏感信息
- ❌ 不使用过时的 API
- ❌ 不忽略三端适配
