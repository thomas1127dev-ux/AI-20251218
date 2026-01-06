<template>
  <view class="menuPage">
    <!-- 底部标题 -->
    <view
      class="footTitle"
      :class="[
        vodIndex == index
          ? sliderDrag
            ? 'vodMenu-bright1'
            : moveOpacity
            ? 'vodMenu-bright2'
            : 'vodMenu-bright0'
          : '',
      ]"
    >
      <!-- <view class="footTitle-commodity">
				<view class="footTitle-commodity-icon">
					<image src="/static/tsp-icon/cart.png" class="footTitle-commodity-icon-img"></image>
				</view>
				<text class="footTitle-commodity-name text_one">商品商品商品商品商品商品商品商品商品商品商品商品商品</text>
			</view> -->

      <view
        ><text class="foot-name"
          >@{{ item.author?.user_nickname || "--" }}</text
        ></view
      >
      <view style="width: 450rpx; position: relative" v-if="item.desc">
        <text
          class="foot-cont"
          :class="[item.desc.length > 33 && !expandDesc ? 'text_two' : '']"
          >{{ item.desc }}</text
        >
        <text
          class="foot-expand"
          v-if="item.desc.length > 33"
          @click="expandDesc = !expandDesc"
        >
          {{ expandDesc ? "...收起" : "展开" }}
        </text>
      </view>
      <!-- <view><text class="foot-primary">卧槽无情的原声</text></view> -->
    </view>
    <!-- 右侧操作栏 -->
    <view class="menuBox">
      <view
        class="vodMenu"
        :class="[
          vodIndex == index
            ? sliderDrag
              ? 'vodMenu-bright1'
              : moveOpacity
              ? 'vodMenu-bright2'
              : 'vodMenu-bright0'
            : '',
        ]"
      >
        <!-- 头像 -->
        <view class="menu-avatar">
          <image
            :src="item.author?.avatar"
            mode=""
            class="avatar-image"
            @click="JumpBtn(1)"
          ></image>
          <view
            class="follow"
            @click="followBtn(index)"
            v-if="!item.followReally"
            :class="{ followHide: followShow == 2 }"
          >
            <image
              src="/static/tsp-icon/gou.png"
              mode=""
              class="follow-guanzhu guanzhu-gou"
              v-if="followShow == 1 || followShow == 2"
            ></image>
            <image
              src="/static/tsp-icon/guanzhu.png"
              mode=""
              class="follow-guanzhu"
              v-if="followShow == null || followShow == 0"
              :class="{ followActive: followShow == 0 }"
            >
            </image>
          </view>
        </view>
        <!-- 点赞 -->
        <view class="fabulous">
          <view
            class="fabulous-image"
            :class="likeeMeans"
            @click="fabulousBtn(index)"
            style="position: relative"
          >
            <image
              src="/static/tsp-icon/selectTaoxin.png"
              mode=""
              class="fabulous-image"
              v-if="item.fabulousShow"
            ></image>
            <image
              src="/static/tsp-icon/taoxin.png"
              mode=""
              class="fabulous-image"
              v-else
            ></image>
            <view
              class="like-pellet"
              :class="[likeeffect ? 'like-pellet-active' : '']"
            ></view>
          </view>
          <view class="fabulous-num">{{ item.likeCount || vodCurIndex }}</view>
        </view>
        <!-- 评论 -->
        <view class="fabulous" style="margin-top: 30rpx" @click="JumpBtn(2)">
          <view class="fabulous-image">
            <image
              src="/static/tsp-icon/pinlun.png"
              mode=""
              class="fabulous-image"
            ></image>
          </view>
          <view class="fabulous-num">{{ item.commentCount }}</view>
        </view>
        <!-- 收藏 -->
        <view
          class="fabulous"
          :class="collectionMeans"
          style="margin-top: 30rpx"
          @click="collectionBtn(index)"
        >
          <view class="fabulous-image">
            <up-icon
              name="star-fill"
              color="#ffff00"
              size="45"
              class="fabulous-image"
              v-if="item.collectionShow"
            ></up-icon>
            <up-icon
              name="star-fill"
              color="#fff"
              size="45"
              class="fabulous-image"
              v-else
            ></up-icon>
            <view
              class="collection-pellet"
              :class="[collectionShow ? 'collection-pellet-active' : '']"
            >
            </view>
          </view>
          <text class="fabulous-num">{{ item.favoriteCount }}</text>
        </view>
        <!-- 转发 -->
        <view class="fabulous" style="margin-top: 30rpx" @click="JumpBtn(3)">
          <view class="fabulous-image">
            <image
              src="/static/tsp-icon/ward.png"
              mode=""
              class="fabulous-image"
            ></image>
          </view>
          <view class="fabulous-num">{{ item.share_count }}</view>
        </view>
      </view>
    </view>
    <!-- 旋转头像 -->
    <view
      class="avatarMenu"
      v-if="item.rotateImgShow"
      :class="[
        vodIndex == index
          ? sliderDrag
            ? 'vodMenu-bright1'
            : moveOpacity
            ? 'vodMenu-bright2'
            : 'vodMenu-bright0'
          : '',
      ]"
    >
      <view
        class="rotate-avatar k-paused"
        :class="[item.vodPaly && palyCartoon ? 'k-running' : '']"
        @click="JumpBtn(4)"
      >
        <image
          src="/static/tsp-icon/touxiang.jpg"
          mode=""
          class="rotate-image"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
import { contentLike, contentCollect } from "@/api/common";
import { followtoggle } from "@/api/community";
import { userinfoStore } from "@/store/userinfos.js";
import { computed } from "vue";

export default {
  setup() {
    const store = userinfoStore();
    const is_vip = computed(() => store.userinfo.is_vip);

    return {
      store,
      is_vip,
    };
  },
  props: {
    //下标索引
    index: {
      type: Number,
      default: 0,
    },
    //当前swiper的下标
    vodIndex: {
      type: Number,
      default: 0,
    },
    //当前播放的视频下标
    vodCurIndex: {
      type: Number,
      default: 0,
    },
    //当前视频的整个对象
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //数据总数
    discussNum: {
      type: Number,
      default: 0,
    },
    //是否在拖动进度
    sliderDrag: {
      type: Boolean,
      default: false,
    },
    //是否透明
    moveOpacity: {
      type: Boolean,
      default: false,
    },
    //是否播放旋转头像
    palyCartoon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fabulousShow: false,
      followShow: null,
      followOpen: false,
      fabuTimeOut: null,
      likeeffect: null, //点赞动效判断
      collectionShow: null, //收藏动效判断
      expandDesc: false,
    };
  },
  computed: {
    likeeMeans() {
      return this.likeeffect == true
        ? "fabulous-taoxin"
        : this.likeeffect == false
        ? "cancel-taoxin"
        : "";
    },
    collectionMeans() {
      return this.item.collectionShow == true
        ? "fabulous-collection"
        : this.item.collectionShow == false
        ? "cancel-collection"
        : "";
    },
  },
  watch: {
    item: {
      handler(newVal, oldVal) {
        console.log("菜单组件 - item prop 变化:", newVal);
        console.log("菜单组件 - 新的is_purchase状态:", newVal?.is_purchase);
        console.log("菜单组件 - 新的is_vip状态:", newVal?.is_vip);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /* 视频点赞动效 */
    fabulousBtn(index) {
      // 通过APP端进行VIP权限检查
      this.$emit("checkVipPermission", {
        videoData: this.item,
        actionType: "点赞",
        callback: (hasPermission) => {
          if (hasPermission) {
            // 有权限，执行点赞操作
            let obj = Object.assign({}, this.item);
            obj.fabulousShow = !obj.fabulousShow;
            this.likeeffect = obj.fabulousShow;
            if (obj.fabulousShow) {
              obj.likeCount = (obj.likeCount || 0) + 1;
            } else {
              obj.likeCount = Math.max((obj.likeCount || 0) - 1, 0);
            }
            contentLike(this.item.id)
              .then((res) => {
                console.log("点赞成功");
                this.$emit("handleInfo", obj); //点赞成功
              })
              .catch((err) => {
                console.log("点赞失败");
              });
          }
        },
      });
    },
    /* 关注动效 */
    followBtn(index) {
      if (this.followOpen) return;
      this.followOpen = true;
      let obj = Object.assign({}, this.item);
      obj.followReally = true;
      this.followShow = 0;
      setTimeout(() => {
        this.followShow = 1;
        setTimeout(() => {
          this.followShow = 2;
          setTimeout(() => {
            this.followOpen = false;
            this.followShow = null;

            followtoggle({ followee_id: this.item.author.id })
              .then((res) => {
                console.log("关注成功");
                this.$emit("handleInfo", obj); //关注成功
              })
              .catch((err) => {
                console.log("关注失败");
              });
          }, 300);
        }, 100);
      }, 500);
    },
    /** 收藏特效 */
    collectionBtn(index) {
      // 通过APP端进行VIP权限检查
      this.$emit("checkVipPermission", {
        videoData: this.item,
        actionType: "收藏",
        callback: (hasPermission) => {
          if (hasPermission) {
            // 有权限，执行收藏操作
            let obj = Object.assign({}, this.item);
            obj.collectionShow = !obj.collectionShow;
            this.collectionShow = obj.collectionShow;

            if (obj.collectionShow) {
              obj.favoriteCount = (obj.favoriteCount || 0) + 1;
            } else {
              obj.favoriteCount = Math.max((obj.favoriteCount || 0) - 1, 0);
            }

            contentCollect(this.item.id)
              .then((res) => {
                this.$emit("handleInfo", obj); //收藏成功
              })
              .catch((err) => {
                console.log("收藏失败");
              });
          }
        },
      });
    },
    /* 点击右侧菜单选项 1头像 2评论 3转发 4旋转头像 */
    JumpBtn(index) {
      let obj = {
        vodIndex: this.vodIndex,
        vodCurIndex: this.vodCurIndex,
        item: this.item,
      };
      switch (index) {
        case 1:
          console.log("点击头像", this.item);
          uni.setStorageSync("otherId", this.item.author.id);
          uni.navigateTo({ url: "/pages/my/person" });
          break;
        case 2:
          console.log("点击3评论");
          // 通过APP端进行VIP权限检查
          this.$emit("checkVipPermission", {
            videoData: this.item,
            actionType: "评论",
            callback: (hasPermission) => {
              if (hasPermission) {
                // 有权限，执行评论操作
                uni.$emit("updateOpenComment", obj); //触发全局事件
              }
            },
          });
          break;
        case 3:
          console.log("点击4转发");
          // 通过APP端进行VIP权限检查
          this.$emit("checkVipPermission", {
            videoData: this.item,
            actionType: "转发",
            callback: (hasPermission) => {
              if (hasPermission) {
                // 有权限，执行转发操作
                uni.$emit("updateOpenForward", obj); //触发全局事件
              }
            },
          });
          break;
        case 4:
          console.log("5旋转头像");
          break;
      }
    },
  },
};
</script>

<style>
.menuPage {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

/* 右边菜单栏 */
.menuBox {
  position: absolute;
  right: 10rpx;
  width: 115rpx;
  height: 100%;
  z-index: 8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatarMenu {
  position: absolute;
  bottom: 20px;
  right: 10rpx;
  width: 115rpx;
  z-index: 8;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.vodMenu {
  margin-top: 100rpx;
  width: 115rpx;
  /* bottom: 400rpx; */
  display: flex;
  align-items: center;
  flex-direction: column;
}

.vodMenu-bright0 {
  opacity: 1;
  transition: all 0.3s linear;
}

.vodMenu-bright1 {
  opacity: 0;
  transition: all 0.3s linear;
}

.vodMenu-bright2 {
  opacity: 0.2;
  transition: all 0.3s linear;
}

.menu-avatar {
  position: relative;
  width: 115rpx;
  height: 115rpx;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.follow {
  position: absolute;
  bottom: -20rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.follow:active {
  transform: scale(0.7);
  transition: all 0.3s linear;
}

.follow-guanzhu {
  width: 40rpx;
  height: 40rpx;
}

.guanzhu-gou {
  width: 30rpx;
  height: 30rpx;
}

.followActive {
  transform: rotate(180deg);
  transition: all 0.5s linear;
}

.followHide {
  transform: scale(0);
  transition: all 0.8s linear;
}

.fabulous {
  width: 100rpx;
  margin-top: 80rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.fabulous-image {
  width: 80rpx;
  height: 80rpx;
}

.fabulous-num {
  width: 100rpx;
  font-size: 22rpx;
  color: #ffffff;
  text-align: center;
  margin-top: 10rpx;
}

.rotate-avatar {
  width: 95rpx;
  height: 95rpx;
  border-radius: 95rpx;
  background-color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotateName 5s linear infinite;
}

.rotate-image {
  width: 55rpx;
  height: 55rpx;
  border-radius: 55rpx;
}

@keyframes rotateName {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.collection-pellet {
  width: 5rpx;
  height: 5rpx;
  background-color: transparent;
  border-radius: 50%;
  /* 绝对定位 居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  /* 设置各个方向的阴影 */
  box-shadow: 2rpx -70rpx 0 #ff0, -40rpx -35rpx 0 #ff0, 45rpx -35rpx 0 #ff0,
    35rpx 20rpx 0 #ff0, -25rpx 20rpx 0 #ff0;
}

.collection-pellet-active {
  animation: likeBlink 0.5s ease-in-out forwards;
}

.like-pellet {
  width: 5rpx;
  height: 5rpx;
  background-color: transparent;
  border-radius: 50%;
  /* 绝对定位 居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  /* 设置各个方向的阴影 */
  box-shadow: 0 -45rpx 0 #ff0000, 0 48rpx 0 #ff0000, -50rpx 0 0 #ff0000,
    50rpx 0 0 #ff0000, -35rpx -35rpx 0 #ff0000, 35rpx -35rpx 0 #ff0000,
    35rpx 35rpx 0 #ff0000, -35rpx 35rpx 0 #ff0000;
}

.like-pellet-active {
  animation: likeBlink 0.5s ease-in-out forwards;
}

/* 小圆点闪出的动画 */
@keyframes likeBlink {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.8;
  }

  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0;
  }
}

/* 底部标题部分 */
.footTitle {
  position: absolute;
  bottom: 20px;
  left: 0;
  z-index: 8;
  width: 500rpx;
  margin-left: 30rpx;
}

.footTitle-commodity {
  margin-bottom: 50rpx;
  width: 400rpx;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10rpx;
  border-radius: 7rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.footTitle-commodity-icon {
  width: 40rpx;
  height: 40rpx;
  background-color: #f98607;
  border-radius: 7rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.footTitle-commodity-icon-img {
  width: 30rpx;
  height: 30rpx;
}

.footTitle-commodity-name {
  width: 330rpx;
  font-size: 24rpx;
  color: #ffffff;
  margin-left: 15rpx;
}

.foot-name {
  font-size: 33rpx;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.foot-cont {
  font-size: 28rpx;
  color: #ffffff;
}

.foot-primary {
  margin-top: 15rpx;
  font-size: 25rpx;
  color: #ffffff;
}

.foot-expand {
  position: absolute;
  bottom: 0;
  right: -45rpx;
  font-size: 25rpx;
  color: #ffffff;
}

/*字体单行省略*/
.text_one {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/*字体两行省略*/
.text_two {
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.k-paused {
  animation-play-state: paused;
}

.k-running {
  animation-play-state: running;
}

.fabulous-taoxin,
.fabulous-collection {
  animation: likeName 0.5s linear 1;
}

@keyframes likeName {
  0% {
    transform: scale(1);
  }

  15% {
    transform: scale(0);
  }

  30% {
    transform: scale(0.5);
  }

  50% {
    transform: scale(1);
  }

  70% {
    transform: scale(1.2);
  }

  80% {
    transform: scale(1);
  }

  90% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.cancel-taoxin,
.cancel-collection {
  animation: likeCancel 0.2s linear 1;
}

@keyframes likeCancel {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.7);
  }

  100% {
    transform: scale(1);
  }
}
</style>
