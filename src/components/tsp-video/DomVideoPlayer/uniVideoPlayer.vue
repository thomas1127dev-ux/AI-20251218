<template>
	<view :style="{width:videoStyle.width,height:videoStyle.height,position:'relative'}">
		<!-- #ifndef APP-NVUE -->
		<video :style="{width:videoStyle.width,height:videoStyle.height}" :src="item.vodUrl" :controls="optionVod.controls" :danmu-btn="optionVod.danmuBtn" :enable-danmu="optionVod.enableDanmu"
			:enable-progress-gesture="optionVod.enableProgressGesture" :show-loading="optionVod.showLoading" :show-play-btn="optionVod.showPlayBtn" :show-center-play-btn="optionVod.showCenterPlayBtn"
			:show-fullscreen-btn="optionVod.showFullscreenBtn" :vslide-gesture-in-fullscreen="optionVod.vslideGestureInFullscreen" :show-progress="optionVod.showProgress"
			:object-fit="item.object_fit" :http-cache="true" :loop="loopVod"
			:muted="(index == vodIndex && !muteSetup && !muteVodSetup) ? false : true" :id="'myVideo'+index+swId"
			@play="startPlay(index)" @waiting="bufferVod(index)" @timeupdate="timeupdateVod($event,index)"
			@error="errVod(index)" @ended="endedVod(index)" @fullscreenchange="fullscreenchangeVod($event,index)">
			
			<!-- 横屏样式 -->
			<!-- <landscapePrimary v-if="isFullscreen"></landscapePrimary> -->
			
		</video>
		<!-- #endif -->
		
		<!-- 只存在于 app-nvue -->
		<!-- #ifdef APP-NVUE -->
		<video :style="{width:videoStyle.width,height:videoStyle.height}" :src="item.vodUrl" :controls="optionVod.controls" :danmu-btn="optionVod.danmuBtn" :enable-danmu="optionVod.enableDanmu"
			:enable-progress-gesture="optionVod.enableProgressGesture" :show-loading="optionVod.showLoading" :show-play-btn="optionVod.showPlayBtn" :show-center-play-btn="optionVod.showCenterPlayBtn"
			:show-fullscreen-btn="optionVod.showFullscreenBtn" :vslide-gesture-in-fullscreen="optionVod.vslideGestureInFullscreen" :show-progress="optionVod.showProgress"
			:object-fit="item.object_fit" :http-cache="true" :loop="loopVod"
			:muted="(index == vodIndex && !changeVod && !muteSetup && !muteVodSetup) ? false : true" :id="'myVideo'+index+swId"
			@play="startPlay(index)" @waiting="bufferVod(index)" @timeupdate="timeupdateVod($event,index)"
			@error="errVod(index)" @ended="endedVod(index)" @fullscreenchange="fullscreenchangeVod($event,index)">
			
			<!-- 横屏样式 -->
			<!-- <landscapePrimary v-if="isFullscreen"></landscapePrimary> -->
			
		</video>
		<!-- #endif -->
		
		<!-- 视频封面 -->
		<view class="vodPause-img" v-if="item.coverShow" :style="{width:videoStyle.width,height:videoStyle.height,opacity:appoint?0:1}">
			<image :src="item.coverImg" :mode="item.object_fit == 'cover'?'aspectFill':'widthFix'" class="cover-img"
				:style="{opacity:coverOpacity?1:0,width:videoStyle.width,height:item.object_fit == 'cover'?videoStyle.height:0}">
			</image>
		</view>
		
		
	</view>
</template>

<script>
	import landscapePrimary from '../landscape-primary/landscape-primary.vue'
	export default {
		components:{
			landscapePrimary
		},
		props: {
			videoStyle: {
				type: Object,
				default: () => {
					return {}
				}
			},
			src: {
				type: String,
				default: ''
			},
			//当前视频的整个对象
			item: {
				type: Object,
				default: () => {
					return {}
				}
			},
			/* 是否循环播放 */
			loopPlay: {
				type: Boolean,
				default: true
			},
			/* 初始加载完成是否自动播放 */
			autoplay: {
				type: Boolean,
				default: true
			},
			/* 是否设置为静音 */
			muteSetup: {
				type: Boolean,
				default: false
			},
			/* 是否是点击播放 */
			clickPlay: {
				type: Boolean,
				default: false
			},
			//下标索引
			index: {
				type: Number,
				default: 0
			},
			//当前swiper的下标
			vodIndex: {
				type: Number,
				default: 0
			},
			//当前视频的下标
			vodCurIndex: {
				type: Number,
				default: 0
			},
			/* 多个tab视频时需传入不同的类型 */
			swId: {
				type: String,
				default: ''
			},
			/* app-nvue 是否正在切换视频 */
			changeVod:{
				type: Boolean,
				default: false
			},
			/* app-nvue 初始隐藏视频和右侧头像栏 */
			appoint:{
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				muteVodSetup: false, //是否设置为静音
				videoSrc: '',
				initialPlay: false,
				coverOpacity: false, //是否显示视频封面
				loopVod: true ,//是否循环播放
				loadTimeOut: null,
				/* 视频组件配置 */
				optionVod: {
					controls: false,
					danmuBtn: true, //是否显示弹幕按钮
					enableDanmu: true, //是否展示弹幕
					enableProgressGesture: false, //是否开启控制进度的手势
					showLoading: false, //是否显示loading控件
					showPlayBtn: false,  //是否显示视频底部控制栏的播放按钮
					showCenterPlayBtn: false, //是否显示视频中间的播放按钮
					showFullscreenBtn: false, //是否显示全屏按钮
					vslideGestureInFullscreen: false, //在全屏模式下，是否开启亮度与音量调节手势
					showProgress: false, 
				},
				isFullscreen: false, //是否全屏
			}
		},
		created() {
			this.coverOpacity = this.item.coverShow ? true : false
			this.loopVod = this.loopPlay
		},
		watch: {
			// 监听视频资源地址更新
			src: {
				handler(val) {
					if (!val) return
					// console.log('监听视频资源地址更新',this.index,val)
					this.coverOpacity = this.item.coverShow ? true : false //显示视频封面
					// this.videoSrc = val
					/* 预加载首帧视频，模拟出封面图 */
					// this.loadFirstFrame()
				},
				immediate: true
			},
			loopPlay(newVal, oldVal) {
				this.loopVod = this.loopPlay
			}
		},
		methods: {
			//播放
			play() {
				uni.createVideoContext('myVideo' + this.index + this.swId, this).play();
			},
			//暂停
			pause() {
				uni.createVideoContext('myVideo' + this.index + this.swId, this).pause();
			},
			//停止视频
			stop() {
				uni.createVideoContext('myVideo' + this.index + this.swId, this).stop();
			},
			//跳转到指定位置
			seek(val) {
				uni.createVideoContext('myVideo' + this.index + this.swId, this).seek(val);
			},
			//设置倍速播放
			playbackRate(val){
				uni.createVideoContext('myVideo' + this.index + this.swId, this).playbackRate(parseFloat(val));
			},
			//进入全屏
			requestFullScreen() {
				uni.createVideoContext('myVideo' + this.index + this.swId, this).requestFullScreen();
			},
			//退出全屏
			exitFullScreen() {
				uni.createVideoContext('myVideo' + this.index + this.swId, this).exitFullScreen();
			},
			//发送弹幕
			sendDanmu(val) {
				uni.createVideoContext('myVideo' + this.index + this.swId, this).sendDanmu(val);
			},
			/* 当开始/继续播放时 */
			startPlay(index) {
				this.$emit('play')
				/* let videoCtx = uni.createVideoContext('myVideo' + this.index + this.swId, this)
				clearTimeout(this.loadTimeOut)
				this.loadTimeOut = setTimeout(() => {
					if (index != this.vodIndex) { //加载首帧视频，模拟出封面图后暂停视频
						videoCtx.seek(0);
						videoCtx.pause();
						this.$emit('loadchange',index)
					}
					this.muteVodSetup = false
				}, 500)
				if (!this.autoplay && this.vodCurIndex == 0 && !this.initialPlay && !this.clickPlay) {
					//初始不自动播放
					setTimeout(() => {
						videoCtx.seek(0);
						videoCtx.pause();
						this.initialPlay = true
						this.muteVodSetup = false
						this.$emit('loadchange',index)
					}, 50)
				} else {
					this.muteVodSetup = false
				} */
			},
			/* 视频出现缓冲 */
			bufferVod(index) {
				this.$emit('waiting')
			},
			/* 播放进度变化时触发 */
			timeupdateVod(event, index) {
				this.$emit('timeupdate', event)
				if (this.vodIndex == index && event.detail.currentTime > 0) {
					this.coverOpacity = false //隐藏视频封面
				}
			},
			/* 视频播放失败 */
			errVod(index) {
				this.$emit('error')
			},
			/* 视频播放结束 */
			endedVod(index) {
				this.$emit('ended')
			},
			/* 当视频进入和退出全屏时触发 */
			fullscreenchangeVod(event,index){
				console.log('当视频进入和退出全屏时触发', event, index)
				if(event.detail.fullScreen){
					this.optionVod = {
						controls: true,
						danmuBtn: true,
						enableDanmu: true,
						enableProgressGesture: true,
						showLoading: true,
						showPlayBtn: true,
						showCenterPlayBtn: true,
						showFullscreenBtn: true,
						vslideGestureInFullscreen: true,
						showProgress: true
					}
				}else{
					this.optionVod = {
						controls: false,
						danmuBtn: true,
						enableDanmu: true,
						enableProgressGesture: false,
						showLoading: false,
						showPlayBtn: false,
						showCenterPlayBtn: false,
						showFullscreenBtn: false,
						vslideGestureInFullscreen: false,
						showProgress: false
					}
				}
				setTimeout(()=>{
					this.isFullscreen = event.detail.fullScreen
				},50)
			},
			/* 预加载首帧视频，模拟出封面图 */
			loadFirstFrame() {
				this.muteVodSetup = true
				setTimeout(() => {
					uni.createVideoContext('myVideo' + this.index + this.swId, this).play()
				}, 10)
			}
		}
	}
</script>

<style scoped lang="scss">
	.vodPause-img {
		position: absolute;
		top: 0;
		left: 0;
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		z-index: 4;
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.cover-img {
		width: 750rpx;
		height: 0;
	}
	
</style>