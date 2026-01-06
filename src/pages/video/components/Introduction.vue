<template>
  <!-- 简介 -->
  <view class="container">
    <!-- 头像 -->
    <view class="user-line">
      <view class="user">
        <view
          class=""
          @click.stop="uni.navigateTo({ url: '/pages/my/person' })"
        >
          <up-avatar
            :src="
              detail.author && detail.author.avatar ? detail.author.avatar : ''
            "
          ></up-avatar>
        </view>
        <view class="info">
          <view class="name">{{
            detail.author && detail.author.user_nickname
              ? detail.author.user_nickname
              : ""
          }}</view>
          <view class="nums"
            >{{
              detail.author && detail.author.followers_count
                ? detail.author.followers_count
                : 0
            }}粉丝</view
          >
        </view>
      </view>
      <!-- <view class="now">2355人正在看</view> -->
    </view>

    <!-- 简介 -->
    <view class="des">{{ detail.description || "" }}</view>

    <!-- 标签 -->
    <view class="tags">
      <view v-for="(item, index) in detail.tags || []" :key="index"
        >#{{ item.name || item }}</view
      >
    </view>

    <!-- 评分 -->
    <view class="rate">
      <view class="rate-label">评分</view>
      <up-rate
        :count="rateCount"
        v-model="countValue"
        active-color=" #FFDA70"
        size="24"
        :readonly="countValue > 0"
        @change="handleChange"
        @click="onRateClick"
      ></up-rate>

      <text
        style="
          margin-left: 10rpx;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
        "
        v-if="countValue > 0"
        >已评分</text
      >
    </view>
    <!-- 猜你喜欢 -->
    <guess-like ref="guessLikeRef"></guess-like>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { ratingRate, ratingGet } from "@/api/content";
import GuessLike from "./GuessLike.vue";
const props = defineProps({
  detail: {
    type: Object,
    default: () => {},
  },
});
const rateCount = ref(5);
const countValue = ref(0);
const isUserRating = ref(false); // 添加标志位来区分用户操作和程序设置
const lastUserValue = ref(0); // 记录用户上次的评分值
const guessLikeRef = ref();

watch(
  () => props.detail,
  (val) => {
    console.log(val, "val");
    if (val && val.id) {
      getRating();
    }
  },
  { immediate: true } // 立即执行一次
);

const getRating = () => {
  if (!props.detail || !props.detail.id) return;
  ratingGet({ content_id: props.detail.id })
    .then((res) => {
      // 通过 content_id 筛选出匹配的评分对象
      const rating = res.data;
      console.log("rating+++++++++", rating);
      // 检查rating是否存在且包含有效的score值
      if (
        rating &&
        typeof rating === "object" &&
        rating.score !== undefined &&
        rating.score !== null
      ) {
        isUserRating.value = false; // 设置标志位为false，表示这是程序设置
        countValue.value = rating.score;
        lastUserValue.value = rating.score; // 同步更新用户评分值
        console.log("countValue+++++++++", countValue.value);
      } else {
        // 如果没有评分数据，重置为0
        isUserRating.value = false;
        countValue.value = 0;
        lastUserValue.value = 0; // 同步重置用户评分值
        console.log("没有评分数据，重置为0");
      }
    })
    .catch((error) => {
      console.error("获取评分失败:", error);
      // 出错时也重置为0
      isUserRating.value = false;
      countValue.value = 0;
      lastUserValue.value = 0;
    });
};

const onRateClick = () => {
  // 标记这是用户操作
  isUserRating.value = true;
  console.log("用户点击评分，设置 isUserRating 为 true");
};

const handleChange = (value) => {
  // 判断是否为用户操作：要么是用户点击触发的，要么是值发生了变化且大于0
  const isUserAction =
    isUserRating.value || (value > 0 && value !== lastUserValue.value);

  if (isUserAction && value > 0) {
    console.log("执行评分接口调用");
    if (!props.detail || !props.detail.id) return;
    ratingRate({ content_id: props.detail.id, score: value.toFixed(1) })
      .then((res) => {
        console.log("评分成功:", res);
        // 评分成功后，更新本地状态
        countValue.value = value;
        lastUserValue.value = value;
        // 评分成功后重置标志位
        isUserRating.value = false;
      })
      .catch((error) => {
        console.error("评分失败:", error);
        // 评分失败时也重置标志位
        isUserRating.value = false;
        // 这里可以考虑添加用户提示
      });
  } else {
    // 如果不是用户操作或值为0，直接重置标志位
    isUserRating.value = false;
  }
};

// 刷新猜你喜欢数据
const refreshGuessLike = () => {
  console.log("刷新猜你喜欢数据");
  if (guessLikeRef.value && guessLikeRef.value.refreshData) {
    return guessLikeRef.value.refreshData();
  }
  return Promise.resolve();
};

// 暴露方法给父组件
defineExpose({
  refreshGuessLike,
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.user-line {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .user {
    display: flex;
    align-items: center;

    .info {
      margin-left: 10rpx;

      .name {
        font-size: 15px;
      }

      .nums {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .now {
    font-size: 11px;
  }
}

.des {
  font-size: 17px;
  margin-top: 10rpx;
}

.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 40rpx;

  view {
    padding: 10rpx 20rpx;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    font-size: 11px;
    margin-right: 10rpx;
    margin-bottom: 10rpx;
  }
}

.rate {
  display: flex;
  align-items: center;
  margin-top: 40rpx;

  .rate-label {
    font-size: 20px;
    margin-right: 40rpx;
  }
}
</style>
