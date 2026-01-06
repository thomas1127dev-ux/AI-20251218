<template>
  <view class="my-page">
    <!-- 导航栏 -->
    <up-navbar bgColor="transparent" placeholder :fixed="false">
      <template #left>
        <text class="title">我的</text>
      </template>
      <template #right>
        <view class="right-icons">
          <up-icon
            name="chat-fill"
            color="#ffffff"
            size="20"
            @click="toPath('/pages/my/message')"
          ></up-icon>
          <up-icon
            name="setting-fill"
            color="#ffffff"
            size="20"
            @click="toPath('/pages/my/setup')"
            style="margin-left: 30rpx"
          ></up-icon>
        </view>
      </template>
    </up-navbar>

    <view class="content">
      <!-- 用户信息卡片 -->
      <view class="user-card" @click="toPath('/pages/my/person')">
        <view class="user-info">
          <up-avatar :src="personInfo.avatar || '/static/logo.png'" size="70"></up-avatar>
          <view class="user-details">
            <view class="name-row">
              <text class="nickname">{{ personInfo.user_nickname || '未登录' }}</text>
              <text class="vip-badge" v-if="personInfo.is_vip">VIP</text>
            </view>
            <view class="phone">{{ personInfo.username || '' }}</view>
            <view class="bio">{{ personInfo.user_bio || '这个人很懒，什么都没留下' }}</view>
          </view>
        </view>
        <up-icon name="arrow-right" color="rgba(255,255,255,0.6)" size="18"></up-icon>
      </view>

      <!-- VIP卡片 -->
      <vip v-if="personInfo.is_vip" />

      <!-- 资产信息 -->
      <view class="assets">
        <view class="asset-item" @click="toPath('/pages/my/recharge')">
          <text class="asset-value">{{ personInfo.balance || 0 }}</text>
          <text class="asset-label">冰花</text>
        </view>
        <view class="divider"></view>
        <view class="asset-item" @click="toPath('/pages/my/bill')">
          <text class="asset-value">{{ personInfo.points || 0 }}</text>
          <text class="asset-label">金币</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <view class="section-title">我的服务</view>
        <view class="menu-list">
          <view
            class="menu-item"
            v-for="(item, index) in serviceMenus"
            :key="index"
            @click="toPath(item.path)"
          >
            <view class="menu-left">
              <up-icon :name="item.icon" color="#ffffff" size="18"></up-icon>
              <text class="menu-text">{{ item.title }}</text>
              <text class="menu-badge" v-if="item.badge">{{ item.badge }}</text>
            </view>
            <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
          </view>
        </view>
      </view>

      <view class="menu-section">
        <view class="section-title">创作者中心</view>
        <view class="menu-list">
          <view
            class="menu-item"
            v-for="(item, index) in creatorMenus"
            :key="index"
            @click="toPath(item.path)"
          >
            <view class="menu-left">
              <up-icon :name="item.icon" color="#ffffff" size="18"></up-icon>
              <text class="menu-text">{{ item.title }}</text>
            </view>
            <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
          </view>
        </view>
      </view>

      <view class="menu-section">
        <view class="section-title">账号管理</view>
        <view class="menu-list">
          <view
            class="menu-item"
            v-for="(item, index) in accountMenus"
            :key="index"
            @click="toPath(item.path)"
          >
            <view class="menu-left">
              <up-icon :name="item.icon" color="#ffffff" size="18"></up-icon>
              <text class="menu-text">{{ item.title }}</text>
            </view>
            <up-icon name="arrow-right" color="rgba(255,255,255,0.4)" size="16"></up-icon>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import vip from './components/vip.vue'

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

// 我的服务菜单
const serviceMenus = ref([
  {
    title: '私人定制内容',
    icon: 'heart-fill',
    path: '/pages/my/custom-content',
    badge: ''
  },
  {
    title: '订单记录',
    icon: 'list',
    path: '/pages/my/bill',
    badge: ''
  },
  {
    title: '我的收益',
    icon: 'rmb-circle-fill',
    path: '/pages/my/income',
    badge: ''
  },
  {
    title: '冰花充值',
    icon: 'wallet-fill',
    path: '/pages/my/recharge',
    badge: ''
  }
])

// 创作者中心菜单
const creatorMenus = ref([
  {
    title: '创作者认证',
    icon: 'checkmark-circle-fill',
    path: '/pages/my/creator-auth',
    badge: ''
  },
  {
    title: '绿色入驻通道',
    icon: 'star-fill',
    path: '/pages/my/vip-channel',
    badge: ''
  }
])

// 账号管理菜单
const accountMenus = ref([
  {
    title: '社交账号绑定',
    icon: 'link',
    path: '/pages/my/account-bind',
    badge: ''
  },
  {
    title: '反馈与建议',
    icon: 'chat-fill',
    path: '/pages/my/feedback',
    badge: ''
  },
  {
    title: '设置',
    icon: 'setting-fill',
    path: '/pages/my/setup',
    badge: ''
  }
])

const toPath = (url) => {
  if (!url) {
    uni.showToast({
      title: '功能开发中',
      icon: 'none'
    })
    return
  }
  uni.navigateTo({ url })
}

onShow(() => {
  // 获取用户信息
  const userInfo = uni.getStorageSync('user_info')
  if (userInfo && (userInfo.user_id || userInfo.id)) {
    const userId = userInfo.user_id || userInfo.id
    store.getPersonInfo({ id: userId })
  }
})

onMounted(() => {
  console.log('my页面加载完成')
})
</script>

<style lang="scss" scoped>
.my-page {
  min-height: 100vh;
  padding-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}

.right-icons {
  display: flex;
  align-items: center;
}

.content {
  padding: 0 30rpx;
}

// 用户信息卡片
.user-card {
  background: linear-gradient(135deg, rgba(86, 98, 225, 0.2) 0%, rgba(97, 71, 147, 0.2) 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    flex: 1;

    .user-details {
      margin-left: 20rpx;
      flex: 1;

      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        .nickname {
          font-size: 32rpx;
          font-weight: bold;
          color: #ffffff;
        }

        .vip-badge {
          background: linear-gradient(270deg, #7d7256 0%, #ece6d5 100%);
          color: #3a3939;
          font-size: 24rpx;
          padding: 4rpx 12rpx;
          border-radius: 20rpx;
          margin-left: 10rpx;
        }
      }

      .phone {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 8rpx;
      }

      .bio {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.5);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 400rpx;
      }
    }
  }
}

// 资产信息
.assets {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .asset-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    .asset-value {
      font-size: 40rpx;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 10rpx;
    }

    .asset-label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .divider {
    width: 2rpx;
    height: 60rpx;
    background: rgba(255, 255, 255, 0.2);
  }
}

// 功能菜单
.menu-section {
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

      .menu-left {
        display: flex;
        align-items: center;

        .menu-text {
          font-size: 30rpx;
          color: #ffffff;
          margin-left: 20rpx;
        }

        .menu-badge {
          background: #ff4444;
          color: #ffffff;
          font-size: 20rpx;
          padding: 2rpx 10rpx;
          border-radius: 20rpx;
          margin-left: 10rpx;
        }
      }
    }
  }
}
</style>