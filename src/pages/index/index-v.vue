<template>
  <view class="tabs">
    <!-- #ifndef MP-WEIXIN -->
    <swiper
      class="tab-box"
      ref="swiper1"
      :duration="300"
      :current="tabIndex"
      @transition="onswiperscroll"
      @animationfinish="animationfinish"
      @onAnimationEnd="animationfinish"
      @change="onswiperchange"
    >
      <swiper-item
        class="swiper-item"
        v-for="(page, index) in tabList"
        :key="index"
      >
        <view style="flex: 1; position: relative">
          <tabsPage
            :ref="'page' + index"
            :pageIndex="index"
            :tabIndex="tabIndex"
            :tabItem="page"
            :screenHeight="screenHeight"
            :statusBarHeight="statusBarHeight"
          ></tabsPage>
        </view>
      </swiper-item>
    </swiper>
    <!-- #endif -->

    <!-- 使用自定义swiper解决  官方的swiper嵌套swiper在微信小程序上ios手机切换会隐藏界面元素的问题 -->
    <!-- #ifdef MP-WEIXIN -->
    <esc-swiper
      :autoplay="false"
      :current.sync="tabIndex"
      :width="screenWidth"
      :height="screenHeight"
      :itemWidth="750"
      :itemHeight="screenHeight"
      :size="tabList.length"
      @change="escChange"
      ref="escRef"
    >
      <esc-swiper-item
        v-for="(page, index) in tabList"
        :index="index"
        :key="index"
      >
        <view style="flex: 1; position: relative">
          <tabsPage
            :ref="'page' + index"
            :pageIndex="index"
            :tabIndex="tabIndex"
            :tabItem="page"
            :screenHeight="screenHeight"
            :statusBarHeight="statusBarHeight"
          ></tabsPage>
        </view>
      </esc-swiper-item>
    </esc-swiper>
    <!-- #endif -->

    <!-- 解决app端视频滑动进度条和swiper冲突滑动遮罩图层 -->
    <!-- #ifdef APP-PLUS -->
    <view
      class="vodProgress"
      @touchmove="touchmoveSlider"
      @touchstart="touchmoveSlider"
      @touchend="touchendSlider"
      v-if="tabIndex != 0"
    ></view>
    <!-- #endif -->

    <view
      class="head"
      :style="{ top: statusBarHeight + 'px', width: screenWidth + 'px' }"
    >
      <view
        class="head-item"
        @click="tabChange(index)"
        v-for="(item, index) in tabList"
        :key="index"
      >
        <text
          class="head-item-text"
          :class="tabIndex == index ? 'head-item-textActive' : ''"
          >{{ item.name }}</text
        >
        <view class="head-item-sign" v-if="tabIndex == index"></view>
      </view>
      <view class="head-operate">
        <!-- <image src="/static/tsp-icon/home-menu.png" class="head-operate-icon"></image> -->
        <span></span>
        <image
          src="/static/tsp-icon/home-search.png"
          class="head-operate-icon"
          @click="handleJump2Search"
        >
        </image>
      </view>
    </view>

    <!-- 评论弹窗 -->
    <comment-popup
      ref="commentRef"
      v-model="commentVisible"
      :commentInfo="commentInfo"
      @submitComment="submitComment"
      @updateCommentCount="handleCommentCountUpdate"
    />

    <!-- 转发弹窗 -->
    <forwardMenu v-model="showForward" :forwardInfo="commentInfo"></forwardMenu>
  </view>
</template>
<script>
/*
 * tabVideo-v 纯vue页面样式
 */
const deviceInfo = uni.getSystemInfoSync();
import tabsPage from "./tabs/tabs-page.vue";
import commentPopup from "@/components/tsp-video/comment/comment-popup.vue";
import forwardMenu from "@/components/tsp-video/forward-menu/forward-menu.vue";
// #ifdef MP-WEIXIN
import escSwiper from "@/components/tsp-video/esc-ui/components/esc-swiper/index.vue";
import escSwiperItem from "@/components/tsp-video/esc-ui/components/esc-swiper-item/index.vue";
// #endif
import { addContentComment } from "@/api/common";

export default {
  components: {
    tabsPage,
    commentPopup,
    forwardMenu,
    // #ifdef MP-WEIXIN
    escSwiper,
    escSwiperItem,
    // #endif
  },
  data() {
    return {
      statusBarHeight: deviceInfo.statusBarHeight,
      screenWidth: deviceInfo.screenWidth || 0, //屏幕的宽度
      screenHeight: deviceInfo.screenHeight, //屏幕的高度
      tabList: [
        {
          id: "recommend",
          name: "推荐",
        },
        {
          id: "follow",
          name: "关注",
        },
        {
          id: "latest",
          name: "最新",
        },
      ],
      tabIndex: 0,
      pageList: [],
      tapOpen: false,
      commentVisible: false, //是否显示评论弹窗
      commentInfo: {},
      openVodCommentIndex: null, //已经打开视频评论加载的下标
      showForward: false, //是否显示转发弹窗
    };
  },
  onReady() {
    for (var i = 0; i < this.tabList.length; i++) {
      let item = this.$refs["page" + i];
      if (Array.isArray(item)) {
        this.pageList.push(item[0]);
      } else {
        this.pageList.push(item);
      }
    }
    this.changeSwitchTab(this.tabIndex);

    /* 监听打开评论*/
    uni.$on("updateOpenComment", (data) => {
      this.commentInfo = data.item;
      this.commentVisible = true;
      this.$nextTick(() => {
        if (this.openVodCommentIndex != data.vodCurIndex) {
          this.openVodCommentIndex = data.vodCurIndex;
          this.$refs.commentRef.loadData(); //调用评论组件的加载方法
        }
      });
    });

    /* 监听打开转发*/
    uni.$on("updateOpenForward", (data) => {
      this.commentInfo = data.item;
      this.showForward = true;
    });
  },
  onShow() {
    /* 播放视频 */
    this.$nextTick(() => {
      if (
        this.pageList.length > 0 &&
        this.pageList[this.tabIndex].firstLoaded
      ) {
        this.pageList[this.tabIndex].showPlay();
      }
    });
  },
  onHide() {
    /* 暂停视频 */
    this.$nextTick(() => {
      if (
        this.pageList.length > 0 &&
        this.pageList[this.tabIndex].firstLoaded
      ) {
        this.pageList[this.tabIndex].hidePause();
      }
    });
  },
  methods: {
    tabChange(index) {
      this.tabIndex = index;
      this.tapOpen = true;
      if (this.$refs.escRef) {
        this.$refs.escRef.setCurrent(index);
      }
      this.changeSwitchTab(index);
    },
    changeSwitchTab(index) {
      this.$nextTick(() => {
        this.tapOpen = false;
        if (!this.pageList[this.tabIndex].firstLoaded) {
          this.pageList[this.tabIndex].loadTabData();
        }
      });
    },
    /* 必须存在，否则animationfinish的下标会失效 */
    onswiperchange(e) {
      let index = e.detail.current;
      this.tabIndex = index;
      if (!this.tapOpen) {
        this.changeSwitchTab(index);
      }
    },
    escChange(e) {
      let index = e;
      this.tabIndex = index;
      if (!this.tapOpen) {
        this.changeSwitchTab(index);
      }
    },
    /* 评论组件内容回调 */
    async submitComment(val, item) {
      console.log(val, item);
      const params = {
        type: "short",
        tabs: "recommend",
        target_id: this.commentInfo.id,
        parent_comment_id: item.id || 0,
        content: val.text,
      };
      const res = await addContentComment(params);
      console.log("res", res);
      if (res.code === 201) {
        // 重新加载评论列表，保持展开状态
        this.$nextTick(() => {
          if (this.$refs.commentRef) {
            this.$refs.commentRef.reloadDataKeepExpand();
          }
        });
      }
    },
    /* 处理评论数量更新 */
    handleCommentCountUpdate(total) {
      try {
        // 获取当前页面的视频组件
        const currentPage = this.pageList[this.tabIndex];
        if (
          currentPage &&
          currentPage.$refs.vodRef &&
          currentPage.$refs.vodRef.$refs.videoGroup
        ) {
          const videoGroup = currentPage.$refs.vodRef.$refs.videoGroup;
          // 使用接口返回的实际评论数量更新
          if (videoGroup.updateVideoCommentCount) {
            videoGroup.updateVideoCommentCount(this.commentInfo.id, total);
          }
        }
      } catch (error) {
        console.error("更新评论数量失败", error);
      }
    },
    onswiperscroll(e) {
      // this.$refs.tabRef.onswiperscroll(e)
    },
    animationfinish(e) {
      // this.$refs.tabRef.animationfinish(e)
    },
    touchmoveSlider(event) {
      this.pageList[this.tabIndex].tabPageTouchmoveSlider(event);
    },
    touchendSlider(event) {
      this.pageList[this.tabIndex].tabPageTouchendSlider(event);
    },
    /* 跳转搜索 */
    handleJump2Search() {
      uni.navigateTo({
        url: "/pages/search/search",
      });
    },
  },
};
</script>
<style scoped lang="scss">
.tabs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.head {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .head-operate {
    position: absolute;
    width: 750rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 75rpx;
    padding: 0 30rpx;
    z-index: 2;
    box-sizing: border-box;

    .head-operate-icon {
      margin-top: 13rpx;
      width: 45rpx;
      height: 45rpx;
    }
  }

  &-item {
    position: relative;
    z-index: 3;
    height: 75rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &-text {
      color: #eee;
      font-size: 32rpx;
      margin: 0 20rpx;
      font-weight: bold;
    }

    &-textActive {
      color: #ffffff;
      font-size: 34rpx;
    }

    &-sign {
      position: absolute;
      bottom: 0;
      left: 30rpx;
      width: 50rpx;
      height: 5rpx;
      background-color: #ffffff;
    }
  }
}

.tab-box {
  flex: 1;
}

.swiper-item {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.page-item {
  flex: 1;
  flex-direction: row;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.vodProgress {
  position: absolute;
  bottom: 0;
  height: 18px;
  width: 750rpx;
}
</style>
