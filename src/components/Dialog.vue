<template>
  <view class="dialog-modal" v-if="modelValue">
    <view class="mask" @click="onClickMak"></view>

    <view class="content">
      <!-- APP端：使用背景图片 -->
      <!-- #ifdef APP-PLUS -->
      <image
        class="dialog-bg-image"
        src="/static/images/dialog-bg.png"
        mode="aspectFill"
      ></image>
      <!-- #endif -->

      <view class="dialog-header">
        <view class="dialog-header-title">
          <slot name="title">温馨提示</slot>
        </view>

        <view class="dialog-header-tip">
          <slot name="tip">该内容需要VIP解锁</slot>
        </view>

        <up-icon
          name="close"
          size="28"
          color="#000"
          class="right-icon"
          @click="handleClickClose"
        ></up-icon>
      </view>
      <view class="dialog-content">
        <slot>
          <image
            src="https://fpoimg.com/221x76"
            mode="widthFix"
            style="width: 100%"
          ></image>
        </slot>
      </view>

      <view class="dialog-footer">
        <view class="cancel-btn">
          <slot name="cancel">
            <up-button
              :text="cancelText"
              shape="circle"
              class="btn"
              @click="onCancel"
            ></up-button>
          </slot>
        </view>
        <view class="confirm-btn">
          <slot name="confirm">
            <up-button
              :text="confirmText"
              shape="circle"
              class="btn"
              @click="onConfirm"
            ></up-button>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
  /* 是否可以点击蒙版关闭 **/
  closeOnClickMask: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: "查看更多",
  },
  confirmText: {
    type: String,
    default: "立即体验",
  },
});

const emits = defineEmits(["update:modelValue", "cancel", "confirm", "close"]);
console.log(props.modelValue, "modelValuemodelValue11111");
const onCancel = () => {
  console.log("cancel");
  emits("cancel");
  emits("update:modelValue", false);
};
const onConfirm = () => {
  console.log("confirm");
  emits("confirm");
  emits("update:modelValue", false);
};
const onClose = () => {
  console.log("close");
  emits("close");
  emits("update:modelValue", false);
};
const onClickMak = () => {
  console.log("onClickMak");
  if (!props.closeOnClickMask) return;
  emits("update:modelValue", false);
};
const handleClickClose = () => {
  console.log("handleClickClose");
  emits("update:modelValue", false);
  emits("close");
};
</script>

<style lang="scss" scoped>
.dialog-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;

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

    // 平台区分处理 - APP端和H5端使用不同的样式
    // #ifdef H5
    // H5端：使用完整的CSS样式
    background: url("/static/images/dialog-bg.png") 0 0 no-repeat;
    background-size: 100% 100%;
    border-radius: 48rpx;
    color: #3b362e;
    min-width: 534rpx;
    min-height: 120rpx;
    // #endif

    // #ifdef APP-PLUS
    // APP端：使用nvue兼容的样式
    background-color: #ffffff;
    border-radius: 48rpx;
    color: #3b362e;
    width: 534rpx;
    height: 120rpx;
    // #endif

    // APP端：背景图片样式
    // #ifdef APP-PLUS
    .dialog-bg-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 48rpx;
    }
    // #endif

    .dialog-header {
      position: relative;
      border-radius: 48rpx 48rpx 0 0;
      padding: 40rpx 50rpx 50rpx;
      text-align: center;

      .right-icon {
        position: absolute;
        right: 36rpx;
        top: 40rpx;
      }

      .dalog-header-title {
        font-size: 15px;
      }
      .dialog-header-tip {
        margin-top: 26rpx;

        font-size: 21px;
        font-weight: bold;
      }
    }

    .dialog-content {
      padding: 0;
      height: 0;

      // 平台区分处理 - 修复APP端选择器问题
      // #ifdef H5
      image {
        display: none;
      }
      // #endif

      // #ifdef APP-PLUS
      // APP端：使用类选择器
      .dialog-image {
        display: none;
      }
      // #endif
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
      margin-bottom: 40rpx;

      .btn {
        // 平台区分处理 - APP端和H5端使用不同的按钮样式
        // #ifdef H5
        // H5端：使用完整的CSS样式
        background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
        font-size: 15px;
        color: #fff;
        height: 80rpx;
        width: 208rpx;
        border-radius: 40rpx;
        border: none;
        box-shadow: 0 4rpx 16rpx rgba(86, 98, 225, 0.3);
        transition: all 0.3s ease;
        cursor: pointer;
        &:hover {
          transform: translateY(-2rpx);
          box-shadow: 0 6rpx 20rpx rgba(86, 98, 225, 0.4);
        }
        // #endif

        // #ifdef APP-PLUS
        // APP端：使用nvue兼容的样式
        background-color: #5662e1;
        font-size: 15px;
        color: #fff;
        height: 80rpx;
        width: 208rpx;
        border-radius: 40rpx;
        // #endif

        &:first-child {
          margin-right: 10rpx;
        }
        &:last-child {
          margin-left: 10rpx;
        }
      }
    }
  }
}
</style>
