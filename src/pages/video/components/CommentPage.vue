<template>
  <view class="comment-page">
    <view class="comment-list">
      <view class="comment-item" v-for="(item, index) in list" :key="index">
        <view class="user-line">
          <view class="user">
            <view class="" @click.stop="gopage(item)">
              <up-avatar :src="item.user_avatar"></up-avatar>
            </view>
            <view class="info">
              <view class="name">{{ item.user_nickname || "用户名" }}</view>
              <view class="nums">{{ item.create_time }}</view>
            </view>
          </view>
          <view class="now" @click="give(item)">
            <up-icon
              :name="item.is_liked ? 'heart-fill' : 'heart'"
              :color="item.is_liked ? '#ff0000' : '#D9D9D9'"
              size="22"
            ></up-icon>
            <text style="margin-left: 10rpx">{{ item.like_count }}</text>
          </view>
        </view>

        <view class="des">
          {{ item.content }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getCommentListV1 } from "@/api/community";
import { likesCommentToggle } from "@/api/content";
const props = defineProps({
  id: {
    type: String,
    default: "0",
  },
});

const list = ref([]);

const reload = () => {
  const params = {
    target_id: props.id,
    currentPage: 1,
    pageSize: 9999,
  };
  getCommentListV1(params).then((res) => {
    console.log(res.data);
    if (res.code === 200) {
      list.value = res.data.results;
    }
  });
};

const give = (item) => {
  likesCommentToggle({ target_id: item.id }).then((res) => {
    reload();
  });
};

const gopage = (item) => {
  uni.setStorageSync("otherId", item.user_id);
  uni.navigateTo({ url: "/pages/my/person" });
};

onLoad(() => {
  console.log(props.id);
  reload();
});

defineExpose({ reload });
</script>

<style lang="scss" scoped>
.comment-page {
  padding: 20rpx;
}

.comment-item {
  padding-bottom: 40rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40rpx;
}

.user-line {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .user {
    display: flex;
    align-items: center;

    .info {
      margin-left: 10rpx;

      .name {
        font-size: 15px;
      }

      .nums {
        font-size: 15px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .now {
    font-size: 11px;
    display: flex;
    align-items: center;
  }
}

.des {
  font-size: 17px;
  margin-top: 20rpx;
}
</style>
