<template>
  <view class="shortvid-container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部固定区域 -->
    <view class="top-fixed">
      <!-- 状态栏内容 -->
      <view class="status-bar-content" :style="{ paddingTop: statusBarHeight + 'px', height: (statusBarHeight + 44) + 'px' }">
        <text class="time">9:41</text>
        <view class="status-icons">
          <image class="status-icon" :src="statusBarIcon" mode="aspectFit"></image>
        </view>
      </view>
      
      <!-- 导航栏 -->
      <view class="navbar">
        <view class="back-btn" @click="handleBack">
          <up-icon name="arrow-left" size="10" color="#292929"></up-icon>
        </view>
      </view>
    </view>
    
    <!-- 视频播放区域 -->
    <view class="video-area">
      <!-- 封面图片 -->
      <view class="cover-container">
        <image class="cover-image" :src="coverImage" mode="aspectFill"></image>
      </view>
      <!-- 渐变蒙层 -->
      <view class="gradient-overlay"></view>
    </view>
    
    <!-- 底部信息区域 -->
    <view class="bottom-info">
      <!-- 演员信息 -->
      <view class="actors-section">
        <view class="actor-item" v-for="(actor, index) in actors" :key="index">
          <view class="actor-info">
            <image class="actor-avatar" :src="actor.avatar" mode="aspectFill"></image>
            <text class="actor-name">{{ actor.name }}</text>
          </view>
        </view>
      </view>
      
      <!-- 进度条 -->
      <view class="progress-section">
        <view class="progress-track">
          <view class="progress-filled"></view>
          <view class="progress-thumb">
            <view class="thumb-circle"></view>
          </view>
        </view>
      </view>
      
      <!-- 标题栏 -->
      <view class="title-bar">
        <view class="title-left">
          <text class="title-text">{{ title }}</text>
          <view class="episode-badge">
            <text class="episode-text">{{ episodeCount }}集全</text>
          </view>
        </view>
        <view class="title-right" @click="handleSelectEpisode">
          <text class="select-text">选集</text>
          <up-icon name="arrow-right" size="20" color="#292929"></up-icon>
        </view>
      </view>
    </view>
    
    <!-- iOS 底部指示器 -->
    <view class="ios-home-indicator">
      <view class="indicator-line"></view>
    </view>
    
    <!-- 选集弹窗 -->
    <EpisodeSelector
      v-model="showEpisodeSelector"
      :total-episodes="episodeCount"
      :current-episode="currentEpisodeIndex"
      @select="handleEpisodeSelect"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import EpisodeSelector from './components/EpisodeSelector.vue'

// 状态栏高度
const statusBarHeight = ref(44)

// 图片资源
const coverImage = ref('/static/images/shortvid-cover.png')
const statusBarIcon = ref('/static/images/status-bar-icons.svg')

// 演员数据
const actors = ref([
  {
    name: '小可爱',
    avatar: '/static/images/actor-avatar.png'
  },
  {
    name: '小可爱',
    avatar: '/static/images/actor-avatar.png'
  }
])

// 标题和集数
const title = ref('你是我的遥不可及')
const episodeCount = ref(87)
const currentEpisodeIndex = ref(2) // 当前播放的集数索引

// 选集弹窗显示状态
const showEpisodeSelector = ref(false)

// 返回按钮
const handleBack = () => {
  uni.navigateBack()
}

// 选集按钮
const handleSelectEpisode = () => {
  showEpisodeSelector.value = true
}

// 选择集数
const handleEpisodeSelect = (episode) => {
  currentEpisodeIndex.value = episode.id
  console.log('选择集数:', episode)
  // TODO: 切换播放对应的集数
}

onLoad(() => {
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 44
})
</script>

<style lang="scss" scoped>
.shortvid-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 40px;
}

/* 状态栏占位 */
.status-bar {
  width: 100%;
}

/* 顶部固定区域 */
.top-fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

/* 状态栏内容 */
.status-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  padding-bottom: 0;
  
  .time {
    font-family: 'SF Pro Text', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #ffffff;
    letter-spacing: -0.165px;
  }
  
  .status-icons {
    width: 67px;
    height: 11.5px;
    
    .status-icon {
      width: 100%;
      height: 100%;
    }
  }
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px;
  height: 48px;
  
  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 999px;
  }
}

/* 视频播放区域 */
.video-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.cover-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
    pointer-events: none;
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
}

/* 底部信息区域 */
.bottom-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 16px;
  padding-bottom: 21px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-sizing: border-box;
}

/* 演员区域 */
.actors-section {
  display: flex;
  gap: 20px;
  align-items: center;
}

.actor-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.actor-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.actor-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.actor-name {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 进度条 */
.progress-section {
  position: relative;
  height: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-track {
  position: relative;
  width: 293px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin-left: 25px;
}

.progress-filled {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #ffffff;
  border-radius: 2px;
  width: 70px;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  left: 64px;
  
  .thumb-circle {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 50%;
  }
}

/* 标题栏 */
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 12px 13px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.title-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.episode-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
}

.episode-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #656565;
  white-space: nowrap;
}

.title-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.select-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.9);
  white-space: nowrap;
  margin-right: 2px;
}

/* iOS 底部指示器 */
.ios-home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 135px;
  height: 5px;
  z-index: 10;
}

.indicator-line {
  width: 100%;
  height: 100%;
  background-color: rgba(61, 61, 61, 0.3);
  border-radius: 100px;
}
</style>
