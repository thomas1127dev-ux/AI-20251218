<template>
	<view class="operate-popup" :style="{height: screenHeight + 'px'}" v-if="value">
		<!-- 遮罩层 -->
		<view class="operate-mask" @click="close" :style="{width: screenWidth+'px',height: screenHeight+'px'}"></view>

		<!-- 内容区域 -->
		<view class="operate-content" :style="{width: screenWidth+'px',height: commentHeight+'px',
		 transform: `translateY(${showPopup ? 0 : commentHeight}px)`}" @click="clickStop">
			<scroll-view class="operate-content-box" scroll-y :show-scrollbar="false" :style="{width: screenWidth+'px',height: commentHeight - 15 +'px'}">
				
				<view class="operate-box">
					<view class="operate-box-item">
						<view class="operate-box-item-row f f-v-c">
							<view class="operate-box-item-row-avatar">
								<!-- <image class="operate-box-item-row-avatar-img" src="/static/tsp-icon/touxiang.jpg"></image> -->
							</view>
							<view class="fx1 operate-box-item-row-right row-border f f-v-c">
								<text class="operate-box-item-row-title">推荐</text>
							</view>
						</view>
						<view class="operate-box-item-row f f-v-c">
							<view class="operate-box-item-row-avatar">
								<image class="operate-box-item-row-avatar-img" src="/static/tsp-icon/touxiang.jpg"></image>
							</view>
							<view class="fx1 operate-box-item-row-right f f-v-c">
								<text class="operate-box-item-row-title">转发评论到日常</text>
							</view>
						</view>
					</view>
					<view class="operate-box-item">
						<view class="operate-box-item-row f f-v-c">
							<view class="operate-box-item-row-avatar">
								<!-- <image class="operate-box-item-row-avatar-img" src="/static/tsp-icon/touxiang.jpg"></image> -->
							</view>
							<view class="fx1 operate-box-item-row-right row-border f f-v-c">
								<text class="operate-box-item-row-title">不感兴趣</text>
							</view>
						</view>
						<view class="operate-box-item-row f f-v-c">
							<view class="operate-box-item-row-avatar"></view>
							<view class="fx1 operate-box-item-row-right f f-v-c">
								<text class="operate-box-item-row-title">举报</text>
							</view>
						</view>
					</view>
					<view class="operate-box-item">
						<view class="operate-box-item-row f f-v-c">
							<view class="operate-box-item-row-avatar">
								<image class="operate-box-item-row-avatar-img" src="/static/tsp-icon/touxiang.jpg"></image>
							</view>
							<view class="fx1 operate-box-item-row-right row-border f f-v-c">
								<text class="operate-box-item-row-title">倍数</text>
								<view class="operate-box-item-bs f f-v-c">
									<text class="operate-box-item-bs-text" v-for="(item,index) in multipleList" :key="index"
									 :class="[multipleVod == item ? 'bsActive':'']" @click="setTheMultiplier(item)">
										{{item}}
									</text>
								</view>
							</view>
						</view>
						<view class="operate-box-item-row f f-v-c">
							<view class="operate-box-item-row-avatar">
								<image class="operate-box-item-row-avatar-img" src="/static/tsp-icon/tsp-fd.png"></image>
							</view>
							<view class="fx1 operate-box-item-row-right f f-v-c">
								<text class="operate-box-item-row-title">清屏播放</text>
							</view>
						</view>
					</view>
					<view class="operate-box-item">
						<view class="operate-box-item-row f f-v-c">
							<view class="operate-box-item-row-avatar"></view>
							<view class="fx1 operate-box-item-row-right f f-v-c">
								<text class="operate-box-item-row-title">听抖音</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
			},
			/* tabBar栏 0系统tabBar栏 1自定义tabBar栏 */
			tabBarShow: {
				type: Number,
				default: 0
			},
			/* 底部栏的高度 */
			tabBarHeight: {
				type: Number,
				// #ifdef APP-PLUS || H5
				default: 60
				// #endif

				// #ifndef APP-PLUS || H5
				default: 60
				// #endif
			},
			longDataInfo: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				showPopup: false,
				screenWidth: 0, //屏幕的宽度
				screenHeight: 0, //屏幕的高度
				commentHeight: 0 ,//内容区域的高度
				multipleList: ['0.8', '1.0', '1.25', '1.5', '2.0'], //倍速
				multipleVod: '1.0', //当前倍数
				openVodMultipleIndex: null //已经打开视频菜单的下标
			}
		},
		watch: {
			value(val) {
				if (val) {
					setTimeout(() => {
						if(this.openVodMultipleIndex != this.longDataInfo.vodCurIndex){
							this.openVodMultipleIndex = this.longDataInfo.vodCurIndex
							this.multipleVod = '1.0'
						}
						this.showPopup = val
					}, 50)
				} else {
					this.showPopup = false
				}
			}
		},
		created() {
			const deviceInfo = uni.getSystemInfoSync()
			this.screenWidth = deviceInfo.screenWidth //屏幕的宽度
			if (this.tabBarShow == 1) { //减去自定义底部栏的高度
				this.screenHeight = deviceInfo.screenHeight - this.tabBarHeight
			} else {
				this.screenHeight = deviceInfo.windowHeight
			}
			this.commentHeight = this.screenHeight / 1.5 //评论内容区域的高度
		},
		methods: {
			clickStop(event) {
				event.stopPropagation()
			},
			close() {
				this.showPopup = false
				setTimeout(() => {
					this.$emit('input', false)
				}, 250)
			},
			/* 设置倍数 */
			setTheMultiplier(val){
				console.log('设置倍数===>',val)
				this.multipleVod = val
				this.$emit('updateMultiplier', val)
			}
		}
	}
</script>

<style scoped>
	.f {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.fx1{
		flex: 1;
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
	.fw{
		flex-direction: column;
	}
	.fw-c{
		flex-direction: column;
		align-items: center;
	}
	
	/* #ifndef APP-NVUE */
	page, view, scroll-view{
	  box-sizing: border-box;
	}
	::v-deep ::-webkit-scrollbar {
	  display: none;
	}
	/* #endif */
	
	/*字体单行省略*/
	.text_one {
		/* #ifndef APP-NVUE */
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		/* #endif */
	
		/* #ifdef APP-NVUE */
		lines: 1;
		/* #endif */
	}

	.operate-popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		z-index: 301;
		overflow: hidden;
	}

	.operate-mask {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.operate-content {
		position: absolute;
		left: 0;
		bottom: 0;
		background: #f5f5f5;
		border-radius: 20rpx 20rpx 0 0;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		transition-duration: .2s;
		transition-property: transform, opacity, height;
		transition-timing-function: ease;
	}
	
	.operate-content-box{
		position: absolute;
		bottom: 0;
		left: 0;
	}
	
	
	.operate-box{
		padding: 0 15px 15px 15px;
	}
	.operate-box-item{
		margin-bottom: 12px;
		background-color: #fff;
		border-radius: 8px;
		overflow: hidden;
	}
	.operate-box-item-row{
		height: 50px;
	}
	.operate-box-item-row-avatar{
		width: 27px;
		height: 27px;
		margin: 0 15px;
	}
	.operate-box-item-row-avatar-img{
		width: 27px;
		height: 27px;
	}
	.operate-box-item-row-right{
		height: 50px;
	}
	.row-border{
		border-bottom: 1px solid #E5E5E6;
	}
	.operate-box-item-row-title{
		font-size: 14px;
		color: #333;
	}
	.operate-box-item-bs{
		margin-left: 30px;
		flex: 1;
	}
	.operate-box-item-bs-text{
		font-size: 13px;
		color: #666;
		flex: 1;
	}
	.bsActive{
		color: #FF2255;
	}
</style>