<template>
  <view class="dialog-modal" v-if="modelValue">
    <view class="mask" @click="onClickMask"></view>

    <view class="dialog-container">
      <view class="content">
        <!-- 弹窗头部 -->
        <view class="dialog-header">
          <view class="dialog-title">
            <text class="title-text">{{ title }}</text>
          </view>
          <view class="close-btn" @click="handleClickClose">
            <text class="close-icon">×</text>
          </view>
        </view>

        <!-- 弹窗内容 -->
        <view class="dialog-content">
          <view class="dialog-message">
            <text class="message-text">{{ message }}</text>
          </view>
        </view>

        <!-- 弹窗底部按钮 -->
        <view class="dialog-footer">
          <view class="btn cancel-btn" @click="onCancel">
            <text class="btn-text">{{ cancelText }}</text>
          </view>
          <view class="btn confirm-btn" @click="onConfirm">
            <text class="btn-text">{{ confirmText }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "DialogNvue",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
      required: true,
    },
    closeOnClickMask: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    confirmText: {
      type: String,
      default: "去开通",
    },
    title: {
      type: String,
      default: "提示",
    },
    message: {
      type: String,
      default: "",
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
/* nvue专用样式 - 完全按照设计图实现 */
.dialog-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  justify-content: center;
  align-items: center;
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-container {
  justify-content: center;
  align-items: center;
  width: 750rpx;
  height: 400rpx;
}

.content {
  /* 弹窗主体样式 - 按照设计图的奶油色背景 */
  background-color: #f5f1e8;
  border-radius: 24rpx;
  width: 640rpx;
  min-height: 500rpx;
  padding: 60rpx 50rpx;
  flex-direction: column;
  justify-content: space-between;
}

.dialog-header {
  position: relative;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  flex: 0 0 auto;
}

.dialog-title {
  align-items: center;
  justify-content: center;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
}

.close-btn {
  position: absolute;
  right: 0;
  top: 0;
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

.dialog-content {
  margin-bottom: 40rpx;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.dialog-message {
  align-items: center;
  justify-content: center;
  padding: 0 30rpx;
}

.message-text {
  font-size: 32rpx;
  color: #333333;
  text-align: center;
}

.dialog-footer {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
}

.btn {
  height: 96rpx;
  border-radius: 48rpx;
  justify-content: center;
  align-items: center;
  width: 240rpx;
  margin: 0 12rpx;
}

.cancel-btn {
  background-color: #667eea;
}

.confirm-btn {
  background-color: #667eea;
}

.btn-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}
</style>
