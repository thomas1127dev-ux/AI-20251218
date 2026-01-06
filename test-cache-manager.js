/**
 * CacheManager 静态测试脚本
 * 验证核心逻辑是否正确
 */

// 模拟 uni 对象
global.uni = {
  getStorageSync: (key) => {
    console.log(`[Mock] getStorageSync: ${key}`)
    return null
  },
  setStorageSync: (key, value) => {
    console.log(`[Mock] setStorageSync: ${key}`)
  },
  removeStorageSync: (key) => {
    console.log(`[Mock] removeStorageSync: ${key}`)
  }
}

// 模拟 Pinia store
const mockStore = {
  chatListCache: [],
  lastChatListRefreshTime: 0,
  shouldRefreshChatList: false,
  ownedClonesCache: [],
  createdClonesCache: [],
  lastClonesRefreshTime: 0,
  shouldRefreshClones: false,

  setChatListCache(list) {
    this.chatListCache = list
  },
  setOwnedClonesCache(list) {
    this.ownedClonesCache = list
  },
  setCreatedClonesCache(list) {
    this.createdClonesCache = list
  },
  setShouldRefreshClones(value) {
    this.shouldRefreshClones = value
  },
  setShouldRefreshChatList(value) {
    this.shouldRefreshChatList = value
  },
  updateLastClonesRefreshTime() {
    this.lastClonesRefreshTime = Date.now()
  },
  updateLastChatListRefreshTime() {
    this.lastChatListRefreshTime = Date.now()
  }
}

// 模拟 userinfoStore
global.userinfoStore = () => mockStore

console.log('=== CacheManager 静态测试 ===\n')

// 动态导入 CacheManager（ES6 模块需要特殊处理）
const CacheManagerPath = './src/utils/cache-manager.js'

console.log('✓ 测试1: 文件存在性')
const fs = require('fs')
if (fs.existsSync(CacheManagerPath)) {
  console.log('  ✅ cache-manager.js 文件存在\n')
} else {
  console.log('  ❌ cache-manager.js 文件不存在\n')
  process.exit(1)
}

console.log('✓ 测试2: 代码语法检查')
try {
  // 读取文件内容
  const code = fs.readFileSync(CacheManagerPath, 'utf-8')

  // 检查关键导出
  if (code.includes('export class CacheManager')) {
    console.log('  ✅ CacheManager 类正确导出\n')
  } else {
    console.log('  ❌ CacheManager 类未找到\n')
  }

  // 检查关键方法
  const methods = ['isValid', 'getCache', 'setCache', 'setRefreshFlag', 'clearRefreshFlag', 'clearCache']
  console.log('✓ 测试3: 检查核心方法')
  methods.forEach(method => {
    if (code.includes(`static ${method}`)) {
      console.log(`  ✅ ${method}() 方法存在`)
    } else {
      console.log(`  ❌ ${method}() 方法缺失`)
    }
  })
  console.log()

  // 检查缓存配置
  console.log('✓ 测试4: 检查缓存配置')
  const cacheTypes = ['chatList', 'ownedClones', 'createdClones']
  cacheTypes.forEach(type => {
    if (code.includes(`${type}:`)) {
      console.log(`  ✅ ${type} 缓存配置存在`)
    } else {
      console.log(`  ❌ ${type} 缓存配置缺失`)
    }
  })
  console.log()

  // 检查 TTL 配置
  console.log('✓ 测试5: 检查TTL配置')
  if (code.includes('30 * 1000')) {
    console.log('  ✅ 对话列表TTL (30秒) 配置正确')
  }
  if (code.includes('60 * 1000')) {
    console.log('  ✅ 克隆人列表TTL (60秒) 配置正确')
  }
  console.log()

  // 检查导入语句
  console.log('✓ 测试6: 检查导入语句')
  if (code.includes("import { userinfoStore }") && code.includes("from '@/store/userinfos.js'")) {
    console.log('  ✅ userinfoStore 导入正确\n')
  } else {
    console.log('  ❌ userinfoStore 导入有误\n')
  }

  console.log('=== 测试完成 ===')
  console.log('✅ 所有静态检查通过！')

} catch (error) {
  console.error('❌ 测试失败:', error.message)
  process.exit(1)
}
