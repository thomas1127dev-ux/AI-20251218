<template>
  <!-- :style="{ paddingTop: statusBar + 'px'}" -->
  <scroll-view
    scroll-y="true"
    style="height: 100vh"
    refresher-enabled="true"
    refresher-threshold="80"
    refresher-default-style="black"
    refresher-background="black"
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="onRefresh"
    @refresherrestore="onRestore"
  >
    <!-- 顶部内容 -->
    <up-navbar
      @rightClick="handlClickBack"
      :autoBack="true"
      bg-color="transparent"
      left-icon-color="#fff"
      :fixed="false"
    ></up-navbar>
    <!-- <view class="back" @click="handlClickBack">
				<up-icon name="arrow-left" size="18" color="#fff"></up-icon>
			</view> -->
    <!-- 视频 -->
    <video-player
      :detail="detail"
      @dataChanged="handleDataChanged"
    ></video-player>

    <!-- 广告 -->
    <advertisement></advertisement>

    <up-tabs
      :list="tabs"
      :activeStyle="{
        color: '#fff',
        fontWeight: 'bold',
        transform: 'scale(1.05)',
      }"
      :inactiveStyle="{
        color: 'rgba(255,255,255, .5)',
        transform: 'scale(1)',
      }"
      lineColor="#fff"
      @click="handleClickTab"
    ></up-tabs>
    <!-- 顶部内容结束 -->

    <!-- 简介 -->
    <introduction
      v-show="currentTab === 0"
      :detail="detail"
      ref="introductionRef"
    ></introduction>

    <!-- 评论 -->
    <comment-page
      v-show="currentTab === 1"
      :id="id"
      ref="commentRef"
      class="comment-page"
    ></comment-page>

    <!-- 转发弹窗 -->
    <forwardMenu v-model="showForward" :forwardInfo="commentInfo"></forwardMenu>
  </scroll-view>

  <!-- 固定在底部的评论输入框 -->
  <view class="comment-btn" v-show="currentTab === 1">
    <up-input
      placeholder="输入评论内容"
      border="surround"
      shape="circle"
      :customStyle="{
        backgroundColor: '#fff',
      }"
      v-model="commenValue"
    ></up-input>

    <up-button
      text="发表"
      shape="circle"
      class="custom-style"
      :disabled="commenValue === ''"
      @click="publish"
    ></up-button>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";

import { onReady, onLoad, onShow } from "@dcloudio/uni-app";

import videoPlayer from "@/components/video-player/index.vue";
import advertisement from "@/components/advertisement/advertisement.vue";
import Introduction from "./components/Introduction.vue";
import CommentPage from "./components/CommentPage.vue";
import forwardMenu from "@/components/tsp-video/forward-menu/forward-menu.vue";

// import { contentDetail } from '@/api/content.js';
import { addCommentContent } from "@/api/community.js";
import { contentDetail } from "@/api/common";

const commentRef = ref();
const introductionRef = ref();

const commentInfo = ref();
const showForward = ref(false);
const statusBar = ref(20);

const id = ref(0);

const pagingRef = ref(null);
const detail = ref({});
const refresherTriggered = ref(false);

onReady(() => {
  /* 监听打开转发*/
  uni.$on("updateOpenForward", (data) => {
    commentInfo.value = data.item;
    showForward.value = true;
  });
});
onLoad((options) => {
  statusBar.value = uni.getWindowInfo().statusBarHeight;
  id.value = options.id;
  // 获取视频数据
  queryList();
});

onShow(() => {
  console.log("video页面显示，触发refresh-userinfo事件");
  uni.$emit("refresh-userinfo");
});

const currentTab = ref(0);
const tabs = ref([
  {
    name: "简介",
  },
  {
    name: "评论",
  },
]);

const commenValue = ref("");

const handleClickTab = (e) => {
  currentTab.value = e.index;
};
const handlClickBack = (e) => {
  uni.navigateBack();
};

const queryList = () => {
  contentDetail(id.value).then((res) => {
    console.log("res", res);
    if (res.code === 200) {
      detail.value = res.data;
    }
  });
};

// 下拉刷新
const onRefresh = () => {
  console.log("下拉刷新");
  refresherTriggered.value = true;

  // 重新获取视频详情数据
  contentDetail(id.value)
    .then((res) => {
      console.log("刷新数据:", res);
      if (res.code === 200) {
        detail.value = res.data;
        // 通知子组件数据已更新
        handleDataChanged();

        // 刷新猜你喜欢数据
        if (introductionRef.value && introductionRef.value.refreshGuessLike) {
          console.log("刷新猜你喜欢数据");
          introductionRef.value
            .refreshGuessLike()
            .then(() => {
              // 猜你喜欢数据刷新完成后，立即结束刷新状态
              console.log("猜你喜欢数据刷新完成，结束下拉刷新");
              refresherTriggered.value = false;
            })
            .catch((err) => {
              console.error("猜你喜欢数据刷新失败:", err);
              // 即使失败也要结束刷新状态
              refresherTriggered.value = false;
            });
        } else {
          // 如果没有猜你喜欢组件，延迟结束刷新状态
          setTimeout(() => {
            refresherTriggered.value = false;
          }, 500);
        }
      } else {
        // 视频详情获取失败，结束刷新状态
        refresherTriggered.value = false;
      }
    })
    .catch((err) => {
      console.error("刷新失败:", err);
      // 即使失败也要结束刷新状态
      refresherTriggered.value = false;
    });
};

// 刷新恢复
const onRestore = () => {
  console.log("刷新恢复");
  refresherTriggered.value = false;
};

// 处理子组件数据变化事件
const handleDataChanged = () => {
  // 重新获取数据
  queryList();
};

const publish = async () => {
  const params = {
    target_id: id.value,
    content: commenValue.value,
    type: "long",
    parent_comment_id: 0,
  };
  const res = await addCommentContent(params);
  console.log("res", res);
  if (res.code === 201) {
    commentRef.value.reload();
    commenValue.value = "";
  }
};
</script>

<style lang="scss" scoped>
.comment-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 30rpx;
  background: linear-gradient(175.26deg, #311f4f 14.46%, #1e1b33 122.11%);
  display: flex;
  align-items: center;
  z-index: 999;
  /* 添加安全区域适配 */
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));

  .u-input--circle {
    padding: 3px 20rpx !important;
  }
}

.back {
  border-radius: 50%;
  padding: 10rpx;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 80rpx;
  left: 30rpx;
  z-index: 99;
}

.custom-style {
  width: 100rpx;
  height: 64rpx;
  background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
  color: #fff;
  border: none;
  margin-left: 20rpx;
}

.comment-page {
  padding-bottom: 120rpx; /* 为固定的输入框留出空间 */
}
</style>
