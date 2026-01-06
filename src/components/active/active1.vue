<template>
<!--  15.22-15.22-15.22-15.22-15.22-15.22-->
  <scroll-view scroll-y="true" @scrolltolower="lower" style="max-height: 86vh">
    <view
      v-for="(item, index) in isList ? list : list.slice(0, 1)"
      :key="index"
      class="con"
      @click="handleCardClick(item)"
    >
      <view class="memgceng" v-if="!userinfo.is_vip && item.is_vip">
        <view class="">此内容VIP才可以观看</view>
        <view class="btn" @click="(dialogVisible = true), (obj = item)"
          >去开通</view
        >
      </view>
      <view
        class="memgceng"
        v-if="userinfo.is_vip && !item.is_free && !item.is_purchase"
      >
        <view class="">此内容需要金币才可以观看</view>
        <view class="btn" @click="(dialogVisible = true), (obj = item)"
          >金币预览</view
        >
      </view>
      <view class="top">
        <view class="left">
          <view class="" @click.stop="topath(item.user.id)"
            ><up-avatar :src="item.user.avatar" size="40"></up-avatar
          ></view>
          <view class="message">
            <text>{{
              item.user.user_nickname || item.followeeNickname || "用户已注销"
            }}</text>
            <text class="time">{{ item.create_time }}</text>
          </view>
        </view>
        <view class="follow">
          <text
            v-if="
              !isfollow &&
              !item.is_follower &&
              item.user.id !== uni.getStorageSync('user_info').user_id
            "
            @click.stop="follow(index)"
            >关注</text
          >
          <view class="" @click.stop="oparea">
            <up-icon
              name="more-dot-fill"
              color="#ffffff"
              size="28"
              v-if="more"
            ></up-icon>
          </view>
        </view>
      </view>
      <view class="title">{{ item.title }}</view>
      <view class="images" v-if="item.images">
        <image
          v-for="(image, indx) in item.images"
          :key="indx"
          :src="image"
          mode=""
          @click="previewImage(item.images)"
        >
        </image>
      </view>
      <view class="distance" v-if="tabs == 3"
        >距离你{{ (Math.random() * 50).toFixed(2) }}km</view
      >
      <view class="bottom">
        <view class="" @click.stop="share(index, item.id)">
          <up-icon name="share-square" color="#ffffff" size="26"></up-icon>
          <text>{{ item.share_count }}</text>
        </view>
        <view class="right">
          <view class="" @click.stop="give(index, item.id)">
            <up-icon
              :name="item.is_liked ? 'thumb-up-fill' : 'thumb-up'"
              :color="item.is_liked ? '#ff0000' : '#ffffff'"
              size="26"
            ></up-icon>
            <text>{{ item.like_count }}</text>
          </view>
          <view class="">
            <up-icon name="order" color="#ffffff" size="26"></up-icon>
            <text>{{ item.comment_count }}</text>
          </view>
        </view>
      </view>
    </view>
    <up-empty mode="data" v-if="!list.length"></up-empty>
    <operation :show="show" @update:show="(val) => (show = val)" />
    <Coin
      v-model="dialogVisible"
      @confirm="handleConfirm"
      @cancel="dialogVisibl = false"
      @close="dialogVisibl = false"
      :confirmText="
        userinfo.is_vip
          ? userinfo.gold_coin < obj.price
            ? '去充值'
            : '确认'
          : '去开通'
      "
    >
      <template #tip>
        <view class="" v-if="userinfo.is_vip">
          <view
            v-if="
              userinfo.gold_coin == obj.price || userinfo.gold_coin > obj.price
            "
          >
            是否花费{{ obj.price }}个金币查看此动态</view
          >
          <view v-else
            >此动态需要{{ obj.price }}个金币,您的金币不足,需充值{{
              obj.price - (userinfo.gold_coin || 0)
            }}金币</view
          >
        </view>
        <view class="" v-if="!userinfo.is_vip">
          <view class=""> 此动态需要VIP查看,请开通vip后观看 </view>
        </view>
      </template>
    </Coin>
  </scroll-view>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import {
  communityList,
  getDetails,
  liketoggle,
  addShare,
  followtoggle,
  followList,
  purchase,
} from "@/api/community.js";
import { userinfoStore } from "@/store/userinfos";
import Coin from "@/components/coin/coin.vue";
const { userinfo } = userinfoStore();
const src = ref(
  "http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg"
);
const show = ref(false);
const page = ref(1);
const total = ref(0);
const obj = ref({});
const dialogVisible = ref(false);
const props = defineProps({
  //是否有更多按钮
  more: {
    type: Boolean,
    default: false,
    required: true,
  },
  // 是否有关注
  isfollow: {
    type: Boolean,
    default: true,
  },
  isList: {
    type: Boolean,
    default: true,
    required: true,
  },
  //是否跳转
  isPath: {
    type: Boolean,
    default: false,
  },
  tabs: {
    type: Number,
    default: 0,
  },
  detailId: {
    type: Number,
    default: 0,
  },
});
const list = ref([]);
const todetails = (id) => {
  if (props.isList) {
    uni.navigateTo({
      url: "/pages/community/details?id=" + id,
    });
  }
};
const handleCardClick = (item) => {
  console.log("点击社区内容:", item);
  console.log("用户is_vip:", userinfo.is_vip);
  console.log("内容is_vip:", item.is_vip);
  console.log("内容is_free:", item.is_free);
  console.log("内容is_purchase:", item.is_purchase);

  // 如果内容不是VIP内容，直接允许查看
  if (!item.is_vip) {
    console.log("非VIP内容，直接允许查看");
    todetails(item.id);
    return;
  }

  // 如果是VIP内容且用户不是VIP，不允许查看
  if (!userinfo.is_vip && item.is_vip) {
    console.log("VIP内容且用户非VIP，不允许查看");
    return;
  }

  // 如果是VIP内容且用户是VIP，但内容需要购买且用户未购买，不允许查看
  if (userinfo.is_vip && !item.is_free && !item.is_purchase) {
    console.log("VIP内容需要购买且用户未购买，不允许查看");
    return;
  }

  // 其他情况允许查看
  console.log("允许查看内容");
  todetails(item.id);
};
//金币
const handleConfirm = () => {
  if (!userinfo.is_vip) {
    uni.navigateTo({
      url: "/pages/my/recharge",
    });
    return;
  }
  if (userinfo.gold_coin < obj.price) {
    uni.navigateTo({
      url: "/pages/my/recharge",
    });
  } else {
    purchase({
      id: obj.value.id,
    })
      .then((res) => {
        console.log(res, "res");
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: "none",
        });
      });
  }
};
//切换点赞状态
const give = (index, id) => {
  let params = {
    target_id: id,
  };
  if (list.value[index].is_liked) {
    list.value[index].like_count -= 1;
  } else {
    list.value[index].like_count += 1;
  }
  liketoggle(params).then((res) => {
    list.value[index].is_liked = !list.value[index].is_liked;
  });
};
//关注
const follow = (index) => {
  let params = {
    followee_id: list.value[index].user.id,
  };
  followtoggle(params).then((res) => {
    list.value[index].is_follower = !list.value[index].is_follower;
  });
};
const share = (index, id) => {
  addShare({
    id: id,
  }).then((res) => {
    list.value[index].share_count = res.data.share_count;
  });
};
const openvip = () => {
  uni.navigateTo({
    url: "/pages/my/recharge",
  });
};
const oparea = () => {
  show.value = true;
};
//预览图片
const previewImage = (images) => {
  uni.previewImage({
    urls: images,
  });
};
const topath = (id) => {
  uni.setStorageSync("otherId", id);
  uni.navigateTo({
    url: "/pages/my/person",
  });
};
const getlist = async (newVal) => {
  console.log(newVal, "newVal");

  let params = {
    currentPage: page.value,
    pageSize: 20,
    type: "dynamic",
    ordering:
      newVal == 0 || newVal == 3
        ? "-like_count"
        : newVal == 1
        ? "follow"
        : "-create_time",
  };
  let res = {};
  if (newVal == 4) {
    res = await getDetails({
      dynamic_id: props.detailId,
      userId: userinfo.id,
      currentUserId: userinfo.id,
    });
    list.value = [res.data];
  } else if (newVal == 1) {
    res = await followList({
      currentPage: page.value,
      pageSize: 20,
    });
    list.value = [...list.value, ...res.data.results];
    total.value = res.data.pagination.total;
  } else {
    if (newVal == 6) {
      params.user = props.isfollow
        ? uni.getStorageSync("otherId")
        : uni.getStorageSync("user_info").user_id;
    }
    res = await communityList(params);
    list.value = [...list.value, ...res.data.results];
    total.value = res.data.pagination.total;
  }
};

// 重置数据
const resetData = () => {
  list.value = [];
  page.value = 1;
  total.value = 0;
};

// 刷新数据
const refreshData = async () => {
  resetData();
  await getlist(props.tabs);
};

const lower = () => {
  if (total.value > list.value.length) {
    page.value++;
    getlist();
  }
};
watch(
  () => props.tabs,
  (newVal) => {
    list.value = [];
    getlist(newVal);
  },
  {
    immediate: true,
  }
);
//暴露
defineExpose({
  getlist,
  resetData,
  refreshData,
});
</script>

<style lang="scss" scoped>
.distance {
  margin-bottom: 20rpx;
  font-size: 24rpx;
}

.con {
  background: #212028;
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 15rpx;
  position: relative;
}

.memgceng {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  // background: pink;
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 26rpx;
  pointer-events: auto; // 确保蒙层可以接收点击事件

  .btn {
    background: #3b4392;
    padding: 13rpx 40rpx;
    margin-top: 25rpx;
    border-radius: 40rpx;
  }
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .follow {
    display: flex;

    text {
      margin-right: 20rpx;
      border: 1rpx solid #ffffff;
      padding: 10rpx 40rpx;
      border-radius: 60rpx;
      font-size: 28rpx;
    }
  }

  .left {
    display: flex;
    align-items: center;

    .message {
      display: flex;
      flex-direction: column;
      margin-left: 20rpx;

      .time {
        font-size: 18rpx;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

.title {
  margin: 20rpx 0;
}

.images {
  display: flex;
  flex-wrap: wrap;

  image {
    width: 48%;
    height: 300rpx;
    margin: 0 13rpx 30rpx 0;
    border-radius: 15rpx;
  }
}

.bottom {
  display: flex;
  justify-content: space-between;

  view {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;

    view {
      margin-right: 7rpx;
    }
  }
}
</style>
