<template>
  <view class="discover-content">
    <z-paging
      ref="pagingRef"
      v-model="contentList"
      @query="loadContentData"
      :auto="true"
      :swiper="false"
      :scrollable="false"
    >
      <view class="content-list">
        <card-view
          v-for="item in contentList"
          :key="item.id"
          :item="item"
          @click="handleCardClick(item)"
        />
      </view>
    </z-paging>

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
          >此视频为金币视频,您的金币不足,需充值{{ requiredCoins }}金币数</text
        >
      </template>
    </Dialog>
    <!-- #endif -->

    <!-- APP端：金币不足弹窗 -->
    <!-- #ifdef APP-PLUS -->
    <AppDialog
      v-model="showInsufficientCoinDialog"
      title="金币不足"
      :message="`此视频为金币视频,您的金币不足,需充值${requiredCoins}金币数`"
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
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { userinfoStore } from "@/store/userinfos.js";
// #ifdef H5
import Dialog from "@/components/Dialog.vue";
// #endif
// #ifdef APP-PLUS
import AppDialog from "@/components/AppDialog.vue";
// #endif
import CardView from "./CardView/CardView.vue";
import { contentList as getContentList } from "@/api/common.js";
import { purchaseVideo } from "@/api/community.js";
import { getUserinfo } from "@/api/public.js";

// 组件属性
const props = defineProps({
  mainTabKey: {
    type: String,
    required: true,
  },
  mainTabOrdering: {
    type: String,
    required: true,
  },
  subCategoryId: {
    type: [String, Number],
    default: null,
  },
  subCategoryName: {
    type: String,
    default: "",
  },
  subCategoryIndex: {
    type: Number,
    default: 0,
  },
});

// 数据列表
const contentList = ref([]);
const pagingRef = ref();

// VIP权限检查相关状态
const store = userinfoStore();
const isVip = computed(() => store.userinfo.is_vip);
const userGoldCoin = computed(() => store.userinfo.gold_coin || 0);

const showVipDialog = ref(false);
const showCoinDialog = ref(false);
const showInsufficientCoinDialog = ref(false);
const currentVideoData = ref(null);

// 计算需要充值的金币数量
const requiredCoins = computed(() => {
  if (currentVideoData.value && currentVideoData.value.price) {
    return currentVideoData.value.price - userGoldCoin.value;
  }
  return 0;
});

// 监听属性变化，重新加载数据
watch(
  () => [props.mainTabKey, props.subCategoryId],
  (newVal, oldVal) => {
    console.log("DiscoverContent属性变化，重新加载数据");
    console.log("新值:", newVal, "旧值:", oldVal);
    console.log("主标签页:", props.mainTabKey, "排序:", props.mainTabOrdering);
    console.log(
      "子分类ID:",
      props.subCategoryId,
      "子分类名称:",
      props.subCategoryName
    );
    console.log("子分类索引:", props.subCategoryIndex);

    // 组件创建时就开始加载数据（因为只有当前显示的子分类才会创建组件）
    console.log("当前子分类组件，开始加载数据");

    if (pagingRef.value) {
      console.log("触发paging重新加载");
      pagingRef.value.reload();
    } else {
      console.log("pagingRef未准备好，稍后重试");
      // 如果pagingRef还没准备好，稍后重试
      setTimeout(() => {
        if (pagingRef.value) {
          console.log("延迟触发paging重新加载");
          pagingRef.value.reload();
        }
      }, 100);
    }
  },
  { immediate: true, deep: true }
);

// 加载内容数据
const loadContentData = async (pageNo, pageSize) => {
  console.log("=== 开始请求内容数据 ===");
  console.log("主标签页:", props.mainTabKey, "排序:", props.mainTabOrdering);
  console.log(
    "子分类ID:",
    props.subCategoryId,
    "子分类名称:",
    props.subCategoryName
  );
  console.log("页码:", pageNo, "页大小:", pageSize);

  try {
    const params = {
      type: "long",
      ordering: props.mainTabOrdering,
      categories: props.subCategoryId,
      currentPage: pageNo,
      pageSize,
    };

    console.log("内容数据API请求参数:", params);

    const res = await getContentList(params);
    console.log("内容数据响应:", res);

    if (res.code === 200) {
      const results = res.data.results || [];
      pagingRef.value.complete(results);
    } else {
      pagingRef.value.complete([]);
    }
  } catch (error) {
    console.error("加载内容数据失败:", error);
    pagingRef.value.complete([]);
  }
};

// VIP权限检查方法
const checkVipPermission = async (videoData, actionType = "play") => {
  console.log("检查VIP权限:", videoData, "操作类型:", actionType);
  console.log("视频is_vip:", videoData?.is_vip);
  console.log("视频is_purchase:", videoData?.is_purchase);
  console.log("视频price:", videoData?.price);

  // 实时从接口获取最新的用户信息
  let userIsVip = false;
  let currentGoldCoin = 0;
  try {
    const userId = store.userinfo.id;
    if (userId) {
      const { getUserinfo } = await import("@/api/public.js");
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
    userIsVip = store.userinfo.is_vip === true;
    currentGoldCoin = store.userinfo.gold_coin || 0;
  }

  console.log("用户is_vip(接口最新值):", userIsVip);
  console.log("用户金币:", currentGoldCoin);

  // 如果视频不是VIP视频，直接允许观看
  if (videoData && !videoData.is_vip) {
    console.log("非VIP视频，直接允许观看");
    return true;
  }

  // 如果视频是VIP视频且用户不是VIP
  if (videoData && videoData.is_vip && !userIsVip) {
    console.log("检测到VIP视频且用户非VIP，显示VIP弹窗");
    currentVideoData.value = videoData;
    showVipDialog.value = true;
    return false;
  }

  // 如果用户是VIP，但视频需要购买且用户未购买
  if (videoData && userIsVip && videoData.is_vip && !videoData.is_purchase) {
    console.log("检测到VIP用户但视频需要购买，检查金币余额");
    const videoPrice = videoData.price || 0;

    currentVideoData.value = videoData;

    // 判断金币是否充足（使用接口返回的最新金币数量）
    if (currentGoldCoin >= videoPrice) {
      console.log("金币充足，显示购买确认弹窗");
      showCoinDialog.value = true; // 第一个设计图：是否花费金币购买
    } else {
      console.log("金币不足，显示充值提示弹窗");
      showInsufficientCoinDialog.value = true; // 第二个设计图：金币不足，请充值
    }

    return false; // 需要购买
  }

  console.log("用户有权限");
  return true; // 有权限
};

// 刷新视频数据 - 购买成功后调用
const refreshVideoData = async (videoId) => {
  if (!videoId) return;

  console.log("开始刷新视频数据，视频ID:", videoId);

  try {
    // 调用contents接口获取最新的视频数据
    const res = await getContentList({ id: videoId });
    console.log("刷新视频数据响应:", res);

    if (res.code === 200 && res.data) {
      // 检查返回的数据是数组还是对象
      let updatedVideoData;
      if (Array.isArray(res.data)) {
        // 如果是数组，查找对应的视频
        updatedVideoData = res.data.find((item) => item.id === videoId);
        console.log("从数组中查找视频数据:", updatedVideoData);
      } else if (res.data.results && Array.isArray(res.data.results)) {
        // 如果data.results是数组，从results中查找
        updatedVideoData = res.data.results.find((item) => item.id === videoId);
        console.log("从results数组中查找视频数据:", updatedVideoData);
      } else {
        // 如果是对象，直接使用
        updatedVideoData = res.data;
      }

      if (updatedVideoData) {
        console.log("获取到最新的视频数据:", updatedVideoData);
        console.log("更新后的is_purchase状态:", updatedVideoData.is_purchase);

        // 更新内容列表中的数据
        const targetIndex = contentList.value.findIndex(
          (item) => item.id === videoId
        );
        console.log("找到视频索引:", targetIndex);

        if (targetIndex !== -1) {
          console.log("更新前的视频数据:", contentList.value[targetIndex]);

          // 更新整个视频对象
          contentList.value[targetIndex] = updatedVideoData;
          console.log("更新后的视频数据:", contentList.value[targetIndex]);
          console.log(
            "更新后的is_purchase状态:",
            contentList.value[targetIndex].is_purchase
          );

          console.log("视频数据已更新");
        } else {
          console.error("未找到对应的视频索引");
        }
      } else {
        console.error("未找到对应的视频数据，视频ID:", videoId);
      }
    } else {
      console.error("刷新视频数据失败，响应码:", res.code);
    }
  } catch (error) {
    console.error("刷新视频数据失败:", error);
    throw error;
  }
};

// VIP弹窗取消
const onVipDialogCancel = () => {
  showVipDialog.value = false;
  // 如果用户还不是VIP，保持遮罩层状态（这里可以添加遮罩层逻辑）
  if (currentVideoData.value && currentVideoData.value.is_vip && !isVip.value) {
    // 可以在这里添加遮罩层显示逻辑
    console.log("用户还不是VIP，保持限制状态");
  }
  currentVideoData.value = null;
};

// VIP弹窗确认
const onVipDialogConfirm = () => {
  showVipDialog.value = false;
  currentVideoData.value = null;
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
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
    const res = await purchaseVideo({ id: currentVideoData.value.id });
    console.log("购买响应:", res);

    if (res.code === 200) {
      uni.showToast({
        title: "购买成功",
        icon: "success",
      });

      // 购买成功后立即将视频标记为已购买
      if (currentVideoData.value) {
        currentVideoData.value.is_purchase = true;
      }

      // 关闭购买弹窗
      showCoinDialog.value = false;

      // 刷新用户信息和视频数据
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

      // 刷新视频数据，检查购买状态
      try {
        await refreshVideoData(currentVideoData.value.id);
        console.log("视频数据已刷新，购买状态已更新");

        // 检查购买状态，如果已购买则自动跳转
        const videoId = currentVideoData.value.id;
        const video = contentList.value.find((v) => v.id === videoId);
        if (video && video.is_purchase) {
          console.log("视频已购买，自动跳转到视频详情页");
          // 延迟跳转，等待toast显示完成
          setTimeout(() => {
            uni.navigateTo({
              url: `/pages/video/video?id=${videoId}`,
            });
            currentVideoData.value = null;
          }, 1500);
        } else {
          currentVideoData.value = null;
        }
      } catch (err) {
        console.error("刷新视频数据失败:", err);
        currentVideoData.value = null;
      }
    } else {
      uni.showToast({
        title: res.message || "购买失败",
        icon: "error",
      });
      showCoinDialog.value = false;
      currentVideoData.value = null;
    }
  } catch (error) {
    console.error("购买失败:", error);
    uni.showToast({
      title: "购买失败",
      icon: "error",
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

// 金币不足弹窗确认
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
};

// 刷新用户信息
const refreshUserInfo = async () => {
  console.log("DiscoverContent: 刷新用户信息");
  try {
    const userId = store.userinfo.id;
    if (!userId) {
      console.error("用户ID不存在，无法刷新用户信息");
      return;
    }
    const { getUserinfo } = await import("@/api/public.js");
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
        // 查找视频
        const targetVideo = contentList.value.find(
          (v) => v.id === pending.videoId
        );
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

// 组件挂载时监听refresh-userinfo事件
onMounted(() => {
  console.log("DiscoverContent: onMounted");
  uni.$on("refresh-userinfo", refreshUserInfo);
});

// 组件卸载时移除监听
onUnmounted(() => {
  console.log("DiscoverContent: onUnmounted");
  uni.$off("refresh-userinfo", refreshUserInfo);
});

// 处理卡片点击事件
const handleCardClick = async (item) => {
  console.log("点击卡片:", item);

  // 先进行VIP权限检查（等待异步完成）
  const hasPermission = await checkVipPermission(item, "play");

  // 如果有权限，才跳转到视频详情页
  if (hasPermission) {
    uni.navigateTo({
      url: "/pages/video/video?id=" + item.id,
    });
  }
  // 如果没有权限，checkVipPermission方法会显示相应的弹窗
};
</script>

<style lang="scss">
.discover-content {
  height: 100%;
  width: 100%;
}

.content-list {
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: space-between;
}
</style>
