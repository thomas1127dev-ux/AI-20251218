<template>
  <view class="episode-modal" v-if="modelValue" @click.stop>
    <view class="mask" @click="handleClose"></view>
    <view class="popup-content" @click.stop>
      <!-- 标题栏 -->
      <view class="popup-header">
        <text class="popup-title">选集</text>
        <view class="close-btn" @click="handleClose">
          <up-icon name="close" size="20" color="#292929"></up-icon>
        </view>
      </view>
      
      <!-- 集数网格 -->
      <view class="episode-grid">
        <view
          v-for="(episode, index) in episodes"
          :key="index"
          class="episode-item"
          :class="{ active: episode.isActive }"
          @click="handleSelectEpisode(episode)"
        >
          <text 
            class="episode-text" 
            :class="{ 
              active: episode.isActive,
              pilot: episode.id === 0
            }"
          >
            {{ episode.label }}
          </text>
          <image
            v-if="episode.isActive"
            class="episode-icon"
            :src="barChartIcon"
            mode="aspectFit"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  totalEpisodes: {
    type: Number,
    default: 87
  },
  currentEpisode: {
    type: Number,
    default: 2
  }
})

const emits = defineEmits(['update:modelValue', 'select', 'close'])

// 图标资源
const barChartIcon = ref('/static/images/episode-bar-chart-icon.svg')

// 生成集数列表
const episodes = computed(() => {
  const list = []
  
  // 先导片
  list.push({
    id: 0,
    label: '先导片',
    isActive: props.currentEpisode === 0
  })
  
  // 正片集数
  for (let i = 1; i <= props.totalEpisodes; i++) {
    list.push({
      id: i,
      label: i.toString(),
      isActive: props.currentEpisode === i
    })
  }
  
  return list
})

// 选择集数
const handleSelectEpisode = (episode) => {
  emits('select', episode)
  emits('update:modelValue', false)
}

// 关闭弹窗
const handleClose = () => {
  emits('update:modelValue', false)
  emits('close')
}
</script>

<style lang="scss" scoped>
.episode-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 6px;
  width: 343px;
  max-height: 80vh;
  min-height: 301px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.popup-title {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.9);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.episode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 18px 12px;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
  
  /* 确保5列布局 */
  &::after {
    content: '';
    flex: auto;
  }
}

.episode-item {
  position: relative;
  width: 49px;
  height: 49px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
  
  &.active {
    background-color: #fdd687;
  }
  
  &:active {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

.episode-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  
  &.pilot {
    font-size: 12px;
    line-height: 18px;
  }
  
  &.active {
    font-weight: 500;
    color: #720000;
  }
}

.episode-icon {
  position: absolute;
  left: 18.5px;
  top: 35px;
  width: 12px;
  height: 12px;
}
</style>
