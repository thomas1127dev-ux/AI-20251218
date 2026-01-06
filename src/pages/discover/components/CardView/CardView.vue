<template>
  <view class="card-view">
    <up-image
      :src="item.cover_url"
      :lazy-load="true"
      width="100%"
      height="220rpx"
      radius="20rpx 20rpx 0 0 "
      mode="aspectFill"
    ></up-image>

    <view class="desc">
      <view class="title">{{ item.title }}</view>
      <view class="auther">
        <view
          class=""
          @click.stop="uni.navigateTo({ url: '/pages/my/person' })"
        >
          <up-avatar :src="item.author.avatar" size="25"></up-avatar>
        </view>
        <view class="name">{{ item.author.user_nickname }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss">
.card-view {
  width: 320rpx;
  padding-bottom: 10rpx;
  border-radius: 20rpx;
  background-color: rgba(255, 255, 255, 0.03);

  .desc {
    padding: 10rpx 15rpx;
    font-size: 15px;
  }

  .title {
    height: 80rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; //作为弹性伸缩盒子模型显示。
    -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .auther {
    margin-top: 20rpx;
    font-size: 11px;

    display: flex;
    align-items: center;

    .name {
      margin-left: 20rpx;
    }
  }
}
</style>
