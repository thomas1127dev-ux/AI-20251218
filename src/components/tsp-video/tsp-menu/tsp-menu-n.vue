<template>
  <view>
    <!-- 底部标题 -->
    <view
      @click.stop.prevent="moveHandle"
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
      <view>
        <text class="foot-name">@{{ item.author?.user_nickname || "--" }}</text>
      </view>
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
    <view
      class="menuBox"
      :style="{ height: vodHeight + 'px' }"
      @click.stop.prevent="moveHandle"
    >
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
        <view class="vodMenu-top">
          <view class="menu-avatar" @click="JumpBtn(1)">
            <image
              :src="item.author?.avatar"
              mode=""
              class="avatar-image"
            ></image>
          </view>
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
            ></image>
          </view>
        </view>
        <!-- 点赞 -->
        <view class="fabulous" style="position: relative; padding-top: 5rpx">
          <view class="likeBox" :ref="'pelRef' + index">
            <view
              class="like-pellet"
              :class="'like-pellet' + j"
              v-for="(lt, j) in 8"
              :key="j"
            ></view>
          </view>
          <view
            class="fabulous-image"
            @click="fabulousBtn"
            :ref="'likeRef' + index"
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
          </view>
          <text class="fabulous-num">{{ item.likeCount }}</text>
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
          <text class="fabulous-num">{{ item.commentCount }}</text>
        </view>
        <!-- 收藏 -->
        <view class="fabulous" style="margin-top: 30rpx">
          <view class="likeBox" :ref="'pelRef' + index">
            <view
              class="like-pellet"
              :class="'like-pellet' + j"
              v-for="(lt, j) in 8"
              :key="j"
            ></view>
          </view>
          <view
            class="fabulous-image"
            @click="collectionBtn"
            :ref="'collectionRef' + index"
          >
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
          <text class="fabulous-num" style="font-size: 26rpx">{{
            item.share_count
          }}</text>
        </view>
      </view>
    </view>
    <!-- 旋转头像 -->
    <view
      @click.stop.prevent="moveHandle"
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
        style="position: relative; width: 95rpx; height: 95rpx"
        @click="JumpBtn(4)"
      >
        <view :ref="'rotateImg' + index">
          <view class="rotate-avatar">
            <image
              :src="item.author?.avatar"
              mode=""
              class="rotate-image"
            ></image>
          </view>
        </view>
        <view
          :style="`position: absolute;top: 0;left: 0;opacity:${
            item.vodPaly ? 0 : 1
          }`"
        >
          <view class="rotate-avatar">
            <image
              :src="item.author?.avatar"
              mode=""
              class="rotate-image"
            ></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { contentLike, contentCollect } from "@/api/common";
import { followtoggle } from "@/api/community";
const animation = uni.requireNativePlugin("animation");
export default {
  props: {
    //视频部分的高度
    vodHeight: {
      type: Number,
      default: 0,
    },
    //下标索引
    index: {
      type: Number,
      default: 0,
    },
    //当前播放的视频下标
    vodIndex: {
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
  },
  data() {
    return {
      followShow: null,
      fabuTimeOut: null,
      likeNum: 0,
      pelletNum: 0,
      expandDesc: false,
      /* 点赞动画 */
      likeDropList: {
        list: [
          {
            transform: "scale(1)",
          },
          {
            transform: "scale(0)",
          },
          {
            transform: "scale(0.5)",
          },
          {
            transform: "scale(1)",
          },
          {
            transform: "scale(1.2)",
          },
          {
            transform: "scale(1)",
          },
          {
            transform: "scale(1.1)",
          },
          {
            transform: "scale(1)",
          },
        ],
        duration: 62,
      },
      /* 取消点赞动画 */
      likeCancelList: {
        list: [
          {
            transform: "scale(1)",
          },
          {
            transform: "scale(0.7)",
          },
          {
            transform: "scale(1)",
          },
        ],
        duration: 66,
      },
      /* 小圆点闪出的动画 */
      pelletList: {
        list: [
          {
            transform: "scale(0.5)",
            opacity: "0.8",
          },
          {
            transform: "scale(1)",
            opacity: "1",
          },
          {
            transform: "scale(1.1)",
            opacity: "0",
          },
        ],
        duration: 166,
      },
    };
  },
  watch: {
    item: {
      handler(newVal, oldVal) {
        console.log("菜单组件(NVUE) - item prop 变化:", newVal);
        console.log(
          "菜单组件(NVUE) - 新的is_purchase状态:",
          newVal?.is_purchase
        );
        console.log("菜单组件(NVUE) - 新的is_vip状态:", newVal?.is_vip);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /* 阻止事件冒泡 */
    moveHandle(event) {
      event.stopPropagation();
    },
    /* 旋转头像动画 */
    rotateAvatar() {
      let testEl = this.$refs["rotateImg" + this.vodIndex];
      animation.transition(
        testEl,
        {
          styles: {
            transform: "rotate(0deg)",
          },
          duration: 0, //ms
          timingFunction: "linear",
          delay: 0, //ms
        },
        () => {
          this.rotateAvatar1();
        }
      );
    },
    rotateAvatar1() {
      let testEl = this.$refs["rotateImg" + this.vodIndex];
      animation.transition(
        testEl,
        {
          styles: {
            transform: "rotate(360deg)",
          },
          duration: 3000, //ms
          timingFunction: "linear",
          delay: 0, //ms
        },
        () => {
          this.rotateAvatar();
        }
      );
    },
    /* 视频点赞动效 */
    fabulousBtn() {
      // 通过APP端进行VIP权限检查
      this.$emit("checkVipPermission", {
        videoData: this.item,
        actionType: "点赞",
        callback: (hasPermission) => {
          if (hasPermission) {
            // 有权限，执行点赞操作
            let obj = Object.assign({}, this.item);
            obj.fabulousShow = !obj.fabulousShow;
            this.likeNum = 0;
            this.pelletNum = 0;
            let result = obj.fabulousShow
              ? this.likeDropList
              : this.likeCancelList;
            this.addAnimation("likeRef", result, this.likeNum);
            if (obj.fabulousShow) {
              //小圆点闪出动画
              this.addAnimation("pelRef", this.pelletList, this.pelletNum);
            }
            this.$emit("fabulousBtn", {
              obj: obj,
              index: this.index,
            });
            if (obj.fabulousShow) {
              obj.likeCount = (obj.likeCount || 0) + 1;
            } else {
              obj.likeCount = Math.max((obj.likeCount || 0) - 1, 0);
            }
            contentLike(this.item.id)
              .then((res) => {
                console.log("点赞成功");
              })
              .catch((err) => {
                console.log("点赞失败");
              });
          }
        },
      });
    },
    /* 收藏动效 */
    collectionBtn() {
      // 通过APP端进行VIP权限检查
      this.$emit("checkVipPermission", {
        videoData: this.item,
        actionType: "收藏",
        callback: (hasPermission) => {
          if (hasPermission) {
            // 有权限，执行收藏操作
            let obj = Object.assign({}, this.item);
            obj.collectionShow = !obj.collectionShow;
            this.likeNum = 0;
            if (obj.collectionShow) {
              obj.favoriteCount = (obj.favoriteCount || 0) + 1;
            } else {
              obj.favoriteCount = Math.max((obj.favoriteCount || 0) - 1, 0);
            }
            let result = obj.collectionShow
              ? this.likeDropList
              : this.likeCancelList;
            this.addAnimation("collectionRef", result, this.likeNum); //点赞动画

            this.$emit("fabulousBtn", {
              obj: obj,
              index: this.index,
            }); // 收藏成功

            contentCollect(this.item.id)
              .then((res) => {
                console.log("收藏成功");
              })
              .catch((err) => {
                console.log("收藏失败");
              });
          }
        },
      });
    },
    /* 关注动效 */
    followBtn(index) {
      let obj = Object.assign({}, this.item);
      obj.followReally = true;
      this.followShow = 0;
      setTimeout(() => {
        this.followShow = 1;
        setTimeout(() => {
          this.followShow = 2;
          setTimeout(() => {
            followtoggle({ followee_id: this.item.author?.id })
              .then((res) => {
                console.log("关注成功");
                this.$emit("fabulousBtn", {
                  obj: obj,
                  index: this.index,
                }); //关注成功
              })
              .catch((err) => {
                console.log("关注失败", err);
              });
          }, 300);
        }, 100);
      }, 500);
    },
    /* 点击右侧菜单选项 1头像 2评论 3转发 4旋转头像 */
    JumpBtn(index) {
      let obj = {
        vodIndex: this.vodIndex,
        vodCurIndex: this.vodIndex,
        item: this.item,
      };
      switch (index) {
        case 1:
          console.log("点击头像", this.item);
          uni.setStorageSync("otherId", this.item.author?.id);
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
    /* 动画方法 */
    addAnimation(name, dataList, num) {
      let testEl = this.$refs[name + this.vodIndex];
      animation.transition(
        testEl,
        {
          styles: dataList.list[num],
          duration: dataList.duration, //ms
          timingFunction: "linear",
          delay: 0, //ms
        },
        () => {
          num = num + 1;
          if (num < dataList.list.length) {
            this.addAnimation(name, dataList, num);
          }
        }
      );
    },
  },
};
</script>

<style>
.menuBox {
  position: absolute;
  right: 10rpx;
  width: 115rpx;
  z-index: 8;
  justify-content: center;
}

.avatarMenu {
  position: absolute;
  bottom: 20px;
  right: 10rpx;
  width: 115rpx;
  z-index: 8;
  align-items: center;
  flex-direction: column;
}

.vodMenu {
  margin-top: 100rpx;
  width: 115rpx;
  width: 115rpx;
  align-items: center;
  flex-direction: column;
}

.vodMenu-bright0 {
  opacity: 1;
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: 0.3s;
}

.vodMenu-bright1 {
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: 0.3s;
}

.vodMenu-bright2 {
  opacity: 0.2;
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: 0.3s;
}

.vodMenu-top {
  height: 140rpx;
  width: 115rpx;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.menu-avatar {
  position: relative;
  width: 115rpx;
  height: 115rpx;
  border-radius: 115rpx;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 100rpx;
}

.follow {
  position: absolute;
  bottom: 0;
  width: 40rpx;
  height: 40rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  align-items: center;
  justify-content: center;
}

.follow:active {
  transition-property: transform;
  transition-timing-function: linear;
  transition-duration: 0.4s;
  transform: scale(0.7);
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
  transition-property: transform;
  transition-timing-function: linear;
  transition-duration: 0.5s;
  transform: rotate(180deg);
}

.followHide {
  transition-property: transform;
  transition-timing-function: linear;
  transition-duration: 0.5s;
  transform: scale(0.1);
}

.fabulous {
  width: 100rpx;
  margin-top: 80rpx;
  align-items: center;
  flex-direction: column;
}

.fabulous-image {
  width: 80rpx;
  height: 80rpx;
}

.fabulous-num {
  width: 100rpx;
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
  margin-top: 10rpx;
}

.likeBox {
  position: absolute;
  width: 100rpx;
  height: 94rpx;
  opacity: 0;
  transform: scale(0.1);
}

.like-pellet {
  width: 5rpx;
  height: 5rpx;
  background-color: #ff0000;
  border-radius: 5rpx;
  position: absolute;
}

.like-pellet0 {
  top: 10rpx;
  left: 5rpx;
}

.like-pellet1 {
  top: 10rpx;
  right: 5rpx;
}

.like-pellet2 {
  bottom: 13rpx;
  left: 13rpx;
}

.like-pellet3 {
  bottom: 13rpx;
  right: 13rpx;
}

.like-pellet4 {
  top: 0;
  left: 46rpx;
}

.like-pellet5 {
  bottom: 2rpx;
  left: 46rpx;
}

.like-pellet6 {
  left: 0;
  top: 44rpx;
}

.like-pellet7 {
  right: 0;
  top: 44rpx;
}

/* 底部标题部分 */
.footTitle {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 500rpx;
  margin-left: 30rpx;
}

.footTitle-commodity {
  margin-bottom: 50rpx;
  width: 400rpx;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10rpx;
  border-radius: 7rpx;
  flex-direction: row;
  align-items: center;
}

.footTitle-commodity-icon {
  width: 40rpx;
  height: 40rpx;
  background-color: #f98607;
  border-radius: 7rpx;
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
  right: 0;
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
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rotate-avatar {
  width: 95rpx;
  height: 95rpx;
  border-radius: 95rpx;
  background-color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rotate-image {
  width: 55rpx;
  height: 55rpx;
  border-radius: 55rpx;
}
</style>
