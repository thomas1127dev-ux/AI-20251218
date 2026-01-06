<template>
  <z-paging
    ref="pagingRef"
    v-model="dataList"
    @query="queryList"
    :auto="isAuto"
  >
    <view class="content">
      <!-- <BannerSwiper /> -->
      <view class="card-list">
        <card-view
          :item="item"
          v-for="item in dataList"
          @click="handleToLongVideo(item.id)"
        ></card-view>
      </view>
    </view>
  </z-paging>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  current: {
    type: String,
    default: "recommend",
  },
  tabsIndex: {
    type: Number,
    default: 0,
  },
  vip: {
    type: Boolean,
    default: false,
  },
  isAuto: {
    type: Boolean,
    default: true,
  },
});

import BannerSwiper from "./components/BannerSwiper/BannerSwiper.vue";
import CardView from "./components/CardView/CardView.vue";

import { contentList, contentFollowList } from "@/api/common.js";

const pagingRef = ref();
const dataList = ref([]);

watch(
  () => props.current,
  (val, oldVal) => {
    console.log(" ~ val:", val);
    pagingRef.value.reload();
  }
);

const queryList = (pageNo, pageSize) => {
  if (props.current == "follow") {
    const params = {
      is_vip: true,
    };
    contentFollowList(params).then((res) => {
      console.log("resresres", res);
      if (res.code === 200) {
        pagingRef.value.complete(res.data.results);
      }
    });
    return;
  }
  const params = {
    type: "long",
    is_vip: props.vip,
    ordering: props.current,
    currentPage: pageNo,
    pageSize,
  };
  if (!props.vip) delete params.is_vip;
  contentList(params).then((res) => {
    console.log("resresres", res);
    if (res.code === 200) {
      pagingRef.value.complete(res.data.results);
    }
  });
};

const handleToLongVideo = (id) => {
  uni.navigateTo({
    url: "/pages/video/video?id=" + id,
  });
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20rpx;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20rpx;

  .card-view {
    margin-right: 30rpx;
    margin-bottom: 30rpx;

    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}
</style>
