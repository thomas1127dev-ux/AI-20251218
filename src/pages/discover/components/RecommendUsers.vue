<template>
  <view class="recommend-users-page">
    <scroll-view scroll-y="true" class="user-scroll" @scrolltolower="loadMore">
      <!-- 用户列表 - 网格布局 -->
      <view v-if="userList.length" class="user-grid">
        <view
          v-for="item in userList"
          :key="item.id"
          class="user-card"
          @click="openChat(item)"
        >
          <image class="user-avatar" :src="getAvatarUrl(item.avatar)" mode="aspectFill" />
          <view class="user-name">{{ item.name || item.user_nickname }}</view>
          <view class="user-info">
            <text class="user-tag" v-if="item.archetype_tags">{{ item.archetype_tags }}</text>
          </view>
          <view class="user-personality" v-if="item.personality_tags && item.personality_tags.length">
            <text class="tag" v-for="(tag, index) in item.personality_tags.slice(0, 2)" :key="index">
              {{ tag }}
            </text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="user-empty">
        <view class="empty-icon">👥</view>
        <text class="empty-text">暂无推荐用户</text>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-more">
        <up-loading-icon mode="circle" color="#ffffff" size="20"></up-loading-icon>
        <text class="loading-text">加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getOwnedClones } from '@/api/clone.js';
import { userinfoStore } from '@/store/userinfos.js';
import { getAvatarUrl } from '@/utils/avatar.js';

const store = userinfoStore();
const userList = ref([]);
const loading = ref(false);
const hasMore = ref(true);

// 加载用户列表
const loadUserList = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    const res = await getOwnedClones();
    console.log('推荐用户列表:', res);

    if (res.code === 200 && res.data) {
      userList.value = res.data;
      hasMore.value = false; // 暂时不支持分页
    }
  } catch (error) {
    console.error('获取推荐用户失败:', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    loadUserList();
  }
};

// 打开聊天
const openChat = (user) => {
  console.log('打开聊天:', user);

  // 设置 personInfo 到 store
  store.setPersonInfo(user);

  // 跳转到对话页面
  uni.navigateTo({
    url: '/pages/my/dialogue'
  });
};

onMounted(() => {
  loadUserList();
});
</script>

<style lang="scss" scoped>
.recommend-users-page {
  height: 100%;
  background: #000;
}

.user-scroll {
  height: 100%;
  padding: 20rpx;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.user-card {
  background: #1a1a1a;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

  // #ifdef H5
  cursor: pointer;
  // #endif

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }

  .user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-bottom: 16rpx;
  }

  .user-name {
    color: #fff;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
    text-align: center;
  }

  .user-info {
    margin-bottom: 12rpx;

    .user-tag {
      color: rgba(255, 255, 255, 0.6);
      font-size: 24rpx;
      background: rgba(255, 255, 255, 0.1);
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
    }
  }

  .user-personality {
    display: flex;
    gap: 8rpx;
    flex-wrap: wrap;
    justify-content: center;

    .tag {
      color: rgba(255, 255, 255, 0.6);
      font-size: 22rpx;
      background: rgba(86, 98, 225, 0.2);
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
    }
  }
}

.user-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 24rpx;
    opacity: 0.5;
  }

  .empty-text {
    color: rgba(255, 255, 255, 0.4);
    font-size: 28rpx;
  }
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;

  .loading-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 24rpx;
    margin-left: 16rpx;
  }
}
</style>
