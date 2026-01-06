<template>
  <view class="con">
    <view class="list" v-for="(item, index) in list" :key="index" @click="clicks(index)">
      <view :class="current == index ? 'title current-title' : 'title'">{{ item.gold_coin }}金币</view>
      <image src="/static/image/coin.png.png"></image>
      <view :class="current == index ? 'prices current-prices' : 'prices'"> {{ item.pay_price }} 元</view>
      <view :class="current == index ? 'ori-prices current-ori-prices' : 'ori-prices'
        ">{{ item.amount }}元</view>
    </view>
  </view>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue'
import {
  paylist
} from '@/api/public.js'
const current = ref(0);
const list = ref([])
const emits = defineEmits(['getmoney'])
onMounted(() => {
  paylist({ pay_channel: 'gold' }).then(res => {
    list.value = res.data.results
    if (list.value.length > 0) {
      emits('getmoney', list.value[0].id, [])
    }
  })
})
const clicks = (index) => {
  current.value = index
  emits('getmoney', list.value[index].id, [])
}
</script>

<style lang="scss" scoped>
.con {
  display: flex;
  // justify-content: space-between;
  margin-bottom: 30rpx;
  flex-wrap: wrap;
  
}

.list {
  width: 30%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  height: 300rpx;
  border-radius: 15rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 20rpx;
  margin-right: 10rpx;
  image {
    width: 80rpx;
    height: 100rpx;
  }

  .title {
    width: 100%;
    height: 60rpx;
    background: rgba(255, 255, 255, 0.4);
    text-align: center;
    color: #000;
    line-height: 60rpx;
    font-size: 24rpx;
    font-weight: bold;
  }

  .prices {
    margin: 30rpx 0 10rpx 0;
    font-size: 34rpx;
    font-weight: bold;
  }

  .ori-prices {
    font-size: 24rpx;
    text-decoration: line-through;
  }

  .promotion {
    margin-top: 60rpx;
    font-size: 22rpx;
  }

  .current-title {
    background: #f3d4ab;
  }

  .current-prices,
  .current-ori-prices {
    color: #f3d4ab;
  }

  .current-promotion {
    color: #fff;
  }
}
.con .list:nth-of-type(3){
	 margin-right: 0 !important;
}
</style>
