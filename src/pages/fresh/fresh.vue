<template>
  <z-paging-swiper>
    <template #top>
      <!-- 导航栏 -->
      <up-navbar
        bgColor="transparent"
        placeholder
        :autoBack="false"
        :fixed="false"
      >
        <template #left>
          <tabs
            :list="list"
            @change="onTabChange"
            :current="currentPage"
          ></tabs>
        </template>
      </up-navbar>
    </template>

    <swiper
      class="swiper"
      duration="300"
      :current="currentPage"
      @animationfinish="onAnimationFinish"
    >
      <swiper-item>
        <view class="card-list content">
          <!-- <up-image src="/static/images/fresh1.png" width="345rpx" height="245rpx" radius="20rpx"
							mode="cover" style="margin-bottom: 20rpx;" @click="handleClickRoute('ai')"></up-image> -->
          <up-image
            src="/static/images/fresh2.png"
            width="320rpx"
            height="200rpx"
            radius="20rpx"
            mode="cover"
            @click="handleClickRoute('game')"
          ></up-image>
          <up-image
            src="/static/images/fresh3.png"
            width="320rpx"
            height="200rpx"
            radius="20rpx"
            mode="cover"
            @click="handleClickRoute('app')"
          ></up-image>
          <up-image
            src="/static/images/fresh4.png"
            width="320rpx"
            height="200rpx"
            radius="20rpx"
            mode="cover"
            @click="handleClickRoute('vip')"
          ></up-image>
        </view>
      </swiper-item>
      <swiper-item>
        <!-- 任务中心 -->
        <task-page class="content"></task-page>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>

<script setup>
import { ref } from "vue";
import tabs from "@/components/tabs/tabs.vue";
import TaskPage from "./TaskPage.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { userinfoStore } from "@/store/userinfos";

const store = userinfoStore();
const userinfo = ref({});

// 初始化时获取用户信息
const getUserInfo = () => {
  store
    .getUserinfo({ id: uni.getStorageSync("user_info").user_id })
    .then(() => {
      userinfo.value = store.userinfo;
    });
};

// 组件初始化时获取用户信息
getUserInfo();
const currentPage = ref(0);

const list = ref([
  {
    name: "推荐",
  },
  {
    name: "任务中心",
  },
]);

const onTabChange = (tab) => {
  currentPage.value = tab.index;
};

const handleClickRoute = (url) => {
  if (url === "ai") return;
  uni.navigateTo({
    url: "/pages/fresh/recommend/" + url,
  });
};

const onAnimationFinish = (e) => {
  console.log(e);
  currentPage.value = e.detail.current;
};
onLoad((e) => {
  if (e.tab) {
    currentPage.value = e.tab;
  }
});

// 页面显示时刷新用户信息
onShow(() => {
  getUserInfo();
});
</script>

<style lang="scss" scoped>
.content {
  padding: 20rpx;
}

.swiper {
  height: 100%;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
