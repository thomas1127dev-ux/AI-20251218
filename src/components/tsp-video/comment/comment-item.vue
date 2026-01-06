<template>
  <view>
    <view
      class="comment-list-item f"
      :ref="'commentId' + index"
      @touchstart="textViewStart($event, item, index)"
      @touchmove="textViewMove($event, item, index)"
      @touchend="textViewEnd($event, item, index)"
      @longpress="longpressText($event, item, index)"
      @click="openPlReply('pl', item, index)"
      :class="[item.selectedRow ? 'list-item-active' : '']"
    >
      <view>
        <image
          class="comment-list-item-avatar"
          :src="item.user_avatar"
          mode="aspectFill"
        ></image>
      </view>
      <view
        class="comment-list-item-right"
        :style="{ width: screenWidth - 80 + 'px' }"
      >
        <view class="f f-v-c">
          <text class="comment-list-item-title">{{ item.user_nickname }}</text>
          <text class="comment-list-item-author boxSizing" v-if="item.author"
            >作者</text
          >
        </view>
        <!-- foldShow  折叠评论 -->
        <view
          class="mgt7"
          :class="[item.foldShow ? 'comment-list-item-list' : '']"
        >
          <!-- 文本内容 -->
          <view>
            <commentText
              :index="index"
              v-if="item.textShow"
              :conText="item.content"
              :item="item"
              @packUpText="packUpText"
            ></commentText>
          </view>

          <!-- 图集 -->
          <view
            class="mgt7 f f-v-c"
            v-if="item.imgList && item.imgList.length > 1"
          >
            <view
              :class="[imgIdx == 1 ? 'gallery-spacing' : '']"
              v-for="(itemImg, imgIdx) in item.imgList"
              :key="imgIdx"
              :style="{
                width: galleryPlwidth + 'px',
                height: galleryPlwidth + 'px',
                position: 'relative',
              }"
              @click="previewImg(item.imgList, imgIdx)"
            >
              <image
                class="comment-list-item-imgBox-img"
                :src="itemImg"
                mode="aspectFill"
                v-if="imgIdx < 3"
                :style="{
                  width: galleryPlwidth + 'px',
                  height: galleryPlwidth + 'px',
                }"
              ></image>
              <view
                class="comment-list-item-imgPoint f f-lv-c"
                v-if="item.imgList.length > 3 && imgIdx == 2"
              >
                <image
                  src="/static/tsp-icon/tsp-img.png"
                  class="comment-list-item-imgPoint-img"
                >
                </image>
                <text class="comment-list-item-imgPoint-text"
                  >+{{ item.imgList.length - 3 }}</text
                >
              </view>
            </view>
          </view>
          <!-- 单图 -->
          <view
            class="mgt7 f f-v-c"
            v-if="item.imgList && item.imgList.length == 1"
          >
            <view
              v-for="(itemImg, imgIdx) in item.imgList"
              :key="imgIdx"
              @click="previewImg(item.imgList, imgIdx)"
            >
              <view :class="[!item.imgWidth ? 'comment-list-item-list' : '']">
                <image
                  class="comment-list-item-imgBox-img"
                  :src="itemImg"
                  mode="aspectFill"
                  @load="loadImage($event, 'pl', item, index)"
                  :style="{
                    width: item.imgStyle.width,
                    height: item.imgStyle.height,
                  }"
                ></image>
              </view>
            </view>
          </view>
          <!-- 表情 -->
          <view
            class="mgt7 f f-v-c"
            v-if="item.phizImg"
            @click="previewImg([item.phizImg], 0)"
          >
            <image
              class="comment-list-item-bqImg"
              :class="[screenWidth > 500 ? 'bqImgWhPx' : 'bqImgWhRpx']"
              :src="item.phizImg"
              mode="aspectFill"
            ></image>
          </view>
        </view>
        <view class="f f-lv-s" :class="[item.foldShow ? '' : 'mgt7']">
          <view class="f f-v-c" v-if="item.foldShow">
            <image
              src="/static/tsp-icon/tsp-dzcaiZd.png"
              class="comment-list-item-caiImg"
            ></image>
            <text class="comment-list-item-zbdz">该评论已被折叠</text>
          </view>
          <view class="f f-v-c" v-else>
            <text class="comment-list-item-zbdz">{{ item.create_time }}</text>
            <!-- <text class="comment-list-item-fh">·</text> -->
            <text class="comment-list-item-zbdz">{{ item.ipAddres }}</text>
            <!-- <text class="comment-list-item-reply">回复</text> -->
          </view>
          <view class="f f-v-c">
            <view
              class="f f-v-c comment-list-item-dzmgr"
              @click.stop="plLikeBtn('pl', item, index)"
            >
              <view
                class="comment-list-item-dzImg"
                :class="[
                  item.likeeffect == true
                    ? 'fabulous-taoxin'
                    : item.likeeffect == false
                    ? 'cancel-taoxin'
                    : '',
                ]"
                :ref="'likePlRef' + index"
              >
                <image
                  src="/static/tsp-icon/tsp-dztxSed.png"
                  class="comment-list-item-dzImg"
                  v-if="item.is_liked"
                ></image>
                <image
                  src="/static/tsp-icon/tsp-dztx.png"
                  class="comment-list-item-dzImg"
                  v-else
                >
                </image>
              </view>
              <text class="comment-list-item-dzNum">{{
                item.likeCount || "0"
              }}</text>
            </view>
            <!-- <view class="comment-list-item-dzImg" @click="foldCommentBtn('cai', item, index)">
							<image src="/static/tsp-icon/tsp-dzcaiSed.png" class="comment-list-item-dzImg"
								v-if="item.is_liked"></image>
							<image src="/static/tsp-icon/tsp-dzcai.png" class="comment-list-item-dzImg" v-else></image>
						</view> -->
          </view>
        </view>
      </view>
    </view>
    <view class="f contBox">
      <view class="contBox-left"></view>
      <view class="mgl5">
        <!--******************* 回复列表 *************************-->
        <view v-if="item.listTotal > 0">
          <view v-for="(it, i) in item.list" :key="i">
            <!--  :class="[!it.expand ? 'foldHeight':'']" -->
            <view v-if="it.expand">
              <!-- v.show 控制延迟显示，解决渲染会闪烁的问题 -->
              <view
                class="f contBox-item"
                v-for="(v, idx) in it.list"
                :key="idx"
                :ref="'commentId' + index + i + idx"
                :id="'commentId' + index + i + idx"
                :class="[
                  v.show ? 'mgb5' : 'comment-list-item-list',
                  v.selectedRow ? 'list-item-active' : '',
                ]"
                :style="{ width: screenWidth - 60 + 'px' }"
                @touchstart="textViewStart($event, item, index, i, idx)"
                @touchmove="textViewMove($event, item, index, i, idx)"
                @touchend="textViewEnd($event, item, index, i, idx)"
                @longpress="longpressText($event, item, index, i, idx)"
              >
                <view>
                  <image
                    class="comment-list-item-avatarHf"
                    :src="v.avatar"
                    mode="aspectFill"
                  ></image>
                </view>
                <view class="comment-list-item-right">
                  <view
                    class="f f-v-c"
                    @click="openHfReply('hf', item, v, index, i, idx)"
                  >
                    <text class="comment-list-item-title">{{
                      v.user_nickname || v.username
                    }}</text>
                    <text
                      class="comment-list-item-author boxSizing"
                      v-if="v.author"
                      >作者</text
                    >
                    <!-- 回复人昵称 -->
                    <view class="f f-v-c" v-if="v.reply_to_user_nickname">
                      <text
                        class="comment-list-item-title"
                        style="margin: 0 5px"
                        >回复</text
                      >
                      <text class="comment-list-item-title">{{
                        v.reply_to_user_nickname
                      }}</text>
                    </view>
                  </view>
                  <view
                    class="mgt7"
                    :class="[v.foldShow ? 'comment-list-item-list' : '']"
                  >
                    <!-- <text class="comment-list-item-contText" :style="{width: screenWidth - 110 +'px'}">{{v.content}}</text> -->

                    <!-- 文本内容 -->
                    <view :style="{ width: screenWidth - 120 + 'px' }">
                      <commentText
                        v-if="v.textShow"
                        :index="index"
                        :i="i"
                        :idx="idx"
                        :item="v"
                        showType="hf"
                        :conText="v.content"
                        @packUpText="packUpText"
                      >
                      </commentText>
                    </view>

                    <!-- 图集 -->
                    <view
                      class="mgt7 f f-v-c"
                      v-if="v.imgList && v.imgList.length > 1"
                    >
                      <view
                        :class="[imgIdx == 1 ? 'gallery-spacing' : '']"
                        v-for="(itemImg, imgIdx) in v.imgList"
                        :key="imgIdx"
                        :style="{
                          width: galleryHfwidth + 'px',
                          height: galleryHfwidth + 'px',
                          position: 'relative',
                        }"
                        @click="previewImg(v.imgList, imgIdx)"
                      >
                        <image
                          class="comment-list-item-imgBox-img"
                          :src="itemImg"
                          mode="aspectFill"
                          v-if="imgIdx < 3"
                          :style="{
                            width: galleryHfwidth + 'px',
                            height: galleryHfwidth + 'px',
                          }"
                        >
                        </image>
                        <view
                          class="comment-list-item-imgPoint f f-lv-c"
                          v-if="v.imgList.length > 3 && imgIdx == 2"
                        >
                          <image
                            src="/static/tsp-icon/tsp-img.png"
                            class="comment-list-item-imgPoint-img"
                          ></image>
                          <text class="comment-list-item-imgPoint-text"
                            >+{{ v.imgList.length - 3 }}</text
                          >
                        </view>
                      </view>
                    </view>
                    <!-- 单图 -->
                    <view
                      class="mgt7 f f-v-c"
                      v-if="v.imgList && v.imgList.length == 1"
                    >
                      <view
                        v-for="(itemImg, imgIdx) in v.imgList"
                        :key="imgIdx"
                        @click="previewImg(v.imgList, imgIdx)"
                      >
                        <view
                          :class="[!v.imgWidth ? 'comment-list-item-list' : '']"
                        >
                          <image
                            class="comment-list-item-imgBox-img"
                            :src="itemImg"
                            mode="aspectFill"
                            @load="loadImage($event, 'hf', v, index, i, idx)"
                            :style="{
                              width: v.imgStyle.width,
                              height: v.imgStyle.height,
                            }"
                          >
                          </image>
                        </view>
                      </view>
                    </view>
                    <!-- 表情 -->
                    <view
                      class="mgt7 f f-v-c"
                      v-if="v.phizImg"
                      @click="previewImg([v.phizImg], 0)"
                    >
                      <image
                        class="comment-list-item-bqImg"
                        :class="[
                          screenWidth > 500 ? 'bqImgWhPx' : 'bqImgWhRpx',
                        ]"
                        :src="v.phizImg"
                        mode="aspectFill"
                      ></image>
                    </view>
                  </view>
                  <view class="f f-lv-s" :class="[v.foldShow ? '' : 'mgt7']">
                    <view class="f f-v-c" v-if="v.foldShow">
                      <image
                        src="/static/tsp-icon/tsp-dzcaiZd.png"
                        class="comment-list-item-caiImg"
                      ></image>
                      <text class="comment-list-item-zbdz">该评论已被折叠</text>
                    </view>
                    <view
                      class="f f-v-c"
                      v-else
                      @click="openHfReply('hf', item, v, index, i, idx)"
                    >
                      <text class="comment-list-item-zbdz">{{ v.time }}</text>
                      <text class="comment-list-item-fh">·</text>
                      <text class="comment-list-item-zbdz">{{
                        v.ipAddres
                      }}</text>
                      <text class="comment-list-item-reply">回复</text>
                    </view>
                    <view class="f f-v-c">
                      <view
                        class="f f-v-c comment-list-item-dzmgr"
                        @click="plLikeBtn('hf', v, index, i, idx)"
                      >
                        <view
                          class="comment-list-item-dzImg"
                          :ref="'likeHfRef' + index + i + idx"
                          :class="[
                            v.likeeffect == true
                              ? 'fabulous-taoxin'
                              : v.likeeffect == false
                              ? 'cancel-taoxin'
                              : '',
                          ]"
                        >
                          <image
                            src="/static/tsp-icon/tsp-dztxSed.png"
                            class="comment-list-item-dzImg"
                            v-if="v.likeShow"
                          ></image>
                          <image
                            src="/static/tsp-icon/tsp-dztx.png"
                            class="comment-list-item-dzImg"
                            v-else
                          ></image>
                        </view>
                        <text class="comment-list-item-dzNum" v-if="v.likes">{{
                          v.likes
                        }}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- loading加载 -->
        <!-- #ifndef APP-NVUE -->
        <view
          class="comment-list-item-loading f f-lv-c mgt5"
          v-if="item.loadShow"
          :style="{ width: screenWidth / 2.1 + 'px' }"
        >
          <tspLoading :lodingSxSize="10" />
        </view>
        <!-- #endif -->

        <!-- #ifdef APP-NVUE -->
        <view
          class="comment-list-item-loading f f-v-c mgt5"
          v-if="item.loadShow"
          :style="{ width: screenWidth / 2.1 + 'px' }"
        >
          <tspLoading :loadingType="3" />
        </view>
        <!-- #endif -->

        <!-- 占位，不然回复列表的最后一个 mgb5 样式不生效 -->
        <view style="height: 0.1px"></view>

        <!--********************************** 展开回复 *****************************-->
        <view class="f f-v-c mgt5" v-if="item.listTotal > 0 && !item.loadShow">
          <view>
            <view
              class="f f-v-c"
              v-if="item.expandNum < item.listTotal"
              @click="openUpComment(item, index)"
            >
              <view class="comment-list-item-zkhfFg"></view>
              <text class="comment-list-item-zkhfText" v-if="item.expandNum > 0"
                >展开更多</text
              >
              <text class="comment-list-item-zkhfText" v-else
                >展开{{ item.listTotal }}条回复</text
              >
              <view class="comment-list-item-zkhfZk">
                <image
                  src="/static/tsp-icon/tsp-zk.png"
                  class="comment-list-item-zkhfZk"
                ></image>
              </view>
            </view>
          </view>
          <view>
            <view
              class="f f-v-c mgl20"
              v-if="item.expandNum > 0"
              @click="packUpComment(item, index)"
            >
              <view
                class="comment-list-item-zkhfFg"
                v-if="item.expandNum >= item.listTotal"
              ></view>
              <text class="comment-list-item-zkhfText">收起</text>
              <view class="comment-list-item-zkhfSq">
                <image
                  src="/static/tsp-icon/tsp-zk.png"
                  class="comment-list-item-zkhfSq"
                ></image>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin("dom");
const animation = uni.requireNativePlugin("animation");
// #endif
import tspLoading from "../tsp-load/tsp-loading.vue";
import commentText from "./comment-text.vue";
import { addContentLike } from "@/api/common";
export default {
  components: {
    tspLoading,
    commentText,
  },
  props: {
    //下标索引
    index: {
      type: Number,
      default: 0,
    },
    //当前对象
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    screenWidth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      galleryPlwidth: 0, //评论图集的宽度
      galleryHfwidth: 0, //回复评论图集的宽度
      /* 点赞动画 */
      likeDropList: {
        list: [
          { transform: "scale(1)" },
          { transform: "scale(0)" },
          { transform: "scale(0.5)" },
          { transform: "scale(1)" },
          { transform: "scale(1.2)" },
          { transform: "scale(1)" },
          { transform: "scale(1.1)" },
          { transform: "scale(1)" },
        ],
        duration: 62,
      },
      /* 取消点赞动画 */
      likeCancelList: {
        list: [
          { transform: "scale(1)" },
          { transform: "scale(0.7)" },
          { transform: "scale(1)" },
        ],
        duration: 66,
      },
      textTimeOut: null,
    };
  },
  created() {
    //减去所有外边距
    if (this.screenWidth > 500) {
      this.galleryPlwidth = 120;
      this.galleryHfwidth = 100;
    } else {
      this.galleryPlwidth = (this.screenWidth - 90) / 3;
      this.galleryHfwidth = (this.screenWidth - 121) / 3;
    }
  },
  methods: {
    /* 点击评论列表中的回复打开输入框 */
    openPlReply(type, item, index) {
      console.log("comment-item openPlReply 被调用", type, item, index);
      this.$emit("openPlReply", type, item, index);
    },
    openHfReply(type, item, val, index, i, idx) {
      this.$emit("openHfReply", type, item, val, index, i, idx);
    },
    /* 展开评论 */
    openUpComment(item, index) {
      this.$emit("openUpComment", item, index);
    },
    /* 收起评论 */
    packUpComment(item, index) {
      this.packUpDataView("sqpl", item, index);
    },
    /* 收起文本 */
    packUpText(type, obj, index, i, idx) {
      /* 定位未展开时的位置 */
      if (obj.isOmit && !obj.isLoadText) {
        this.packUpDataView("sqwb", this.item, index, i, idx);
      }

      this.$nextTick(() => {
        //收起成功，更新数据
        this.$emit("updataLike", "sqwb", obj, index, i, idx);
      });
    },
    packUpDataView(type, item, index, i, idx) {
      let view = "commentId" + index;
      if (i >= 0 && idx >= 0) {
        view = "commentId" + index + i + idx;
      }
      // #ifdef APP-NVUE
      let el = this.$refs[view];
      if (i >= 0 && idx >= 0) {
        el = this.$refs[view][0];
      }
      if (i >= 0 && idx >= 0) {
        /* app nvue list组件无法精准定位到子节点 */
        // this.scrollRefToView(el,type)
      } else {
        this.$emit("packUpComment", type, item, index, el);
      }
      // #endif

      // #ifndef APP-NVUE
      this.$emit("packUpComment", type, item, index, view);
      // #endif
    },
    scrollRefToView(view, type) {
      let el = this.$refs[view];
      this.$nextTick(() => {
        dom.scrollToElement(type == "sqwb" ? view : el, {
          offset: 0,
          animated: type == "sqwb" ? true : false,
        });
      });
    },
    /* 评论图片加载完成 */
    loadImage(event, type, item, index, i, idx) {
      let objItem = Object.assign({}, item);
      objItem.imgWidth = event.detail.width;
      objItem.imgHeight = event.detail.height;
      /* 判断屏幕宽度 > 500 的则使用px单位，避免rpx单位在平板上显示很大的问题 */
      if (objItem.imgWidth == objItem.imgHeight) {
        //方形图
        objItem.imgStyle = {
          width: this.screenWidth > 500 ? "160px" : "335rpx",
          height: this.screenWidth > 500 ? "160px" : "335rpx",
        };
      } else if (objItem.imgWidth > objItem.imgHeight) {
        //宽图
        objItem.imgStyle = {
          width: this.screenWidth > 500 ? "160px" : "335rpx",
          height: this.screenWidth > 500 ? "110px" : "242rpx",
        };
      } else {
        //高图
        objItem.imgStyle = {
          width: this.screenWidth > 500 ? "126px" : "252rpx",
          height: this.screenWidth > 500 ? "166px" : "332rpx",
        };
      }
      this.$emit("updataComment", type, objItem, index, i, idx);
    },
    /* 预览图片 */
    previewImg(data, index) {
      uni.previewImage({
        urls: data,
        current: index ? index : 0,
      });
    },
    /* 点赞 */
    plLikeBtn(type, item, index, i, idx) {
      let obj = Object.assign({}, item);
      obj.is_liked = !obj.is_liked;
      obj.likeeffect = obj.is_liked; // 设置点赞动效状态
      obj.likeCount = obj.is_liked
        ? (obj.likeCount || 0) + 1
        : Math.max((obj.likeCount || 0) - 1, 0);
      let nameRef =
        type == "hf" ? "likeHfRef" + index + i + idx : "likePlRef" + index;

      // 调用点赞接口
      addContentLike({ target_id: obj.id })
        .then((res) => {
          console.log("评论点赞成功", res);
        })
        .catch((err) => {
          console.log("评论点赞失败", err);
        });

      // #ifdef APP-NVUE
      this.likeNum = 0;
      let result = obj.is_liked ? this.likeDropList : this.likeCancelList;
      this.addAnimation(nameRef, result, this.likeNum, type); //点赞动画
      // #endif

      this.$emit("updataLike", type, obj, index, i, idx); //点赞成功，更新数据

      // 动画播放完后清除动效状态
      setTimeout(() => {
        let clearObj = Object.assign({}, obj);
        clearObj.likeeffect = null;
        this.$emit("updataLike", type, clearObj, index, i, idx);
      }, 500); // 动画持续时间为 0.5s
    },
    /* 踩、折叠评论 */
    foldCommentBtn(type, item, index, i, idx) {
      let obj = Object.assign({}, item);
      obj.is_liked = !obj.is_liked;
      this.$emit("updataLike", type, obj, index, i, idx); //踩赞成功，更新数据

      /* if(obj.foldShow){
					let view = 'commentId'+ index
					// #ifdef APP-NVUE
					let el = this.$refs[view]
					this.$emit('packUpComment', 'cai', item,index,el)
					// #endif
					
					// #ifndef APP-NVUE
					this.$emit('packUpComment', 'cai', item,index,view)
					// #endif
				} */
    },
    /* 动画方法 */
    addAnimation(name, dataList, num, type) {
      // #ifdef APP-NVUE
      let testEl = type == "hf" ? this.$refs[name][0] : this.$refs[name];
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
            this.addAnimation(name, dataList, num, type);
          }
        }
      );
      // #endif
    },
    /* 选中当前行 */
    textViewStart(event, item, index, i, idx) {
      event.stopPropagation();
      clearTimeout(this.textTimeOut);
      this.textTimeOut = setTimeout(() => {
        let obj = Object.assign({}, item);
        obj.selectedRow = true;
        this.$emit("updataLike", "xzwb", obj, index, i, idx); //更新数据
      }, 100);
    },
    textViewMove(event, item, index, i, idx) {
      event.stopPropagation();
      if (this.textTimeOut) {
        clearTimeout(this.textTimeOut);
        clearTimeout(this.longTimeOut);
        let obj = Object.assign({}, item);
        obj.selectedRow = false;
        this.$emit("updataLike", "xzwb", obj, index, i, idx); //更新数据
      }
    },
    textViewEnd(event, item, index, i, idx) {
      event.stopPropagation();
      clearTimeout(this.textTimeOut);
      clearTimeout(this.longTimeOut);
      this.textTimeOut = setTimeout(() => {
        let obj = Object.assign({}, item);
        obj.selectedRow = false;
        this.$emit("updataLike", "xzwb", obj, index, i, idx); //更新数据
      }, 100);
    },
    /* 长按评论 */
    longpressText(event, item, index, i, idx) {
      /* 长按显示评论操作 */
      clearTimeout(this.longTimeOut);
      this.longTimeOut = setTimeout(() => {
        clearTimeout(this.textTimeOut);
        this.$emit("reviewOperation", item, index, i, idx); //显示弹窗
      }, 100);
    },
  },
};
</script>

<style scoped>
/* #ifndef APP-NVUE */
view,
scroll-view {
  box-sizing: border-box;
}

/* #endif */

.f {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.f-v-c {
  align-items: center;
}

.f-lv-s {
  align-items: center;
  justify-content: space-between;
}

.f-lv-c {
  align-items: center;
  justify-content: center;
}

.mgt5 {
  margin-top: 5px;
}

.mgb5 {
  margin-bottom: 5px;
}

.mgl5 {
  margin-left: 5px;
}

.mgt7 {
  margin-top: 7px;
}

.mgt8 {
  margin-top: 8px;
}

.mgt10 {
  margin-top: 10px;
}

.mgl10 {
  margin-left: 10px;
}

.mgt15 {
  margin-top: 15px;
}

.mgl20 {
  margin-left: 20px;
}

.comment-list-item {
  padding: 10px 15px;
  align-items: flex-start;
  /* background-color: #f5f5f5; */
}

.list-item-active {
  background-color: #f5f5f5;
}

.foldHeight {
  height: 0;
  overflow: hidden;
}

.comment-list-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: 1rpx solid #e8e8e8;
}

.comment-list-item-list {
  height: 0;
  overflow: hidden;
}

.comment-list-item-avatarHf {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 1rpx solid #e8e8e8;
}

.comment-list-item-right {
  margin-left: 10px;
  flex: 1;
}

.comment-list-item-title {
  font-size: 13px;
  color: #bebebe;
}

.comment-list-item-author {
  margin-left: 5px;
  padding: 1px 5px;
  border-radius: 3px;
  background-color: red;
  font-size: 10px;
  color: #fff;
}

.comment-list-item-hfImg {
  width: 10px;
  height: 10px;
  margin: 0 5px;
}

.comment-list-item-contText {
  flex: 1;
  font-size: 15px;
  color: #333;
  line-height: 23px;
}

.comment-list-item-contText-zk {
  margin-top: 3px;
  color: #999;
  font-size: 14px;
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
}

/*字体省略*/
.textOmit {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  height: 115px;
  overflow: hidden;
}

.gallery-spacing {
  margin: 0 5px;
}

.comment-list-item-imgBox-img {
  border-radius: 5px;
}

.comment-list-item-bqImg {
  border-radius: 3px;
}

.bqImgWhPx {
  width: 97px;
  height: 97px;
  border: 1rpx solid #e8e8e8;
}

.bqImgWhRpx {
  width: 204rpx;
  height: 204rpx;
  border: 1rpx solid #e8e8e8;
}

.comment-list-item-imgPoint {
  position: absolute;
  right: 4px;
  bottom: 4px;
  background-color: rgba(0, 0, 0, 0.35);
  width: 35px;
  height: 15px;
  border-radius: 4px;
}

.comment-list-item-imgPoint-text {
  font-size: 11px;
  color: #fff;
}

.comment-list-item-imgPoint-img {
  width: 11px;
  height: 11px;
  margin-right: 3px;
}

.comment-list-item-zbdz {
  font-size: 13px;
  color: #bebebe;
}

.comment-list-item-fh {
  font-size: 13px;
  color: #bebebe;
  margin: 0 3px;
}

.comment-list-item-reply {
  margin-left: 15px;
  font-size: 13px;
  color: #666;
}

.comment-list-item-dzmgr {
  margin-right: 20px;
}

.comment-list-item-dzImg {
  width: 18px;
  height: 18px;
}

.comment-list-item-caiImg {
  width: 13px;
  height: 13px;
  margin-right: 2px;
}

.comment-list-item-dzNum {
  font-size: 13px;
  color: #999;
  margin-left: 2px;
}

.comment-list-item-loading {
  height: 20px;
}

/* #ifndef APP-NVUE */
.fabulous-taoxin {
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

.cancel-taoxin {
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

/* #endif */
.comment-list-item-zkhfFg {
  width: 20px;
  height: 1px;
  background-color: #e4e4e2;
}

.comment-list-item-zkhfText {
  margin-left: 7px;
  font-size: 13px;
  color: #999;
}

.comment-list-item-zkhfZk {
  margin-left: 2px;
  width: 17px;
  height: 17px;
}

.comment-list-item-zkhfSq {
  margin-left: 2px;
  width: 17px;
  height: 17px;
  transform: rotate(90deg);
}

.contBox {
  padding-left: 15px;
  margin-bottom: 5px;
}

.contBox-item {
  /* background-color: #f5f5f5; */
  padding: 5px 15px 5px 5px;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
}

.contBox-left {
  width: 40px;
  height: 1px;
}
</style>
