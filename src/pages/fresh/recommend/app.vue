<template>
  <z-paging
    ref="paging"
    v-model="dataList"
    @query="queryList"
    :default-page-size="50"
  >
    <template #top>
      <!-- 导航栏 -->
      <up-navbar
        bgColor="transparent"
        color="#fff"
        placeholder
        autoBack
        :fixed="false"
      >
        <template #left>
          <up-icon name="arrow-left" color="#fff" size="18"></up-icon>
        </template>

        <template #center>
          <view>推荐APP</view>
        </template>

        <!-- <template #right>
					<up-icon name="more-dot-fill" color="#fff" size="18"></up-icon>
				</template> -->
      </up-navbar>
    </template>

    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <view class="content">
      <view
        class="app-item"
        v-for="item in dataList"
        @click="handleClickApp(item)"
      >
        <up-image
          :src="item.image_url"
          radius="32rpx"
          width="120rpx"
          height="120rpx"
        ></up-image>
        <view class="app-name">{{
          item.name.length > 5 ? item.name.slice(0, 5) + "..." : item.name
        }}</view>
      </view>
    </view>
    
    <!-- VIP/金币校验弹窗 -->
    <Coin v-model="dialogVisible" @confirm="handleConfirm" @cancel="dialogVisible = false"
      @close="dialogVisible = false" :confirmText="userinfo.is_vip ? (userinfo.gold_coin < currentApp.price ? '去充值' : '确认') : '去开通'">
      <template #tip>
        <view v-if="userinfo.is_vip">
          <view v-if="userinfo.gold_coin >= currentApp.price">
            是否花费{{currentApp.price}}个金币下载此APP
          </view>
          <view v-else>
            此APP需要{{currentApp.price}}个金币,您的金币不足
          </view>
        </view>
        <view v-if="!userinfo.is_vip">
          <view>
            此APP需要VIP下载,请开通VIP后下载
          </view>
        </view>
      </template>
    </Coin>
  </z-paging>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from '@dcloudio/uni-app';

import { getAdsList, purchase } from "@/api/public";
import { userinfoStore } from '@/store/userinfos';
import Coin from "@/components/Coin.vue";

const paging = ref(null);
const dataList = ref([]);
const dialogVisible = ref(false);
const currentApp = ref({});
const store = userinfoStore();
const userinfo = ref({})

// 初始化时获取用户信息
const getUserInfo = () => {
	store.getUserinfo({ id: uni.getStorageSync('user_info').user_id }).then(() => {
		userinfo.value = store.userinfo
	})
}

getUserInfo()
const queryList = (pageNo, pageSize) => {
  const params = {
    type: "app",
    currentPage: pageNo,
    pageSize,
  };
  getAdsList(params)
    .then((res) => {
      console.log("resres", res);
      paging.value.complete(res.data.results);
    })
    .catch((res) => {
      paging.value.complete(false);
    });
};

const handleClickApp = (item) => {
  currentApp.value = item;
  console.log(userinfo.value.gold_coin,'userinfo.valueuserinfo.value')
  // 如果已购买，直接打开
  if (item.is_purchase) {
    openApp(item.click_url);
    dialogVisible.value = false;
    return;
  }
  
  // 检查VIP权限
  if (!userinfo.value.is_vip && item.is_vip) {
    dialogVisible.value = true;
    return;
  }
  
  // 检查金币权限
  if (userinfo.value.is_vip && item.price && userinfo.value.gold_coin < item.price) {
    dialogVisible.value = true;
    return;
  }
  
  // 如果用户是VIP且金币足够，也显示确认弹窗
  if (userinfo.value.is_vip && item.price && userinfo.value.gold_coin >= item.price) {
    dialogVisible.value = true;
    return;
  }
  
  // 免费内容直接打开
  // openApp(item.click_url);
};

const openApp = (url) => {
  // #ifdef APP-PLUS
  plus.runtime.openURL(url);
  // #endif

  // #ifdef H5
  window.open(url, "_blank");
  // #endif
};

// 处理弹窗确认
const handleConfirm = () => {
  if (!userinfo.value.is_vip) {
    uni.navigateTo({
      url: '/pages/my/recharge'
    });
  } else if (userinfo.value.gold_coin < currentApp.value.price) {
    uni.navigateTo({
      url: '/pages/my/recharge'
    });
  } else {
    if (currentApp.value.price) {
      purchase({id: currentApp.value.id}).then(res => {
        uni.showToast({
          title: '购买成功',
          icon: 'none'
        }).then(() => {
          // 更新APP状态为已购买
          const appIndex = dataList.value.findIndex(app => app.id === currentApp.value.id);
          if (appIndex !== -1) {
            dataList.value[appIndex].is_purchase = true;
          }
         store.getUserinfo({ id: uni.getStorageSync('user_info').user_id }).then(() => {
         	userinfo.value = store.userinfo
         })
          openApp(currentApp.value.click_url);
        });
      }).catch(err => {
        uni.showToast({
          title: err.message || '购买失败',
          icon: 'none'
        });
      });
    } else {
      openApp(currentApp.value.click_url);
    }
  }
};

onShow(() => {
  getUserInfo()
});
</script>

<style lang="scss" scoped>
.content {
  padding: 20rpx;

  display: flex;
  flex-wrap: wrap;

  .app-item {
    margin-left: 27rpx;
    text-align: center;
    margin-bottom: 20rpx;

    .app-name {
      font-size: 10px;
      margin-top: 5rpx;
    }
    &:nth-child(5n + 1) {
      margin-left: 0;
    }
  }
}
</style>
