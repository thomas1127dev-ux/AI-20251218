<template>
  <view class="guess-like">
    <view class="title">猜你喜欢</view>

    <view class="like-list">
      <view
        class="like-item"
        v-for="item in list"
        @click="handleClickToPage(item)"
      >
        <up-image
          :show-loading="true"
          :src="item.cover_url"
          width="150px"
          height="80px"
          radius="5px"
        ></up-image>
        <view class="like-des">
          <view class="like-name">{{ item.title }}</view>
          <view class="like-user">
            <up-avatar :src="item.author.avatar" size="25"></up-avatar>
            <up-text
              :lines="2"
              :text="item.author.user_nickname"
              color="#fff"
              size="11"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- H5端：VIP权限弹窗 -->
    <!-- #ifdef H5 -->
    <Dialog
      v-model="showVipDialog"
      :cancelText="'取消'"
      :confirmText="'去开通'"
      :closeOnClickMask="false"
      @cancel="onVipDialogCancel"
      @confirm="onVipDialogConfirm"
      @close="onVipDialogCancel"
    >
      <template #title>VIP视频</template>
      <template #tip>此视频为VIP视频,请开通VIP后观看</template>
    </Dialog>
    <!-- #endif -->

    <!-- APP端：VIP权限弹窗 -->
    <!-- #ifdef APP-PLUS -->
    <AppDialog
      v-model="showVipDialog"
      title="VIP视频"
      message="此视频为VIP视频,请开通VIP后观看"
      :cancelText="'取消'"
      :confirmText="'去开通'"
      :closeOnClickMask="false"
      @cancel="onVipDialogCancel"
      @confirm="onVipDialogConfirm"
      @close="onVipDialogCancel"
    />
    <!-- #endif -->

    <!-- H5端：金币购买弹窗 -->
    <!-- #ifdef H5 -->
    <Dialog
      v-model="showCoinDialog"
      :cancelText="'取消'"
      :confirmText="'确定'"
      :closeOnClickMask="false"
      @cancel="onCoinDialogCancel"
      @confirm="onCoinDialogConfirm"
      @close="onCoinDialogCancel"
    >
      <template #title>金币视频</template>
      <template #tip>
        <text
          >此视频为金币视频,是否花费{{
            currentVideoData?.price || 0
          }}个金币</text
        >
      </template>
    </Dialog>
    <!-- #endif -->

    <!-- APP端：金币购买弹窗 -->
    <!-- #ifdef APP-PLUS -->
    <AppDialog
      v-model="showCoinDialog"
      title="金币视频"
      :message="`此视频为金币视频,是否花费${
        currentVideoData?.price || 0
      }个金币`"
      :cancelText="'取消'"
      :confirmText="'确定'"
      :closeOnClickMask="false"
      @cancel="onCoinDialogCancel"
      @confirm="onCoinDialogConfirm"
      @close="onCoinDialogCancel"
    />
    <!-- #endif -->

    <!-- H5端：金币不足弹窗 -->
    <!-- #ifdef H5 -->
    <Dialog
      v-model="showInsufficientCoinDialog"
      :cancelText="'取消'"
      :confirmText="'去充值'"
      :closeOnClickMask="false"
      @cancel="onInsufficientCoinDialogCancel"
      @confirm="onInsufficientCoinDialogConfirm"
      @close="onInsufficientCoinDialogCancel"
    >
      <template #title>金币不足</template>
      <template #tip>
        <text
          >此视频为金币视频,您的金币不足,需充值{{
            (currentVideoData?.price || 0) - (store.userinfo.gold_coin || 0)
          }}金币</text
        >
      </template>
    </Dialog>
    <!-- #endif -->

    <!-- APP端：金币不足弹窗 -->
    <!-- #ifdef APP-PLUS -->
    <AppDialog
      v-model="showInsufficientCoinDialog"
      title="金币不足"
      :message="`此视频为金币视频,您的金币不足,需充值${
        (currentVideoData?.price || 0) - (store.userinfo.gold_coin || 0)
      }金币`"
      :cancelText="'取消'"
      :confirmText="'去充值'"
      :closeOnClickMask="false"
      @cancel="onInsufficientCoinDialogCancel"
      @confirm="onInsufficientCoinDialogConfirm"
      @close="onInsufficientCoinDialogCancel"
    />
    <!-- #endif -->
  </view>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { guessLike } from "@/api/common";
import { purchaseVideo } from "@/api/community.js";
// #ifdef H5
import Dialog from "@/components/Dialog.vue";
// #endif
// #ifdef APP-PLUS
import AppDialog from "@/components/AppDialog.vue";
// #endif
import { userinfoStore } from "@/store/userinfos.js";
import { getUserinfo } from "@/api/public.js";

const list = ref([]);

// 弹窗相关数据
const showVipDialog = ref(false);
const showCoinDialog = ref(false);
const showInsufficientCoinDialog = ref(false);
const currentVideoData = ref(null);

// 获取用户信息 - 与首页保持一致
const store = userinfoStore();
const is_vip = computed(() => store.userinfo.is_vip);

// 获取猜你喜欢数据
const fetchGuessLikeData = () => {
  return guessLike().then((res) => {
    console.log("🚀 ~ res:", res);
    list.value = res.data.results;
    return res;
  });
};

// 刷新用户信息
const refreshUserInfo = async () => {
  console.log("GuessLike: 刷新用户信息");
  try {
    const userId = store.userinfo.id;
    if (!userId) {
      console.error("用户ID不存在，无法刷新用户信息");
      return;
    }
    const res = await getUserinfo({ id: userId });
    if (res && res.data) {
      store.userinfo = { ...store.userinfo, ...res.data };
      uni.setStorageSync("userinfos_userinfo", store.userinfo);
      console.log(
        "用户信息已更新 - VIP状态:",
        store.userinfo.is_vip,
        "金币:",
        store.userinfo.gold_coin
      );

      // 充值返回后自动切换弹窗
      const coins = Number((store.userinfo && store.userinfo.gold_coin) || 0);
      const pending = uni.getStorageSync("pending_purchase");
      if (pending && pending.videoId) {
        console.log(
          "检测到充值返回，存在待购买视频:",
          pending,
          "当前金币:",
          coins
        );
        const price = Number(pending.price || 0);
        const targetVideo = list.value.find((v) => v.id === pending.videoId);
        if (targetVideo) {
          currentVideoData.value = targetVideo;
        }
        if (coins >= price) {
          console.log("金币已充足，自动展示购买确认弹窗");
          showInsufficientCoinDialog.value = false;
          showVipDialog.value = false;
          showCoinDialog.value = true;
        } else {
          console.log("金币仍不足，保持充值提示弹窗逻辑");
        }
        uni.removeStorageSync("pending_purchase");
      } else if (showInsufficientCoinDialog.value && currentVideoData.value) {
        // 没有pending记录，但当前不足弹窗打开且金币已充足时，切换到确认
        const price = Number(currentVideoData.value.price || 0);
        if (coins >= price) {
          console.log("金币已充足（无pending记录），切换到购买确认弹窗");
          showInsufficientCoinDialog.value = false;
          showVipDialog.value = false;
          showCoinDialog.value = true;
        }
      }
    }
  } catch (err) {
    console.error("刷新用户信息失败:", err);
  }
};

onMounted(() => {
  fetchGuessLikeData();

  // 监听页面显示时刷新用户信息
  uni.$on("refresh-userinfo", refreshUserInfo);
});

// 刷新数据方法
const refreshData = () => {
  console.log("刷新猜你喜欢数据");
  return fetchGuessLikeData();
};

// 暴露方法给父组件
defineExpose({
  refreshData,
});
const handleClickToPage = async (item) => {
  // 检查VIP权限（等待异步完成）
  if (item.is_vip && !item.is_purchase) {
    // 如果是VIP视频且未购买，需要权限检查
    await checkVipPermission(item);
  } else {
    // 非VIP视频或已购买的VIP视频，直接跳转
    uni.navigateTo({
      url: "/pages/video/video?id=" + item.id,
    });
  }
};

// VIP权限检查
const checkVipPermission = async (videoData) => {
  console.log("检查VIP权限:", videoData);
  console.log("视频is_vip:", videoData?.is_vip);
  console.log("视频is_purchase:", videoData?.is_purchase);
  console.log("视频price:", videoData?.price);
  console.log("用户is_vip:", is_vip.value);
  console.log("完整视频数据:", JSON.stringify(videoData, null, 2));

  // 实时从接口获取最新的用户信息
  let userIsVip = false;
  let currentGoldCoin = 0;
  try {
    const userId = store.userinfo.id;
    if (userId) {
      const res = await getUserinfo({ id: userId });
      if (res && res.data) {
        userIsVip = res.data.is_vip === true;
        currentGoldCoin = res.data.gold_coin || 0;
        // 同时更新store和本地存储
        store.userinfo = { ...store.userinfo, ...res.data };
        uni.setStorageSync("userinfos_userinfo", store.userinfo);
        console.log(
          "实时获取用户信息 - VIP状态:",
          userIsVip,
          "金币:",
          currentGoldCoin
        );
      }
    }
  } catch (err) {
    console.error("获取用户信息失败:", err);
    // fallback到store的值
    userIsVip = is_vip.value;
    currentGoldCoin = store.userinfo.gold_coin || 0;
  }

  console.log("用户is_vip(接口最新值):", userIsVip);
  console.log("用户金币:", currentGoldCoin);

  // 如果视频不是VIP视频，直接允许操作
  if (videoData && !videoData.is_vip) {
    console.log("非VIP视频，直接允许操作");
    uni.navigateTo({
      url: "/pages/video/video?id=" + videoData.id,
    });
    return;
  }

  // 如果视频是VIP视频且用户不是VIP
  if (videoData && videoData.is_vip && !userIsVip) {
    console.log("检测到VIP视频且用户非VIP，显示弹窗");
    currentVideoData.value = videoData;
    showVipDialog.value = true;
    return;
  }

  // 如果用户是VIP，但视频需要购买且用户未购买
  // 注意：如果 is_purchase 字段不存在，默认为未购买
  const isPurchased = videoData.is_purchase === true;
  console.log("视频是否已购买:", isPurchased);

  if (videoData && userIsVip && videoData.is_vip && !isPurchased) {
    console.log("检测到VIP用户但视频需要购买，检查金币余额");
    const videoPrice = videoData.price || 0;

    currentVideoData.value = videoData;

    // 判断金币是否充足（使用接口返回的最新金币数量）
    if (currentGoldCoin >= videoPrice) {
      console.log("金币充足，显示购买确认弹窗");
      showCoinDialog.value = true;
    } else {
      console.log("金币不足，显示充值提示弹窗");
      showInsufficientCoinDialog.value = true;
    }
    return;
  }

  console.log("用户有权限，直接跳转");
  uni.navigateTo({
    url: "/pages/video/video?id=" + videoData.id,
  });
};

// VIP弹窗取消
const onVipDialogCancel = () => {
  showVipDialog.value = false;
  currentVideoData.value = null;
};

// VIP弹窗确认 - 跳转到VIP开通页面
const onVipDialogConfirm = () => {
  showVipDialog.value = false;
  // 跳转到VIP开通页面
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
  console.log("跳转到VIP开通页面");
  currentVideoData.value = null;
};

// 金币购买弹窗取消
const onCoinDialogCancel = () => {
  showCoinDialog.value = false;
  currentVideoData.value = null;
};

// 金币购买弹窗确认
const onCoinDialogConfirm = async () => {
  if (!currentVideoData.value) return;

  try {
    console.log("确认购买视频，花费金币:", currentVideoData.value?.price);
    const res = await purchaseVideo({ id: currentVideoData.value.id });
    console.log("购买响应:", res);

    if (res.code === 200) {
      uni.showToast({
        title: "购买成功",
        icon: "success",
        duration: 2000,
      });

      // 购买成功后立即将视频标记为已购买
      if (currentVideoData.value) {
        currentVideoData.value.is_purchase = true;
      }

      // 关闭购买弹窗
      showCoinDialog.value = false;

      // 刷新用户信息，更新金币余额
      const userId = store.userinfo.id;
      if (userId) {
        store
          .getUserinfo({ id: userId })
          .then(() => {
            console.log("用户信息已刷新，金币余额已更新");
          })
          .catch((err) => {
            console.error("刷新用户信息失败:", err);
          });
      }

      // 购买成功后跳转到视频页面
      setTimeout(() => {
        uni.navigateTo({
          url: "/pages/video/video?id=" + currentVideoData.value?.id,
        });
        currentVideoData.value = null;
      }, 1500);
    } else {
      uni.showToast({
        title: res.message || "购买失败",
        icon: "error",
        duration: 2000,
      });
      showCoinDialog.value = false;
      currentVideoData.value = null;
    }
  } catch (error) {
    console.error("购买失败:", error);
    uni.showToast({
      title: "购买失败",
      icon: "error",
      duration: 2000,
    });
    showCoinDialog.value = false;
    currentVideoData.value = null;
  }
};

// 金币不足弹窗取消
const onInsufficientCoinDialogCancel = () => {
  showInsufficientCoinDialog.value = false;
  currentVideoData.value = null;
};

// 金币不足弹窗确认 - 跳转到充值页面
const onInsufficientCoinDialogConfirm = () => {
  showInsufficientCoinDialog.value = false;
  // 记录待购买信息，充值返回后自动切换为购买确认
  try {
    if (currentVideoData.value) {
      uni.setStorageSync("pending_purchase", {
        videoId: currentVideoData.value.id,
        price: currentVideoData.value.price || 0,
      });
    }
  } catch (e) {
    console.warn("记录待购买信息失败:", e);
  }
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
  console.log("跳转到充值页面");
  currentVideoData.value = null;
};

onUnmounted(() => {
  uni.$off("refresh-userinfo", refreshUserInfo);
});
</script>

<style lang="scss" scoped>
.guess-like {
  margin-top: 40rpx;

  .title {
    font-size: 15px;
  }

  .like-list {
    margin-top: 20rpx;

    .like-item {
      display: flex;
      padding-bottom: 10rpx;

      .like-des {
        margin-left: 20rpx;
        font-size: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .like-user {
          font-size: 11px;
          display: flex;
          align-items: center;

          .name {
            margin-left: 20rpx;
          }
        }
      }
    }
  }
}
</style>
