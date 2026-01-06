<template>
  <view class="dialog-modal" v-if="modelValue">
    <view class="mask" @click="onClickMask"></view>

    <view class="content">
      <view class="dialog-header">
        <view class="dialog-header-tip">
          <text class="title-text">{{ title }}</text>
          <text class="message-text">{{ message }}</text>
        </view>
      </view>

      <view class="dialog-footer">
        <view class="cancel-btn">
          <view class="btn" @click="onCancel">
            <text class="btn-text">{{ cancelText }}</text>
          </view>
        </view>
        <view class="confirm-btn">
          <view class="btn" @click="onConfirm">
            <text class="btn-text">{{ confirmText }}</text>
          </view>
        </view>
      </view>

      <view class="icon">
        <view class="close-btn" @click="handleClickClose">
          <text class="close-icon">×</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "AppDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      default: "提示",
    },
    message: {
      type: String,
      default: "",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    closeOnClickMask: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "cancel", "confirm", "close"],
  methods: {
    onCancel() {
      console.log("cancel");
      this.$emit("cancel");
      this.$emit("update:modelValue", false);
    },
    onConfirm() {
      console.log("confirm");
      this.$emit("confirm");
      this.$emit("update:modelValue", false);
    },
    onClickMask() {
      console.log("onClickMask");
      if (!this.closeOnClickMask) return;
      this.$emit("update:modelValue", false);
    },
    handleClickClose() {
      console.log("handleClickClose");
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
  },
};
</script>

<style>
/* APP端专用弹窗样式 - 按照Coin.vue布局 */
.dialog-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.content {
  position: absolute;
  z-index: 9;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-color: #f5f1e8;
  background: url("/static/images/dialog-bg.png") 0 0 no-repeat;
  background-size: 100% 100%;
  border-radius: 48rpx;
  color: #3b362e;
  width: 534rpx;
  height: 355rpx;
}

.icon {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
}

.dialog-header {
  position: relative;
  border-radius: 48rpx 48rpx 0 0;
  padding: 40rpx 50rpx 50rpx;
  text-align: center;
}

.dialog-header-tip {
  margin-top: 26rpx;
  font-size: 42rpx;
  font-weight: bold;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
  display: block;
  margin-bottom: 20rpx;
}

.message-text {
  font-size: 28rpx;
  color: #666666;
  text-align: center;
  line-height: 1.5;
  display: block;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.btn {
  display: flex;
  flex-direction: row;
  background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
  font-size: 15px;
  color: #fff;
  height: 80rpx;
  width: 208rpx;
  border-radius: 40rpx;
  justify-content: center;
  align-items: center;
}

.cancel-btn,
.confirm-btn {
  display: flex;
}

.dialog-footer .cancel-btn {
  margin-right: 10rpx;
}

.dialog-footer .confirm-btn {
  margin-left: 10rpx;
}

.btn-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  line-height: 80rpx;
}

.close-btn {
  display: flex;
  width: 60rpx;
  height: 60rpx;
  justify-content: center;
  align-items: center;
}

.close-icon {
  font-size: 40rpx;
  color: #333333;
  font-weight: bold;
}
</style>
