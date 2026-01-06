<template>
  <scroll-view
    class="recommend-users-container"
    scroll-y="true"
    :style="{ height: scrollHeight }"
  >
    <view class="recommend-title">你可能感兴趣:</view>

    <view
      v-for="(userGroup, index) in userGroups"
      :key="index"
      class="user-group"
    >
      <!-- 用户信息头部 -->
      <view class="user-header">
        <view class="user-avatar">
          <image
            :src="userGroup.user.avatar || '/static/images/touxiang.jpg'"
            class="avatar-img"
            mode="aspectFill"
          />
        </view>
        <view class="user-info">
          <view class="user-name">{{
            userGroup.user.user_nickname || userGroup.user.username
          }}</view>
          <view class="user-followers"
            >粉丝数: {{ userGroup.user.followers_count || 0 }}</view
          >
        </view>
        <view
          class="follow-btn"
          :class="{ followed: userGroup.user.is_follower }"
          @click="handleFollow(userGroup.user)"
        >
          <text class="follow-text">{{
            userGroup.user.is_follower ? "已关注" : "关注"
          }}</text>
        </view>
      </view>

      <!-- 用户作品网格 -->
      <view class="content-grid">
        <view
          v-for="(content, contentIndex) in userGroup.contents"
          :key="contentIndex"
          class="content-item"
          @click="handleContentClick(content)"
        >
          <view class="content-thumbnail">
            <image
              :src="content.coverImg || content.cover_url"
              class="thumbnail-img"
              mode="aspectFill"
            />
            <!-- VIP标识 - 只有VIP视频且未购买时才显示 -->
            <view
              v-if="content.is_vip && !content.is_purchase"
              class="vip-badge"
              >VIP视频</view
            >
            <!-- 点赞数 -->
            <view class="like-count">
              <text class="like-icon">🤍</text>
              <text class="like-number">{{
                formatCount(content.likeCount || content.like_count)
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: "RecommendUsers",
  props: {
    recommendData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      scrollHeight: "100vh",
    };
  },
  mounted() {
    // 获取系统信息，设置滚动区域高度
    uni.getSystemInfo({
      success: (res) => {
        this.scrollHeight = res.windowHeight + "px";
      },
    });
  },
  computed: {
    // 将推荐数据按用户分组
    userGroups() {
      const groups = {};

      this.recommendData.forEach((content) => {
        if (content.recommendUser) {
          const userId = content.recommendUser.id;
          if (!groups[userId]) {
            groups[userId] = {
              user: content.recommendUser,
              contents: [],
            };
          }
          // 每个用户最多显示3个作品
          if (groups[userId].contents.length < 3) {
            groups[userId].contents.push(content);
          }
        }
      });

      return Object.values(groups);
    },
  },
  methods: {
    // 格式化数字显示
    formatCount(count) {
      if (count >= 10000) {
        return (count / 10000).toFixed(1) + "万";
      }
      return count.toString();
    },

    // 处理关注按钮点击
    handleFollow(user) {
      console.log("关注用户:", user);

      // 如果已经关注，不执行操作
      if (user.is_follower) {
        return;
      }

      // 调用关注接口
      this.$emit("follow-user", user);
    },

    // 处理作品点击
    handleContentClick(content) {
      console.log("点击作品:", content);

      // 检查VIP权限
      if (content.is_vip && !content.is_purchase) {
        // 如果是VIP视频且未购买，需要权限检查
        this.$emit("check-vip-permission", content);
      } else {
        // 非VIP视频或已购买的VIP视频，直接跳转
        uni.navigateTo({
          url: `/pages/video/video?id=${content.id}`,
        });
      }
    },

    // 更新用户关注状态
    updateUserFollowStatus(userId) {
      this.recommendData.forEach((content) => {
        if (content.recommendUser && content.recommendUser.id === userId) {
          content.recommendUser.is_follower = true;
        }
      });
    },

    // 更新视频购买状态
    updateVideoPurchaseStatus(contentId) {
      this.recommendData.forEach((content) => {
        if (content.id === contentId) {
          content.is_purchase = true;
        }
      });
    },
  },
};
</script>

<style scoped>
.recommend-users-container {
  padding: 20rpx;
  background-color: #000;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
}

.recommend-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  color: #fff;
}

.user-group {
  margin-bottom: 40rpx;
  background-color: #1a1a1a;
  border-radius: 16rpx;
  padding: 20rpx;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20rpx;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-followers {
  font-size: 24rpx;
  color: #999;
}

.follow-btn {
  background-color: #fff;
  color: #000;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.follow-btn.followed {
  background-color: #333;
  border: 1rpx solid #666;
}

.follow-text {
  color: #000;
}

.follow-btn.followed .follow-text {
  color: #999;
}

.content-grid {
  display: flex;
  gap: 10rpx;
}

.content-item {
  flex: 1;
  position: relative;
}

.content-thumbnail {
  position: relative;
  width: 100%;
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
}

.vip-badge {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  background-color: rgba(255, 0, 150, 0.8);
  color: #fff;
  padding: 4rpx 8rpx;
  border-radius: 8rpx;
  font-size: 20rpx;
  font-weight: bold;
}

.like-count {
  position: absolute;
  bottom: 8rpx;
  left: 8rpx;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 4rpx 8rpx;
  border-radius: 12rpx;
}

.like-icon {
  font-size: 20rpx;
  margin-right: 4rpx;
}

.like-number {
  font-size: 20rpx;
  color: #fff;
}
</style>
