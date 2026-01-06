<template>
  <view class="social-post">
    <!-- 头部用户信息 -->
    <view class="post-header">
      <view class="user-info">
        <u-avatar :src="postData.avatar" size="40" shape="circle" />
        <view class="user-details">
          <text class="username">{{ postData.username }}</text>
          <text class="timestamp">{{ postData.timestamp }}</text>
        </view>
      </view>
      <view class="header-actions">
        <u-button type="primary" size="mini" :custom-style="{
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
          borderRadius: '20px',
          padding: '0 16px',
          height: '32px',
          fontSize: '14px'
        }">
          关注
        </u-button>
        <u-icon name="more-dot-fill" size="20" color="#fff" style="margin-left: 12px;" />
      </view>
    </view>

    <!-- 帖子文本内容 -->
    <view class="post-content" v-if="postData.content">
      <text class="content-text">{{ postData.content }}</text>
    </view>

    <!-- 主图片 -->
    <view class="post-image" v-if="postData.image">
      <u-image :src="postData.image" width="100%" height="260rpx" radius="20rpx"
        mode="aspectFill" />
        <u-image :src="postData.image" width="100%" height="260rpx"  radius="20rpx"
        mode="aspectFill" />
		<u-image :src="postData.image" width="100%" height="260rpx"  radius="20rpx"
		mode="aspectFill" />
    </view>

    <!-- 互动数据 -->
    <view class="post-actions">
      <view class="action-item">
        <u-icon name="share" size="18" color="#fff" />
        <text class="action-count">{{ postData.shares }}</text>
      </view>
      <view class="action-item">
        <view class="action-item">
          <u-icon name="thumb-up" size="18" color="#fff" />
          <text class="action-count">{{ postData.likes }}</text>
        </view>
        <view class="action-item">
          <u-icon name="chat" size="18" color="#fff" />
          <text class="action-count">{{ postData.comments }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  postData: {
    type: Object,
    default: () => ({
      avatar: '/static/avatar-dog.jpg',
      username: 'Mask',
      timestamp: '2025-05-05 18:00:00',
      content: '这里是标题内容 (20个字, 可为空)',
      image: '/static/post-image.jpg',
      shares: 224,
      likes: 2488,
      comments: 121
    })
  }
})
</script>

<style lang="scss" scoped>
@import '@/static/css/style.scss';

.social-post {
  background-color: $dark-bg;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin: $spacing-md;
  box-shadow: $shadow-md;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-md;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.user-details {
  margin-left: $spacing-md;
  display: flex;
  flex-direction: column;
}

.username {
  color: $white;
  font-size: $font-size-md;
  font-weight: 500;
  line-height: 1.2;
}

.timestamp {
  color: $white-6;
  font-size: $font-size-xs;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.post-content {
  margin-bottom: $spacing-md;
}

.content-text {
  color: $white;
  font-size: $font-size-sm;
  line-height: 1.4;
}

.post-image {
  margin-bottom: $spacing-lg;
  display: flex;
}

.post-actions {
  display: flex;
  gap: $spacing-xl;
  justify-content: space-between;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-count {
  color: $white;
  font-size: $font-size-sm;
  font-weight: 500;
}
</style>
