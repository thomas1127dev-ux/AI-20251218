<template>
  <view class="setup-page">
    <up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
      <template #left>
        <up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
      </template>
      <template #center>
        设置
      </template>
    </up-navbar>

    <view class="content">
      <!-- 账号信息 -->
      <view class="section">
        <view class="section-title">账号信息</view>
        <view class="menu-list">
          <view class="menu-item">
            <view class="item-left">
              <text class="item-label">登录账号</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ userInfo.username || '未登录' }}</text>
            </view>
          </view>
          <view class="menu-item" @click="showPasswordDialog = true">
            <view class="item-left">
              <text class="item-label">设置密码</text>
            </view>
            <view class="item-right">
              <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
            </view>
          </view>
        </view>
      </view>

      <!-- 隐私与安全 -->
      <view class="section">
        <view class="section-title">隐私与安全</view>
        <view class="menu-list">
          <view class="menu-item">
            <view class="item-left">
              <text class="item-label">青少年模式</text>
              <text class="item-desc">开启后将推送健康内容</text>
            </view>
            <view class="item-right">
              <up-switch
                v-model="settings.youthMode"
                active-color="#5662E1"
                size="24"
                @change="handleYouthModeChange"
              ></up-switch>
            </view>
          </view>
        </view>
      </view>

      <!-- 通知设置 -->
      <view class="section">
        <view class="section-title">通知设置</view>
        <view class="menu-list">
          <view class="menu-item">
            <view class="item-left">
              <text class="item-label">接收消息通知</text>
              <text class="item-desc">包括消息提醒、推荐提醒、活动提醒</text>
            </view>
            <view class="item-right">
              <up-switch
                v-model="settings.messageNotification"
                active-color="#5662E1"
                size="24"
                @change="handleSettingChange"
              ></up-switch>
            </view>
          </view>
          <view class="menu-item">
            <view class="item-left">
              <text class="item-label">个性化推荐</text>
              <text class="item-desc">根据您的兴趣推荐内容</text>
            </view>
            <view class="item-right">
              <up-switch
                v-model="settings.personalizedRecommendation"
                active-color="#5662E1"
                size="24"
                @change="handleSettingChange"
              ></up-switch>
            </view>
          </view>
        </view>
      </view>

      <!-- 其他设置 -->
      <view class="section">
        <view class="section-title">其他</view>
        <view class="menu-list">
          <view class="menu-item" @click="checkVersion">
            <view class="item-left">
              <text class="item-label">版本更新</text>
            </view>
            <view class="item-right">
              <text class="item-value">{{ appVersion }}</text>
              <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
            </view>
          </view>
          <view class="menu-item" @click="showAbout = true">
            <view class="item-left">
              <text class="item-label">关于我们</text>
            </view>
            <view class="item-right">
              <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
            </view>
          </view>
        </view>
      </view>

      <!-- 账号操作 -->
      <view class="section">
        <view class="action-button" @click="logout">
          <text>退出登录</text>
        </view>
        <view class="action-button danger" @click="showDeleteAccount = true">
          <text>注销账号</text>
        </view>
      </view>
    </view>

    <!-- 设置密码弹窗 -->
    <up-popup :show="showPasswordDialog" @close="showPasswordDialog = false" mode="center" round="10" :closeable="true">
      <view class="password-dialog">
        <view class="dialog-title">设置密码</view>
        <view class="dialog-desc">密码为6-10位，需包含数字和字母</view>
        <up-input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码"
          border="surround"
          class="password-input"
        ></up-input>
        <up-input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          border="surround"
          class="password-input"
        ></up-input>
        <up-input
          v-model="passwordForm.verifyCode"
          placeholder="请输入短信验证码"
          border="surround"
          class="password-input"
        >
          <template #suffix>
            <up-button
              type="primary"
              size="small"
              :disabled="codeCountdown > 0"
              @click="sendVerifyCode"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}s` : '发送验证码' }}
            </up-button>
          </template>
        </up-input>
        <view class="dialog-actions">
          <up-button type="primary" @click="submitPassword">确定</up-button>
          <up-button @click="showPasswordDialog = false" style="margin-top: 20rpx;">取消</up-button>
        </view>
      </view>
    </up-popup>

    <!-- 关于我们弹窗 -->
    <up-popup :show="showAbout" @close="showAbout = false" mode="center" round="10" :closeable="true">
      <view class="about-dialog">
        <view class="dialog-title">关于我们</view>
        <view class="about-list">
          <view class="about-item" @click="openDoc('privacy')">
            <text>隐私条款</text>
            <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
          </view>
          <view class="about-item" @click="openDoc('user-agreement')">
            <text>用户协议</text>
            <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
          </view>
          <view class="about-item" @click="openDoc('license')">
            <text>资质证照</text>
            <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
          </view>
        </view>
        <view class="version-info">
          <text>版本号：{{ appVersion }}</text>
        </view>
      </view>
    </up-popup>

    <!-- 注销账号弹窗 -->
    <up-popup :show="showDeleteAccount" @close="showDeleteAccount = false" mode="center" round="10">
      <view class="delete-dialog">
        <view class="dialog-title">注销账号</view>
        <view class="dialog-warning">
          <text>注销账号后，您的所有数据将被永久删除，且无法恢复。确定要继续吗？</text>
        </view>
        <view class="dialog-actions">
          <up-button type="error" @click="deleteAccount">确认注销</up-button>
          <up-button @click="showDeleteAccount = false" style="margin-top: 20rpx;">取消</up-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// #ifdef H5
import { storeToRefs } from 'pinia'
import { userinfoStore } from '@/store/userinfos.js'
const store = userinfoStore()
const { personInfo } = storeToRefs(store)
// #endif

// #ifdef APP-PLUS
import { userinfoStore } from '@/store/userinfos.js'
const store = userinfoStore()
const personInfo = ref(store.personInfo || {})
// #endif

const userInfo = ref({})
const appVersion = ref('1.0.0')

// 设置项
const settings = reactive({
  youthMode: false,
  messageNotification: true,
  personalizedRecommendation: true
})

// 弹窗控制
const showPasswordDialog = ref(false)
const showAbout = ref(false)
const showDeleteAccount = ref(false)

// 密码表单
const passwordForm = reactive({
  newPassword: '',
  confirmPassword: '',
  verifyCode: ''
})

// 验证码倒计时
const codeCountdown = ref(0)
let countdownTimer = null

onShow(() => {
  // 获取用户信息
  userInfo.value = uni.getStorageSync('user_info') || {}

  // 加载设置
  loadSettings()
})

onMounted(() => {
  // 获取版本号
  // #ifdef APP-PLUS
  plus.runtime.getProperty(plus.runtime.appid, (info) => {
    appVersion.value = info.version
  })
  // #endif
})

// 加载设置
const loadSettings = () => {
  const savedSettings = uni.getStorageSync('app_settings')
  if (savedSettings) {
    Object.assign(settings, savedSettings)
  }
}

// 保存设置
const saveSettings = () => {
  uni.setStorageSync('app_settings', settings)
}

// 处理青少年模式切换
const handleYouthModeChange = (value) => {
  if (value) {
    uni.showModal({
      title: '青少年模式',
      content: '开启后将为您推送健康内容，确定开启吗？',
      success: (res) => {
        if (!res.confirm) {
          settings.youthMode = false
        } else {
          saveSettings()
          uni.showToast({
            title: '青少年模式已开启',
            icon: 'success'
          })
        }
      }
    })
  } else {
    saveSettings()
  }
}

// 处理设置变更
const handleSettingChange = () => {
  saveSettings()
}

// 发送验证码
const sendVerifyCode = () => {
  if (!userInfo.value.username) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }

  // TODO: 调用发送验证码接口
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  })

  // 开始倒计时
  codeCountdown.value = 60
  countdownTimer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

// 提交密码
const submitPassword = () => {
  const { newPassword, confirmPassword, verifyCode } = passwordForm

  // 验证密码格式
  if (newPassword.length < 6 || newPassword.length > 10) {
    uni.showToast({
      title: '密码长度为6-10位',
      icon: 'none'
    })
    return
  }

  // 验证是否包含数字和字母
  const hasNumber = /\d/.test(newPassword)
  const hasLetter = /[a-zA-Z]/.test(newPassword)
  if (!hasNumber || !hasLetter) {
    uni.showToast({
      title: '密码需同时包含数字和字母',
      icon: 'none'
    })
    return
  }

  if (newPassword !== confirmPassword) {
    uni.showToast({
      title: '两次密码输入不一致',
      icon: 'none'
    })
    return
  }

  if (!verifyCode) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    })
    return
  }

  // TODO: 调用设置密码接口
  uni.showToast({
    title: '密码设置成功',
    icon: 'success'
  })
  showPasswordDialog.value = false

  // 清空表单
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordForm.verifyCode = ''
}

// 检查版本更新
const checkVersion = () => {
  // TODO: 调用检查更新接口
  uni.showToast({
    title: '当前已是最新版本',
    icon: 'none'
  })
}

// 打开文档
const openDoc = (type) => {
  // TODO: 跳转到对应的协议页面
  uni.navigateTo({
    url: `/pages/common/webview?type=${type}`
  })
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除用户信息
        uni.removeStorageSync('user_info')
        uni.removeStorageSync('token')

        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })

        // 跳转到登录页
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/login'
          })
        }, 1500)
      }
    }
  })
}

// 注销账号
const deleteAccount = () => {
  uni.showModal({
    title: '最后确认',
    content: '注销后无法恢复，真的要注销吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用注销账号接口
        uni.showToast({
          title: '账号已注销',
          icon: 'success'
        })

        showDeleteAccount.value = false

        // 清除数据并跳转到登录页
        setTimeout(() => {
          uni.clearStorageSync()
          uni.reLaunch({
            url: '/pages/login/login'
          })
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.setup-page {
  min-height: 100vh;
  padding-bottom: 30rpx;
}

.content {
  padding: 0 30rpx;
}

.section {
  margin-bottom: 30rpx;

  .section-title {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 20rpx;
    padding-left: 10rpx;
  }

  .menu-list {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20rpx;
    overflow: hidden;

    .menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .item-left {
        flex: 1;

        .item-label {
          font-size: 30rpx;
          color: #ffffff;
        }

        .item-desc {
          display: block;
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 8rpx;
        }
      }

      .item-right {
        display: flex;
        align-items: center;

        .item-value {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.6);
          margin-right: 10rpx;
        }
      }
    }
  }

  .action-button {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20rpx;
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;

    text {
      font-size: 32rpx;
      color: #ffffff;
    }

    &.danger {
      background: rgba(255, 68, 68, 0.15);

      text {
        color: #ff4444;
      }
    }
  }
}

// 弹窗样式
.password-dialog,
.about-dialog,
.delete-dialog {
  width: 600rpx;
  padding: 40rpx;
  background: #2a2832;
  border-radius: 20rpx;

  .dialog-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .dialog-desc {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    margin-bottom: 30rpx;
  }

  .password-input {
    margin-bottom: 20rpx;
  }

  .dialog-actions {
    margin-top: 40rpx;
  }
}

.about-dialog {
  .about-list {
    .about-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25rpx 0;
      border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);

      &:last-child {
        border-bottom: none;
      }

      text {
        font-size: 30rpx;
        color: #ffffff;
      }
    }
  }

  .version-info {
    text-align: center;
    margin-top: 30rpx;
    padding-top: 30rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.1);

    text {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.4);
    }
  }
}

.delete-dialog {
  .dialog-warning {
    padding: 30rpx;
    background: rgba(255, 68, 68, 0.1);
    border-radius: 10rpx;
    margin-bottom: 30rpx;

    text {
      font-size: 28rpx;
      color: #ff4444;
      line-height: 1.6;
    }
  }
}
</style>