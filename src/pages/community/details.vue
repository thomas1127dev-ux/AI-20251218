<template>
  <z-paging ref="paging">
    <up-navbar
      bgColor="transparent"
      placeholder
      :autoBack="true"
      :fixed="false"
    >
      <template #left>
        <up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
      </template>
      <template #center> 动态详情 </template>
      <template #right>
        <view class="" @click="oparea">
          <up-icon name="more-dot-fill" color="#ffffff" size="28"></up-icon>
        </view>
      </template>
    </up-navbar>
    <!-- 作品 -->
    <view class="content">
      <active
        :isList="false"
        :more="false"
        :isPath="true"
        :tabs="4"
        :detailId="detailId"
        ref="activelist"
        :isfollow="false"
      />
    </view>
    <!-- 评论 -->
    <comment ref="commentList" @onfocus="onfocus" :detailId="detailId" />
    <view style="height: 200rpx"></view>
    <!-- 发表评论 -->
    <view class="bottom">
      <input type="text" v-model="con" :placeholder="!aite ? '输入评价内容' : aite" />
      <view class="publish" @click="publish">发表</view>
    </view>
    <operation :show="show" @update:show="(val) => (show = val)" />
  </z-paging>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { addComment } from "@/api/community.js";
import comment from "./components/comment.vue";
import SocialPost from "./components/SocialPost.vue";
import { userinfoStore } from "@/store/userinfos";
const { userinfo } = userinfoStore();
const paging = ref(null);
const detailId = ref(0);
const userid = ref(0);
const con = ref("");
const show = ref(false);
const activelist = ref(null);
const commentList = ref(null);
const commentData = ref({})
const aite = ref('')
//发表评论
const publish = () => {
  if (!con.value) return uni.showToast({ title: "内容不能为空", icon: "none" });
  addComment({
    target_id: detailId.value,
    parent_comment_id: commentData.value.id || 0,
    content: con.value,
  }).then((res) => {
    commentList.value.resetData();
    activelist.value.getlist(4);
    con.value = "";
  });
};
const oparea = () => {
  show.value = true;
};
const onfocus = (item) => {
  aite.value = "@" + item.user_nickname
  commentData.value = item
};
onLoad((options) => {
  detailId.value = options.id;
});
</script>

<style lang="scss" scoped>
.content {
  margin: 20rpx;
}

.bottom {
  background: linear-gradient(175.26deg, #311f4f 14.46%, #1e1b33 122.11%);
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 30rpx 30rpx 60rpx 30rpx;
  box-sizing: border-box;
  justify-content: space-between;
  font-size: 26rpx;

  input {
    background: #fff;
    width: 80%;
    font-size: 26rpx;
    height: 60rpx;
    line-height: 60rpx;
    border-radius: 60rpx;
    text-indent: 30rpx;
    color: #000;
  }

  .publish {
    background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    width: 100rpx;
    border-radius: 60rpx;
  }
}
</style>
