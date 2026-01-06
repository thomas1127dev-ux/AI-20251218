<template>
  <view class="">
    <up-navbar
      bgColor="transparent"
      placeholder
      :autoBack="true"
      :fixed="false"
    >
      <template #left>
        <up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
      </template>
      <template #center>
        <up-tabs
          :list="tabs"
          @click="click"
          lineColor="#fff"
          :activeStyle="{ color: '#ffffff' }"
          :inactiveStyle="{ color: 'rgba(255,255,255,.4 )' }"
        >
        </up-tabs>
      </template>
      <template #right>
        <view class="" @click="path"> 明细 </view>
      </template>
    </up-navbar>
    <!-- 用户信息 -->
    <rechargeUserinfo :current="current" />
    <view class="content">
      <vipTime v-if="current == 0" @getmoney="handmoney" />
      <vipInterests
        v-if="current == 0"
        :selectedVipData="membership_benefits"
      />
      <vipCoin v-if="current == 1" @getmoney="handmoney" />
    </view>
    <view style="height: 200rpx"></view>
    <view class="bottom">
      <view class="pay">
        <view
          class="zfb"
          :class="type == 'alipay' ? 'current' : ''"
          @click="type = 'alipay'"
          >支付宝</view
        >
        <view
          class="wx"
          :class="type == 'wxpay' ? 'current' : ''"
          @click="type = 'wxpay'"
          >微信支付</view
        >
      </view>
      <view class="vip" @click="btn">{{
        current == 0
          ? personInfo && personInfo.is_vip
            ? "续费VIP"
            : "立即开通VIP"
          : "金币充值"
      }}</view>
    </view>
    <up-popup
      :show="show"
      @close="close"
      @open="open"
      mode="center"
      round="10"
      :closeable="true"
    >
      <view class="popup">
        <image :src="imagesurl" />
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import rechargeUserinfo from "./components/recharge-userinfo.vue";
import vipTime from "./components/vip-time.vue";
import vipInterests from "./components/vip-interests.vue";
import vipCoin from "./components/vip-coin.vue";
import { pay, payResult } from "@/api/public.js";
import { reactive, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { userinfoStore } from "@/store/userinfos.js";
const store = userinfoStore();
const { personInfo } = storeToRefs(store);
const tabs = reactive([
  {
    name: "VIP",
  },
  {
    name: "金币",
  },
]);
const type = ref("alipay");
const current = ref(0);
const deviceId = ref("");
const imagesurl = ref("");
const show = ref(false);
const money = ref(0);
const membership_benefits = ref([]);
const click = (item) => {
  current.value = item.index;
};
const trade_no = ref("");
const path = () => {
  uni.navigateTo({
    url: "/pages/my/bill",
  });
};
const open = () => {
  show.value = true;
};
const close = () => {
  show.value = false;
  payResult({ trade_no: trade_no.value }).then((result) => {
    if (result.code == 200) {
      uni.showToast({
        title: "支付成功",
        icon: "none",
      });
    } else {
      uni.showToast({
        title: "支付失败",
        icon: "none",
      });
    }
    store.getUserinfo({ id: uni.getStorageSync("user_info").user_id });
  });
};
const handmoney = (e, benefits) => {
  money.value = e;
  membership_benefits.value = benefits;
};
const btn = () => {
  pay({
    device_id: deviceId.value,
    pay_method: type.value,
    payment_id: money.value,
  }).then((res) => {
    imagesurl.value = res.qrcode;
    show.value = true;
    trade_no.value = res.trade_no;
  });
};
onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      deviceId.value = res.deviceId;
    },
  });

  // 获取用户信息
  const userInfo = uni.getStorageSync("user_info");
  if (userInfo && userInfo.user_id) {
    console.log("recharge页面获取用户信息:", userInfo);
    store.getPersonInfo({ id: userInfo.user_id });
  } else {
    console.log("recharge页面没有找到用户信息");
  }
});
</script>

<style lang="scss" scoped>
.content {
  background: #212028;
  margin: 0 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;
}

.bottom {
  padding: 30rpx 30rpx 50rpx 30rpx;
  position: fixed;
  left: 0;
  bottom: 0;
  background: linear-gradient(180deg, #1a1921 0%, #312744 100%);
  width: 100%;
  box-sizing: border-box;

  .pay {
    display: flex;
    justify-content: space-between;

    view {
      width: 45%;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 80rpx;
      text-align: center;
      background: #fff;
      color: #000;
      font-weight: bold;
      font-size: 28rpx;
    }

    .current {
      background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
      color: #fff;
    }
  }

  .vip {
    margin-top: 20rpx;
    width: 100%;
    background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
    color: #fff;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 80rpx;
    text-align: center;
  }
}

.popup {
  width: 400rpx;
  height: 400rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  image {
    width: 300rpx;
    height: 80%;
  }
}
</style>
