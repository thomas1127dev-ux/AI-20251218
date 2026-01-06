<template>
  <view class="advertisement-container" v-if="showAdv">
    <view
      class="info-line"
      v-for="item in ads.slice(0, 1)"
      @click="handleClickOpen(item.clickUrl)"
    >
      <up-image
        :src="item.imageUrl"
        width="170rpx"
        height="100rpx"
        radius="10rpx"
      ></up-image>

      <view class="desc">
        <view class="name">{{ item.title }}</view>
        <view class="nums">{{ item.description }}</view>
        <!-- <view class="nums">累计下载24.3W</view> -->
      </view>
    </view>

    <up-icon name="close" size="30" color="#fff" @click="closeAdv"></up-icon>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAdsList } from "@/api/public";

const showAdv = ref(true);

const ads = ref([]);

onMounted(() => {
  const params = {
    type: "long_ads",
  };

  getAdsList(params).then((res) => {
    if (res.code == 200) {
      ads.value = res.data.results;
    }
  });
});
const closeAdv = () => {
  showAdv.value = false;
};

const handleClickOpen = (url) => {
  // #ifdef APP-PLUS
  plus.runtime.openURL(url);
  // #endif
};
</script>

<style lang="scss" scoped>
.advertisement-container {
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);

  .info-line {
    display: flex;
    align-items: center;

    .desc {
      margin-left: 20rpx;

      .name {
        font-size: 15px;
        color: #fff;
      }

      .nums {
        // background-color: #434249;
        // padding: 5rpx 10rpx;
        // border: 2rpx solid #ffffff80;
        color: #fff;
        border-radius: 10rpx;
        font-size: 11px;
        text-align: center;
        margin-top: 10rpx;
        line-height: 1.2;
      }
    }
  }
}
</style>
