<template>
  <z-paging-swiper
    ref="pagingRef"
    :loading-more-enabled="true"
    :swiper-style="swiperStyle"
    @query="queryList"
    v-model="dataList"
  >
    <template #top>
      <!-- 导航栏 -->
      <view class="navbar" :style="navbarStyle">
        <view class="navbar-content">
          <view class="navbar-left" @click="goBack" v-if="showBack">
            <text class="back-icon">‹</text>
          </view>
          <view class="navbar-center">
            <text class="navbar-title">{{ title }}</text>
          </view>
          <view class="navbar-right" @click="handleRightClick" v-if="showRight">
            <text class="right-text">{{ rightText }}</text>
          </view>
        </view>
      </view>

      <!-- Tab 切换 -->
      <view class="tabs-container" :style="tabsContainerStyle">
        <scroll-view
          class="tabs-scroll"
          scroll-x="true"
          :show-scrollbar="false"
          :scroll-into-view="'tab-' + currentTab"
        >
          <view class="tabs-wrapper">
            <view
              v-for="(tab, index) in tabList"
              :key="index"
              :id="'tab-' + index"
              class="tab-item"
              :class="{ 'tab-active': currentTab === index }"
              :style="getTabItemStyle(index)"
              @click="switchTab(index)"
            >
              <text class="tab-text" :style="getTabTextStyle(index)">{{
                tab.name
              }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </template>

    <!-- Swiper 内容 -->
    <swiper
      class="swiper-container"
      :style="swiperContainerStyle"
      :current="currentTab"
      :duration="300"
      @animationfinish="onSwiperAnimationFinish"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(tab, index) in tabList"
        :key="index"
        class="swiper-item"
      >
        <view class="content-container">
          <!-- 自定义内容插槽 -->
          <slot
            :name="'content-' + index"
            :tab="tab"
            :index="index"
            :data="getTabData(index)"
          >
            <!-- 默认内容 -->
            <view class="default-content">
              <view class="content-header">
                <text class="content-title">{{ tab.name }}</text>
                <text class="content-subtitle">{{ tab.subtitle || "" }}</text>
              </view>

              <view class="content-list">
                <view
                  v-for="(item, itemIndex) in getTabData(index)"
                  :key="itemIndex"
                  class="content-item"
                  @click="handleItemClick(item, index)"
                >
                  <view class="item-content">
                    <text class="item-title">{{
                      item.title || item.name || "默认标题"
                    }}</text>
                    <text class="item-desc">{{
                      item.description || item.desc || "默认描述"
                    }}</text>
                  </view>
                  <view class="item-arrow">›</view>
                </view>
              </view>
            </view>
          </slot>
        </view>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

// Props 定义
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: "自适应轮播",
  },
  // Tab 列表
  tabList: {
    type: Array,
    default: () => [
      { name: "推荐", key: "recommend" },
      { name: "热门", key: "hot" },
      { name: "最新", key: "latest" },
    ],
  },
  // 当前激活的 tab
  currentTab: {
    type: Number,
    default: 0,
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true,
  },
  // 是否显示右侧按钮
  showRight: {
    type: Boolean,
    default: false,
  },
  // 右侧按钮文字
  rightText: {
    type: String,
    default: "更多",
  },
  // 数据加载函数
  loadData: {
    type: Function,
    default: null,
  },
  // 每页数据量
  pageSize: {
    type: Number,
    default: 20,
  },
});

// Emits 定义
const emit = defineEmits([
  "tabChange",
  "itemClick",
  "rightClick",
  "backClick",
  "dataLoaded",
]);

// 响应式数据
const pagingRef = ref();
const dataList = ref([]);
const currentTabIndex = ref(props.currentTab);
const screenInfo = ref({
  width: 375,
  height: 667,
  statusBarHeight: 20,
  navBarHeight: 44,
});

// 计算属性 - 屏幕适配样式
const swiperStyle = computed(() => {
  return {
    height: "100vh",
    width: "100%",
  };
});

const navbarStyle = computed(() => {
  return {
    height: `${
      screenInfo.value.navBarHeight + screenInfo.value.statusBarHeight
    }px`,
    paddingTop: `${screenInfo.value.statusBarHeight}px`,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 1000,
  };
});

const tabsContainerStyle = computed(() => {
  return {
    height: "44px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(5px)",
    position: "relative",
    zIndex: 999,
  };
});

const swiperContainerStyle = computed(() => {
  return {
    height: `calc(100vh - ${
      screenInfo.value.navBarHeight + screenInfo.value.statusBarHeight + 44
    }px)`,
    width: "100%",
  };
});

// Tab 样式计算
const getTabItemStyle = (index) => {
  const isActive = currentTabIndex.value === index;
  return {
    padding: "0 20rpx",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
    borderRadius: "22px",
    margin: "0 10rpx",
    transition: "all 0.3s ease",
  };
};

const getTabTextStyle = (index) => {
  const isActive = currentTabIndex.value === index;
  return {
    fontSize: isActive ? "16px" : "14px",
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
    transition: "all 0.3s ease",
  };
};

// 获取当前 tab 的数据
const getTabData = (tabIndex) => {
  const tabKey = props.tabList[tabIndex]?.key || tabIndex;
  return dataList.value.filter((item) => item.tabKey === tabKey) || [];
};

// 方法定义
const switchTab = (index) => {
  if (index === currentTabIndex.value) return;

  currentTabIndex.value = index;
  emit("tabChange", {
    index,
    tab: props.tabList[index],
  });

  // 重新加载数据
  nextTick(() => {
    pagingRef.value?.reload();
  });
};

const onSwiperAnimationFinish = (e) => {
  const current = e.detail.current;
  if (current !== currentTabIndex.value) {
    currentTabIndex.value = current;
    emit("tabChange", {
      index: current,
      tab: props.tabList[current],
    });
  }
};

const onSwiperChange = (e) => {
  // 可以在这里添加滑动过程中的逻辑
};

const queryList = async (pageNo, pageSize) => {
  try {
    if (props.loadData && typeof props.loadData === "function") {
      const currentTab = props.tabList[currentTabIndex.value];
      const result = await props.loadData({
        pageNo,
        pageSize,
        tab: currentTab,
        tabIndex: currentTabIndex.value,
      });

      if (result && result.data) {
        pagingRef.value?.complete(result.data);
        emit("dataLoaded", {
          tab: currentTab,
          index: currentTabIndex.value,
          data: result.data,
        });
      } else {
        pagingRef.value?.complete([]);
      }
    } else {
      // 默认模拟数据
      const mockData = generateMockData(pageNo, pageSize);
      pagingRef.value?.complete(mockData);
    }
  } catch (error) {
    console.error("数据加载失败:", error);
    pagingRef.value?.complete([]);
  }
};

const generateMockData = (pageNo, pageSize) => {
  const data = [];
  const currentTab = props.tabList[currentTabIndex.value];

  for (let i = 0; i < pageSize; i++) {
    data.push({
      id: `${currentTab.key}_${pageNo}_${i}`,
      title: `${currentTab.name}内容 ${(pageNo - 1) * pageSize + i + 1}`,
      description: `这是${currentTab.name}的第${
        (pageNo - 1) * pageSize + i + 1
      }条内容描述`,
      tabKey: currentTab.key,
      image: `/static/images/mock_${(i % 5) + 1}.png`,
    });
  }

  return data;
};

const handleItemClick = (item, tabIndex) => {
  emit("itemClick", {
    item,
    tabIndex,
    tab: props.tabList[tabIndex],
  });
};

const handleRightClick = () => {
  emit("rightClick");
};

const goBack = () => {
  emit("backClick");
  uni.navigateBack();
};

// 获取系统信息
const getSystemInfo = () => {
  uni.getSystemInfo({
    success: (res) => {
      screenInfo.value = {
        width: res.windowWidth,
        height: res.windowHeight,
        statusBarHeight: res.statusBarHeight || 20,
        navBarHeight: 44,
      };
    },
  });
};

// 生命周期
onMounted(() => {
  getSystemInfo();
});

// 暴露方法给父组件
defineExpose({
  switchTab,
  reload: () => pagingRef.value?.reload(),
  complete: (data) => pagingRef.value?.complete(data),
  getCurrentTab: () => currentTabIndex.value,
  getTabData,
});
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .navbar-content {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 30rpx;

    .navbar-left {
      width: 60rpx;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;

      .back-icon {
        font-size: 24px;
        color: #ffffff;
        font-weight: bold;
      }
    }

    .navbar-center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .navbar-title {
        font-size: 18px;
        color: #ffffff;
        font-weight: bold;
      }
    }

    .navbar-right {
      width: 60rpx;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;

      .right-text {
        font-size: 14px;
        color: #ffffff;
      }
    }
  }
}

.tabs-container {
  position: fixed;
  top: 64px; // navbar height + status bar
  left: 0;
  right: 0;
  z-index: 999;

  .tabs-scroll {
    height: 100%;
    white-space: nowrap;

    .tabs-wrapper {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 20rpx;

      .tab-item {
        flex-shrink: 0;
        position: relative;

        &.tab-active {
          &::after {
            content: "";
            position: absolute;
            bottom: 8rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background: linear-gradient(90deg, #ff6b6b, #ffa500);
            border-radius: 2rpx;
          }
        }

        .tab-text {
          white-space: nowrap;
        }
      }
    }
  }
}

.swiper-container {
  width: 100%;

  .swiper-item {
    height: 100%;
    overflow: hidden;

    .content-container {
      height: 100%;
      overflow-y: auto;
      padding: 20rpx;

      .default-content {
        .content-header {
          margin-bottom: 30rpx;

          .content-title {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            margin-bottom: 10rpx;
          }

          .content-subtitle {
            font-size: 14px;
            color: #666666;
          }
        }

        .content-list {
          .content-item {
            display: flex;
            align-items: center;
            padding: 30rpx 0;
            border-bottom: 1rpx solid #f0f0f0;

            &:last-child {
              border-bottom: none;
            }

            .item-content {
              flex: 1;

              .item-title {
                display: block;
                font-size: 16px;
                color: #333333;
                margin-bottom: 10rpx;
                font-weight: 500;
              }

              .item-desc {
                font-size: 14px;
                color: #666666;
                line-height: 1.4;
              }
            }

            .item-arrow {
              width: 40rpx;
              height: 40rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #cccccc;
              font-size: 20px;
            }
          }
        }
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 750rpx) {
  .navbar .navbar-content {
    padding: 0 20rpx;
  }

  .tabs-container .tabs-scroll .tabs-wrapper {
    padding: 0 10rpx;
  }

  .swiper-container .swiper-item .content-container {
    padding: 15rpx;
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .default-content {
    .content-header {
      .content-title {
        color: #ffffff;
      }

      .content-subtitle {
        color: #cccccc;
      }
    }

    .content-list .content-item {
      border-bottom-color: #333333;

      .item-content {
        .item-title {
          color: #ffffff;
        }

        .item-desc {
          color: #cccccc;
        }
      }

      .item-arrow {
        color: #666666;
      }
    }
  }
}
</style>
