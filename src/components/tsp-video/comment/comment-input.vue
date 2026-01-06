<template>
  <view
    class="input-popup"
    v-if="modelValue"
    :style="{ height: screenHeight + 'px' }"
  >
    <!-- 遮罩层 -->
    <view
      class="input-mask"
      @click="close"
      :style="{
        width: screenWidth + 'px',
        height: screenHeight + 'px',
        opacity: showPopup ? 1 : 0,
      }"
    ></view>

    <!-- 内容区域 -->
    <view
      class="input-content"
      :style="{ width: screenWidth + 'px', opacity: showPopup ? 1 : 0 }"
      @click="clickStop"
    >
      <view class="input-content-top">
        <view
          class="input-content-top-box"
          :style="{ width: screenWidth - 30 + 'px' }"
        >
          <view :style="{ width: screenWidth - 56 + 'px', minHeight: '40px' }">
            <textarea
              :placeholder="placeholderText"
              class="input-content-top-textarea"
              v-model="remarkText"
              :adjust-position="false"
              :focus="isFocus"
              auto-height
              :maxlength="-1"
              v-if="showText"
              :style="{
                width: screenWidth - 56 + 'px',
                minHeight: '40px',
                maxHeight: '100px',
              }"
              @touchstart="closeBrow"
            />
          </view>
          <!-- 表情图 -->
          <view class="input-content-top-box-bqtp" v-if="phizImg">
            <image
              :src="phizImg"
              class="input-content-top-box-bqtp-img"
              @click="openPreview([phizImg])"
            ></image>
            <view
              class="input-content-top-box-del f f-lv-c"
              @touchstart="phizImg = ''"
            >
              <image
                src="/static/tsp-icon/tsp-del.png"
                class="input-content-top-box-del-img"
              ></image>
            </view>
          </view>
          <!-- 图片或者图集 -->
          <scroll-view
            class="f"
            scroll-x
            v-if="plImgList.length > 0"
            :style="{ width: screenWidth - 56 + 'px' }"
            :show-scrollbar="false"
          >
            <view class="f f-v-c">
              <view
                class="input-content-top-box-bqtp mgr10"
                v-for="(item, index) in plImgList"
                :key="index"
              >
                <image
                  :src="item"
                  class="input-content-top-box-bqtp-img"
                  @click="openPreview(plImgList, index)"
                ></image>
                <view
                  class="input-content-top-box-del f f-lv-c"
                  @touchstart="deletePlImg(index)"
                >
                  <image
                    src="/static/tsp-icon/tsp-del.png"
                    class="input-content-top-box-del-img"
                  ></image>
                </view>
              </view>
              <view
                class="input-content-top-box-addImg f f-lv-c"
                v-if="plImgList.length < 9"
                @touchstart="openChooseImage(1)"
              >
                <image
                  src="/static/tsp-icon/tsp-tj.png"
                  class="input-content-top-box-addImg-img"
                ></image>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="f f-lv-s input-operate">
        <view class="f f-v-c">
          <view class="input-operate-img mgl7" @touchstart="openChooseImage(0)">
            <image
              src="/static/tsp-icon/upImg.png"
              class="input-operate-icon"
            ></image>
          </view>
          <text class="input-operate-at">@</text>
          <view class="input-operate-img" @touchstart="changeBrow">
            <image
              src="/static/tsp-icon/tsp-jianpang.png"
              class="input-operate-icon"
              v-if="showBrow"
            ></image>
            <image
              src="/static/tsp-icon/biaoqing.png"
              class="input-operate-icon"
              v-else
            ></image>
          </view>
        </view>
        <view
          class="input-operate-send f f-lv-c"
          :class="{ sendActive: remarkText || phizImg || plImgList.length > 0 }"
          @click="sendBtn"
        >
          <text
            class="input-operate-send-text"
            :class="{
              sendActive: remarkText || phizImg || plImgList.length > 0,
            }"
            >发送</text
          >
        </view>
      </view>

      <!-- 表情菜单栏 -->
      <view
        :style="{
          width: screenWidth + 'px',
          height: '45px',
          overflow: 'hidden',
          position: 'relative',
        }"
      >
        <view
          class="input-phiz f f-lv-s"
          :style="{
            width: screenWidth + 'px',
            left: !showBrow ? 0 : -screenWidth + 'px',
          }"
        >
          <text
            class="input-phiz-text"
            v-for="(item, index) in emojiRecommend"
            :key="index"
            @click="addTextEmoji(item)"
            >{{ item.emoji }}</text
          >
        </view>
        <scroll-view
          class="input-tool f"
          scroll-x
          :style="{
            width: screenWidth + 'px',
            left: showBrow ? 0 : -screenWidth + 'px',
          }"
          :show-scrollbar="false"
        >
          <view class="f f-v-c" style="height: 45px">
            <view v-for="(item, index) in browList" :key="index">
              <view
                class="input-tool-item f f-lv-c"
                :class="[browIndex == index ? 'itemActive' : '']"
                @click="openTool(index)"
              >
                <image :src="item.icon" class="input-tool-item-img"></image>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 表情部分 -->
      <view
        :style="{
          width: screenWidth + 'px',
          height: swHeight + 'px',
          overflow: 'hidden',
          position: 'relative',
        }"
      >
        <swiper
          class="input-swiper"
          :current="browIndex"
          :duration="300"
          @change="onswiperchange"
          :style="{
            width: screenWidth + 'px',
            height: swHeight + 'px',
            left: showBrow ? 0 : -screenWidth + 'px',
          }"
        >
          <swiper-item v-for="(item, index) in browList" :key="index">
            <scroll-view
              class="input-swiper-item"
              scroll-y
              :style="{ height: swHeight + 'px' }"
            >
              <view style="height: 10px"></view>
              <!-- emoji表情 -->
              <view class="f fw" v-if="item.type == 'emoji'">
                <view
                  class="input-swiper-item-bqtb"
                  v-for="(em, eid) in emojiList"
                  :key="eid"
                  :style="{
                    width: emojiWidht + 'px',
                    height: emojiWidht + 'px',
                  }"
                  @click="addTextEmoji(em)"
                >
                  <text class="input-swiper-item-bqtb-text">{{
                    em.emoji
                  }}</text>
                </view>
              </view>
              <!-- 表情包 -->
              <view class="f fw" v-if="item.type !== 'emoji'">
                <!-- 添加按钮 -->
                <view
                  class="input-swiper-item-addbq f f-lv-c"
                  v-if="item.type == 'scbq'"
                  :style="{ width: browWidht + 'px', height: browWidht + 'px' }"
                >
                  <image
                    src="/static/tsp-icon/tsp-tj.png"
                    :style="{
                      width: browWidht / 2.5 + 'px',
                      height: browWidht / 2.5 + 'px',
                    }"
                  ></image>
                </view>
                <!-- 搜索按钮 -->
                <view
                  class="input-swiper-item-addbq f f-lv-c"
                  v-if="item.type == 'gif'"
                  :style="{ width: browWidht + 'px', height: browWidht + 'px' }"
                >
                  <image
                    src="/static/tsp-icon/tsp-search.png"
                    :style="{
                      width: browWidht / 2.5 + 'px',
                      height: browWidht / 2.5 + 'px',
                    }"
                  ></image>
                </view>
                <view
                  class="f f-lv-c input-swiper-item-bqImg"
                  v-for="(v, idx) in item.list"
                  :key="idx"
                  :style="{ width: browWidht + 'px', height: browWidht + 'px' }"
                  @click="addImgPhiz(v)"
                >
                  <image
                    :src="v.imgUrl"
                    mode="widthFix"
                    :style="{
                      width: browWidht + 'px',
                      height: browWidht + 'px',
                    }"
                  ></image>
                </view>
              </view>

              <view style="height: 10px"></view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
    </view>
  </view>
</template>

<script>
import emojiObjList from "./emoji.js";
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    /* 打开输入框的类型 */
    openType: {
      type: String,
      default: "",
    },
    /* 底部栏的高度 */
    tabBarHeight: {
      type: Number,
      default: 60,
    },
    /* 评论内容 */
    contentInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /* 当前回复的对象 */
    currReplyInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      screenWidth: 0, //屏幕的宽度
      screenHeight: 0, //屏幕的高度
      statusBarHeight: 0, // 状态栏高度
      showPopup: false,
      swHeight: 0,
      commentHeight: 0, //默认160px
      emojiList: emojiObjList,
      emojiRecommend: [],
      browList: [
        {
          icon: "/static/tsp-icon/tsp-bqcz1.png",
          type: "emoji",
        },
        {
          icon: "/static/tsp-icon/tsp-bqcz2.png",
          type: "scbq",
          list: [
            { id: 1, imgUrl: "/static/tsp-icon/tsp-bq1.jpg" },
            { id: 2, imgUrl: "/static/tsp-icon/touxiang.jpg" },
            { id: 3, imgUrl: "/static/tsp-icon/tsp-bq1.jpg" },
          ],
        },
        {
          icon: "/static/tsp-icon/tsp-bqcz3.png",
          type: "gif",
          list: [
            { id: 1, imgUrl: "/static/tsp-icon/tsp-bq1.jpg" },
            { id: 2, imgUrl: "/static/tsp-icon/tsp-bq2.gif" },
            { id: 3, imgUrl: "/static/tsp-icon/tsp-bq2.gif" },
          ],
        },
        {
          icon: "/static/tsp-icon/tsp-bq1.jpg",
          type: "bqb",
          list: [
            { id: 1, imgUrl: "/static/tsp-icon/tsp-bq1.jpg" },
            { id: 2, imgUrl: "/static/tsp-icon/tsp-bq2.gif" },
            { id: 3, imgUrl: "/static/tsp-icon/tsp-bq2.gif" },
            { id: 4, imgUrl: "/static/tsp-icon/tsp-bq1.jpg" },
            { id: 5, imgUrl: "/static/tsp-icon/tsp-bq2.gif" },
            { id: 6, imgUrl: "/static/tsp-icon/tsp-bq2.gif" },
          ],
        },
      ],
      emojiWidht: 0, //emoji表情的宽度
      browIndex: 0,
      browWidht: 0, //表情的宽度
      boardHeight: 0, //键盘高度
      showBrow: false, //是否显示表情
      showText: false, //用于切换显示键盘
      remarkText: "", //文本内容
      phizImg: "", //表情图片
      plImgList: [], //选择图片
      isFocus: true,
      storagekeyHeight: 0,
      sureSend: false,
      placeholderText: "输入评论内容",
      turnOn: false,
      chooseCount: 1,
    };
  },
  created() {
    const deviceInfo = uni.getSystemInfoSync();
    this.screenWidth = deviceInfo.screenWidth; //屏幕的宽度
    this.screenHeight = deviceInfo.screenHeight - this.tabBarHeight;
    this.statusBarHeight = deviceInfo.statusBarHeight;
    this.emojiRecommend = emojiObjList.slice(0, 9);
    let num = 4; //默认一行显示4个
    const str = this.screenWidth.toString();
    /* 判断屏幕尺寸、一行要显示多少个表情包的宽度 */
    if (this.screenWidth >= 500 && this.screenWidth < 1000) {
      num = parseInt(str.slice(0, 1));
    } else if (this.screenWidth >= 1000) {
      num = parseInt(str.slice(0, 2));
    }
    let maRx = (num + 1) * 15.5; //计算一行所有的右边距
    let emoRx = (num + 4) * 15.5; //计算一行所有的右边距
    this.browWidht = (deviceInfo.screenWidth - maRx) / num; //屏幕的宽度 - 左右边距各15px / 4
    this.emojiWidht = (deviceInfo.screenWidth - emoRx) / (num + 3);

    if (uni.getStorageSync("keyboardHeight")) {
      let keyHeight = parseFloat(uni.getStorageSync("keyboardHeight"));
      this.boardHeight = keyHeight;
      this.storagekeyHeight = keyHeight;
    }

    // #ifdef APP-PLUS
    uni.onKeyboardHeightChange((res) => {
      this.boardHeight = res.height;
      this.getInputBoard();
      if (this.boardHeight == 0 && !this.showBrow && this.openType != "img") {
        // #ifdef APP-NVUE
        this.close(); //关闭输入框
        // #endif

        // #ifndef APP-NVUE
        this.swHeight = 0;
        // #endif
      } else if (
        this.boardHeight == 0 &&
        !this.showBrow &&
        this.openType == "img"
      ) {
        this.$emit("closeImg", null);
      }
      if (this.boardHeight > 0) {
        uni.setStorageSync("keyboardHeight", this.boardHeight);
        this.storagekeyHeight = this.boardHeight;
      }
    });
    // #endif
  },
  watch: {
    modelValue(val) {
      if (val) {
        // this.commentHeight = 160 //内容区域的高度

        /* 评论内容 */
        this.remarkText = this.contentInfo.text || "";
        this.phizImg = this.contentInfo.phizImg || "";
        this.plImgList = this.contentInfo.plImgList || [];

        /* 回复他人 */
        if (this.currReplyInfo.replyType) {
          this.placeholderText = "回复 @" + this.currReplyInfo.user_nickname;
        } else {
          this.placeholderText = "输入评论内容";
        }

        if (this.openType == "emoji") {
          this.isFocus = false;
        } else {
          this.isFocus = true;
        }
        this.showText = true;

        if (this.boardHeight > 0) {
          setTimeout(() => {
            this.getInputBoard();
          }, 200);
        }
        setTimeout(() => {
          this.showPopup = true;
          setTimeout(() => {
            /* 打开输入框的时候打开选择图片 */
            if (this.openType == "img") {
              this.openChooseImage(0);
            }
          }, 50);
          /* 打开输入框的时候打开选择表情 */
          if (this.openType == "emoji") {
            if (this.storagekeyHeight > 0 && this.swHeight == 0) {
              this.swHeight = this.storagekeyHeight - this.tabBarHeight;
            } else if (this.storagekeyHeight == 0 && this.swHeight == 0) {
              this.swHeight = 250;
            }
            this.changeBrow();
          }
        }, 500);
      } else {
        this.showPopup = false;
      }
    },
  },
  methods: {
    clickStop(event) {
      event.stopPropagation();
    },
    getInputBoard() {
      if (this.boardHeight > 0) {
        /* if(this.commentHeight == 160){
						this.commentHeight = this.commentHeight + this.boardHeight - this.tabBarHeight
					} */
        if (this.swHeight == 0) {
          this.swHeight = this.boardHeight - this.tabBarHeight;
        }
      }
    },
    close() {
      if (this.turnOn) return;
      this.turnOn = true;
      this.showPopup = false;
      this.showBrow = false;
      this.swHeight = 0;
      this.browIndex = 0;
      uni.hideKeyboard();
      let data = {
        text: this.remarkText,
        phizImg: this.phizImg,
        sureSend: this.sureSend,
        plImgList: this.plImgList,
      };
      /* 回复他人 */
      if (this.currReplyInfo.replyType) {
        data.replyType = this.currReplyInfo.replyType;
      }
      this.$emit("inputText", data);
      this.$emit("closeImg", null);
      setTimeout(() => {
        this.sureSend = false;
        this.$emit("update:modelValue", false);
        if (uni.getStorageSync("keyboardHeight")) {
          let keyHeight = parseFloat(uni.getStorageSync("keyboardHeight"));
          this.boardHeight = keyHeight;
          this.storagekeyHeight = keyHeight;
        }
      }, 250);
      setTimeout(() => {
        this.turnOn = false;
      }, 500);
    },
    openTool(index) {
      this.browIndex = index;
    },
    onswiperchange(e) {
      let index = e.detail.current;
      this.browIndex = index;
    },
    /* 切换表情 */
    changeBrow() {
      uni.hideKeyboard();
      this.getInputBoard();
      this.showBrow = !this.showBrow;
      if (!this.showBrow) {
        this.isFocus = true;
        this.showText = false;
        this.$nextTick(() => {
          this.showText = true;
        });
      }
      /* 没有键盘高度时，表情显示默认高度为250 */
      if (this.showBrow && this.storagekeyHeight == 0) {
        this.swHeight = 250;
      } else if (!this.showBrow && this.storagekeyHeight == 0) {
        // this.swHeight = 0
      }
    },
    closeBrow(event) {
      event.stopPropagation();
      this.showBrow = false;
      this.getInputBoard();
      /* 没有键盘高度时，表情显示默认高度为250 */
      if (this.showBrow && this.storagekeyHeight == 0) {
        this.swHeight = 250;
      } else if (!this.showBrow && this.storagekeyHeight == 0) {
        // this.swHeight = 0
      }
    },
    /* 插入emoji表情 */
    addTextEmoji(em) {
      this.remarkText += em.emoji;
    },
    /* 添加显示表情图片 */
    addImgPhiz(val) {
      if (this.plImgList.length > 0) {
        uni.showModal({
          content: "是否清空当前图片并重新添加?",
          cancelText: "取消",
          confirmText: "确定",
          success: (res) => {
            if (res.confirm) {
              this.plImgList = [];
              this.phizImg = val.imgUrl;
            }
          },
        });
      } else if (this.phizImg) {
        uni.showModal({
          content: "是否清空当前表情并重新添加?",
          cancelText: "取消",
          confirmText: "确定",
          success: (res) => {
            if (res.confirm) {
              this.phizImg = "";
              this.phizImg = val.imgUrl;
            }
          },
        });
      } else {
        this.phizImg = val.imgUrl;
      }
    },
    /* 打开选择图片 */
    openChooseImage(type) {
      // console.log('打开选择图片===>')
      if (type == 0 && this.plImgList.length > 0) {
        uni.showModal({
          content: "是否清空当前图片并重新添加?",
          cancelText: "取消",
          confirmText: "确定",
          success: (res) => {
            if (res.confirm) {
              this.plImgList = [];
              this.openImage();
            }
          },
        });
      } else if (type == 0 && this.phizImg) {
        uni.showModal({
          content: "是否清空当前表情并重新添加?",
          cancelText: "取消",
          confirmText: "确定",
          success: (res) => {
            if (res.confirm) {
              this.phizImg = "";
              this.openImage();
            }
          },
        });
      } else {
        this.openImage();
      }
    },
    openImage() {
      this.$emit("closeImg", "img");
      uni.chooseImage({
        count: this.chooseCount, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: (res) => {
          // console.log(res);
          this.plImgList = this.plImgList.concat(res.tempFilePaths);
          this.chooseCount = 9 - this.plImgList.length;
        },
      });
    },
    openPreview(data, index) {
      uni.previewImage({
        urls: data,
        current: index ? index : 0,
      });
    },
    deletePlImg(index) {
      this.plImgList.splice(index, 1);
      if (this.plImgList.length > 1) {
        this.chooseCount = 9 - this.plImgList.length;
      } else if (this.plImgList.length == 0) {
        this.chooseCount = 1;
      }
    },
    /* 点击发送按钮 */
    sendBtn() {
      if (!this.remarkText && !this.phizImg && !this.plImgList.length) {
        return false;
      }
      if (!this.remarkText.trim() && !this.phizImg && !this.plImgList.length) {
        uni.showToast({
          title: "表达你的态度在评论吧",
          icon: "none",
        });
        return false;
      }
      this.sureSend = true;
      this.close();
    },
  },
};
</script>

<style scoped>
.f {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}
.f-v-c {
  align-items: center;
}
.fw {
  flex-wrap: wrap;
}
.f-lv-s {
  align-items: center;
  justify-content: space-between;
}
.f-lv-c {
  align-items: center;
  justify-content: center;
}
.mgt7 {
  margin-top: 7px;
}
.mgt10 {
  margin-top: 10px;
}
.mgt15 {
  margin-top: 15px;
}
.mgl7 {
  margin-left: 7px;
}
.mgr10 {
  margin-right: 10px;
}
/* #ifndef APP-NVUE */
page,
view,
scroll-view {
  box-sizing: border-box;
}
::v-deep ::-webkit-scrollbar {
  display: none;
}
/* #endif */
.input-popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  /* bottom: 0; */
  z-index: 301;
  overflow: hidden;
}

.input-mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  /* width: 100%;
		height: 100%; */
}

.input-content {
  position: absolute;
  left: 0;
  bottom: 0;
  background: #fff;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  /* transition-duration: .2s;
		transition-property: transform, opacity, height;
		transition-timing-function: ease; */
}
.input-content-top {
  padding: 10px 15px 0 15px;
}
.input-content-top-box {
  border-radius: 10px;
  background-color: #f3f3f3;
  padding: 10px 13px;
}
.input-content-top-textarea {
  font-size: 15px;
  color: #000;
  /* #ifndef APP-NVUE */
  overflow-y: auto;
  /* #endif */
}
.input-content-top-box-bqtp {
  width: 70px;
  height: 70px;
  position: relative;
  margin-top: 15px;
}
.input-content-top-box-bqtp-img {
  width: 70px;
  height: 70px;
  border-radius: 4px;
  border: 1rpx solid #e8e8e8;
}
.input-content-top-box-addImg {
  margin-top: 15px;
  width: 70px;
  height: 70px;
  border-radius: 4px;
  border: 1rpx solid #e8e8e8;
  background-color: #fff;
}
.input-content-top-box-addImg-img {
  width: 25px;
  height: 25px;
}

.input-content-top-box-del {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 17px;
  height: 17px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 17px;
}
.input-content-top-box-del-img {
  width: 13px;
  height: 13px;
}
.input-operate {
  height: 45px;
  padding: 0 15px;
  border-bottom: 1px solid #f3f3f3;
}
.input-operate-img {
  width: 20px;
  height: 20px;
  margin-right: 30px;
}
.input-operate-icon {
  width: 20px;
  height: 20px;
}
.input-operate-at {
  font-size: 21px;
  color: #666666;
  font-weight: bold;
  margin-right: 30px;
}
.input-operate-send {
  width: 55px;
  height: 30px;
  border: 1px solid #f3f3f3;
  border-radius: 30px;
}
.input-operate-send-text {
  font-size: 15px;
  color: #999;
}
.sendActive {
  color: #fff;
  background-color: #fc2451;
  border: 1px solid #fc2451;
}
.input-phiz {
  position: absolute;
  height: 45px;
  padding: 0 15px;
}
.input-phiz-text {
  font-size: 22px;
}
.input-tool {
  position: absolute;
  height: 45px;
  padding: 0 15px;
  background-color: #fff;
}
.input-tool-item {
  width: 55px;
  height: 37px;
  border-radius: 35px;
}
.itemActive {
  background-color: #f3f3f3;
}
.input-tool-item-img {
  width: 27px;
  height: 27px;
}
.input-swiper {
  position: absolute;
  background-color: #f7f7f7;
}
.input-swiper-item {
  flex: 1;
  padding-left: 15px;
}
.input-swiper-item-bqtb {
  margin-bottom: 15px;
  margin-right: 15px;
}
.input-swiper-item-bqtb-text {
  font-size: 26px;
}
.input-swiper-item-addbq {
  background-color: #ececec;
  border-radius: 10px;
  margin-bottom: 15px;
  margin-right: 15px;
}
.input-swiper-item-bqImg {
  margin-bottom: 15px;
  margin-right: 15px;
}
.input-swiper-item-addbq-text {
  font-size: 30px;
  color: #666666;
}
</style>
