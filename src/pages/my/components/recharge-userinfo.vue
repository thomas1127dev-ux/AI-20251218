<template>
  <view class="top">
    <view class="vip-title">{{ current == 0 ? "VIP特权" : "金币充值" }}</view>
    <view class="sub-title">{{
      current == 0 ? "开通VIP解锁全部特权" : "充值赠送限时享受"
    }}</view>
    <view class="userinfo">
      <view class="left">
        <view class="avatar">
          <up-avatar
            :src="personInfo && personInfo.avatar ? personInfo.avatar : ''"
            size="30"
          ></up-avatar>
        </view>
        <text>{{
          personInfo && personInfo.user_nickname ? personInfo.user_nickname : ""
        }}</text>
      </view>
      <view class="" v-if="current == 0">
        {{ personInfo && personInfo.is_vip ? "已开通VIP" : " 未开通VIP" }}</view
      >
      <view class="" v-if="current == 1">
        <text style="font-size: 22rpx">金币余额：</text>
        <text>{{
          personInfo && personInfo.gold_coin ? personInfo.gold_coin : 0
        }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { userinfoStore } from "@/store/userinfos.js";
const store = userinfoStore();
const { personInfo } = storeToRefs(store);
const props = defineProps(["current"]);
const current = props.current;
const src = ref(
  "http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg"
);

// 调试信息
onMounted(() => {
  console.log("recharge-userinfo personInfo:", personInfo.value);
  console.log(
    "recharge-userinfo personInfo keys:",
    personInfo.value ? Object.keys(personInfo.value) : "undefined"
  );
});
</script>

<style lang="scss" scoped>
.top {
  margin: 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  color: #f3d4ab;
  background: #212028;
  .vip-title {
    font-size: 75rpx;
    font-style: italic;
    font-weight: bold;
  }
  .sub-title {
    font-size: 20rpx;
  }
  .userinfo {
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      text {
        margin-left: 20rpx;
      }
      .avatar {
        border: 1rpx solid #f3d4ab;
        border-radius: 50%;
      }
    }
  }
}
</style>
