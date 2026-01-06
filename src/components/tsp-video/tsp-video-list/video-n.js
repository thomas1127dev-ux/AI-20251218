const animation = uni.requireNativePlugin('animation')
const dom = uni.requireNativePlugin('dom')
import unirefresh from '../tsp-load/tsp-refresh-n.vue'
import videoMenu from '../tsp-menu/tsp-menu-n.vue'
import uniVideoPlayer from '../DomVideoPlayer/uniVideoPlayer.vue'
import operateMenu from '../forward-menu/operate-menu.vue'
/*
 lodData 上拉加载回调
 refreshData 下拉加载回调
 */

export default {
	components: {
		unirefresh,
		videoMenu,
		uniVideoPlayer,
		operateMenu
	},
	props: {
		/* 是否开启下拉刷新 */
		loadOpen: {
			type: Boolean,
			default: true
		},
		/* tabBar栏 0系统tabBar栏 1自定义tabBar栏 */
		tabBarShow: {
			type: Number,
			default: 0
		},
		/* 自定义tabBar的高度 */
		tabBarHeight: {
			type: Number,
			default: 50
		},
		/* 进度条离底部的距离 px*/
		speedBottom: {
			type: Number,
			default: 0
		},
		/* 初始加载完成是否自动播放 */
		autoplay: {
			type: Boolean,
			default: true
		},
		/* 是否循环播放 */
		loopPlay: {
			type: Boolean,
			default: true
		},
		/* 是否开启自动播放 */
		nextPlay: {
			type: Boolean,
			default: false
		},
		/* 是否开启双击点赞 */
		doubleOpen:{
			type: Boolean,
			default: true
		},
		/* 双击点赞屏幕是否显示桃心 */
		doubleHeart:{
			type: Boolean,
			default: true
		},
		/* 多个tab视频时需传入不同的类型 */
		swId: {
			type: String,
			default: ''
		},
		/* 是否有显示 statusBarHeight 状态栏适配 */
		showBarHeight: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			videoStyle: {},
			screenWidth: 0, //屏幕的宽度
			screenHeight: 0, //屏幕的高度
			vodHeight: 0, //视频部分高度
			videoNewUrl: null, //下一个视频的地址
			currentIndex: null,
			vodIndex: 0, // 当前播放视频下标
			contentShow: false,
			autoplayVideo: true, // 初始加载完成是否自动播放
			vodList: [
				/* {
					vodUrl:"https://outin-9cc4a7aedd2a11eaabb800163e1a65b6.oss-cn-shanghai.aliyuncs.com/customerTrans/43121ec9955a1ce95146d379f15ea9bd/566eafe2-17b52f0f17b-0007-0f29-cc2-eb217.mp4",
					coverImg:'/static/image/cover1.jpg', //视频封面
					coverShow:true, //是否显示视频封面
					vodPaly:true, //是否播放、暂停视频
					object_fit:'contain', //视频的显示类型
					pauseShow:false, //是否显示暂停图标
					loadingShow:false, //是否显示loading加载动画
					fabulousShow:false,//是否点赞
					followShow:-1, //关注特效
					followReally:false, //是否关注
					sliderShow:true, //是否显示进度条
					rotateImgShow:true, //是否显示旋转头像
				} */
			],
			timeout: null, //滑动视频防抖
			bufferTime: null, //缓冲视频显示加载动画防抖
			sliderProgress: 0, //进度条滑动层宽度
			sliderTime: 0, //显示滑动进度条时变化的时间
			videoTime: 0, //视频时长 时间
			endTime: 0, //滑动进度条最终的时间
			sliderDrag: false, //是否在拖动进度
			brightSlider: false, //是否显示光亮的进度条
			sliderEndTime: null, //滑动结束隐藏光亮进度条时间延迟
			startPlayVod: false, //是否滑动结束播放下一个视频
			bufferShow: false, //显示loading加载进度的条件
			playOpen: false, //视频播放失败，是否重播视频的条件
			failTime: null, //视频播放失败，重播视频的时间
			repeatTime:null,
			preloadTime: null, //延时防抖
			shakePlay: false, //是否有遗漏的视频播放
			rotateAnti:false, //防抖旋转头像
			touchClientY: 0, //触碰的坐标
			moveClientY: 0, //移动的坐标
			moveOpacity: false, //是否透明
			speedHide:false, //滑动时隐藏进度条
			appoint:true, //初始隐藏视频和右侧头像栏
			changeVod:false, //是否正在切换视频
			muteSetup:false, //是否设置为静音
			loopVod:false, //是否循环播放
			changeIndex:0,
			changeTime:null,
			clickPlay: false, //是否是点击播放
			showVodMenu: false, //是否显示视频倍数操作弹窗
			longDataInfo: {},
			
			/* 双击点赞部分 */
			lastTapDiffTime: 0, //上次点击时间
			lastTapTimeoutFunc: null, //单击事件事件函数
			likeList:[], //双击点赞显示的桃心数据
			likeId:1,
			doubleOutTime:null,
			clearDoubleTime:null,
			touchInfo:{},
			/* 双击点赞显示桃心动画 */
			peachAddList:{
				list:[
					{transform:'scale(1.6)',opacity: '0.8'},
					{transform:'scale(1)',opacity: '1'},
					{transform:'scale(1.02)',opacity: '1'},
					{transform:'scale(1)',opacity: '1'}
				],
				duration:75
			},
			/* 双击点赞移除桃心动画 */
			peachRemoveList:{
				list:[
					{transform:'scale(1) translateY(0rpx)',opacity: '1'},
					{transform:'scale(1.35) translateY(-50rpx)',opacity: '0.7'},
					{transform:'scale(1.6) translateY(-100rpx)',opacity: '0'}
				],
				duration:133
			},
			pauseNum:0,
			pauseAddList:{
				list:[
					{transform:'scale(2)',opacity: '0'},
					{transform:'scale(1)',opacity: '0.35'}
				],
				duration:75
			}
		}
	},
	created() {
		const deviceInfo = uni.getSystemInfoSync()
		let topBarHeight = this.showBarHeight ? deviceInfo.statusBarHeight : 0; //statusBarHeight 状态栏高度
		this.videoStyle.statusBarHeight = topBarHeight + 'px';
		this.videoStyle.width = deviceInfo.screenWidth + 'px';
		this.screenWidth = deviceInfo.screenWidth //屏幕的宽度
		this.screenHeight = deviceInfo.screenHeight //屏幕的高度
		if (this.tabBarShow == 1) { //减去自定义底部栏的高度
			this.videoStyle.height = (deviceInfo.screenHeight - topBarHeight - this.tabBarHeight) + 'px';
			this.vodHeight = deviceInfo.screenHeight - topBarHeight - this.tabBarHeight //视频部分高度
		} else {
			this.videoStyle.height = deviceInfo.windowHeight - topBarHeight + 'px';
			this.vodHeight = deviceInfo.windowHeight - topBarHeight //视频部分高度
		}
		this.loopVod = this.loopPlay
	},
	watch: {
		vodIndex(newIndex,oldIndex) {
			if (!this.contentShow || this.vodList.length == 0) return
			this.resetData(); /* 重置状态数据 */
			/* 上一个视频处理 */
			if(oldIndex >= 0 && !this.appoint && this.vodList[oldIndex]){
				// this.vodList[oldIndex].coverOpacity = this.vodList[oldIndex].coverShow ? true : false //是否显示封面
				this.vodList[oldIndex].vodPaly = false;
				this.vodList[oldIndex].pauseShow = false;
				this.vodList[oldIndex].loadingShow = false;
				// uni.createVideoContext('myVideo' + oldIndex + this.swId, this).pause();
				this.$refs[`myVideo${oldIndex}${this.swId}`][0].pause();
				this.$refs[`myVideo${oldIndex}${this.swId}`][0].playbackRate('1.0'); //重置倍数为1.0
				if(this.$refs[`bsczRef`]){
					this.$refs[`bsczRef`].multipleVod = '1.0' //重置倍数为1.0
				}
			}
			this.$nextTick(() => {
				this.changeVod = false
				if (this.autoplayVideo) {
					this.autoplayVideo = true
					this.swiperVod(newIndex); //播放视频
				}
			})
		},
		loopPlay(newVal, oldVal){
			this.loopVod = this.loopPlay
		}
	},
	methods: {
		/* 滚动监听 */
		scrolls(ev) {
			clearTimeout(this.timeout)
			this.speedHide = true
			let index = Math.round(Math.abs(ev.contentOffset.y) / this.vodHeight)
			this.changeIndex = index
			this.moveOpacity = ev.isDragging /* 是否透明进度条 */
			this.timeout = setTimeout(() => {
				this.currentIndex = index
				this.speedHide = false
				this.shakePlay = true
				if (this.startPlayVod && index != this.vodIndex) {
					this.$emit('swiperChange',this.vodList[index])
					this.vodIndex = index
				}
			}, 100)
		},
		/* 选择指定视频下标播放 */
		scrollToVod(playIndex){
			let el = this.$refs['myVodEl' + playIndex + this.swId][0]
			dom.scrollToElement(el, {
				offset: 0,
				animated: false
			})
			this.vodIndex = playIndex
		},
		/* 初始加载视频 */
		initVod(dataList, index) {
			this.autoplayVideo = this.autoplay
			let playIndex = index ? index : 0
			/* 拼接参数数据 */
			dataList.filter((item, i) => {
				item.videoIndex = i
				item.vodPaly = (i == playIndex ? true : false); //是否播放、暂停视频
				item.pauseShow = false //是否显示暂停图标
				item.loadingShow = false //是否显示loading加载动画
				// item.coverOpacity = item.coverShow ? true : false //是否显示封面
			})
			this.vodList = dataList;
			this.vodIndex = playIndex
			this.contentShow = true
			if(this.vodList.length > 0){
				setTimeout(() => {
					if (playIndex > 0) { //开启定位播放
						let el = this.$refs['myVodEl' + playIndex + this.swId][0]
						dom.scrollToElement(el, {
							offset: 0,
							animated: false
						})
					}
					setTimeout(() => {
						this.appoint = false
						if (this.autoplayVideo) {
							this.swiperVod(this.vodIndex); //播放视频
						} else {
							this.vodList[this.vodIndex].vodPaly = false;
							this.vodList[this.vodIndex].pauseShow = true;
							this.$nextTick(()=>{ //添加暂停动画
								this.addAnimation('pauseRef',this.pauseAddList,this.pauseNum)
							})
						}
					}, 200)
				}, 100)
			}
		},
		/* 上拉加载回调 */
		lodData() {
			this.$emit('lodData')
		},
		/* 下拉刷新回调 */
		refreshData() {
			this.$emit('refreshData')
		},
		/* 到底加载方法 */
		lodingData(dataList) {
			let num = this.vodList.length; //获取视频数据的长度
			dataList.filter((item, i) => {
				item.videoIndex = num + i
				item.vodPaly = false //是否播放、暂停视频
				item.pauseShow = false //是否显示暂停图标
				item.loadingShow = false //是否显示loading加载动画
				// item.coverOpacity = item.coverShow ? true : false //是否显示封面
			})
			this.vodList = this.vodList.concat(dataList); //拼接数据
		},
		/* 重新加载 */
		refreshSquare(dataList, index) {
			let playIndex = index ? index : 0
			this.vodList = [];
			this.resetData(); /* 重置状态数据 */
			this.$refs.refresh.closeRefresh(); //关闭下拉刷新
			this.$refs.listBox.resetLoadmore(); // 重置 loadmore, 不然上拉加载有时会失效
			setTimeout(() => {
				this.initVod(dataList, playIndex)
			}, 50)
		},
		/* onShow显示播放视频 */
		showPlay() {
			if (this.vodIndex != null && this.vodList.length > 0) {
				this.videoPlay(this.vodIndex);
			}
		},
		/* onHide隐藏暂停视频 */
		hidePause() {
			if (this.vodIndex != null && this.vodList.length > 0) {
				this.videoPause(this.vodIndex);
			}
			this.brightSlider = false; //隐藏光亮的进度条
		},
		/* 重置状态数据 */
		resetData() {
			this.sliderProgress = 0; //进度条滑动层宽度
			this.sliderTime = 0; //显示滑动进度条时变化的时间
			this.videoTime = 0; //视频时长 时间
			this.endTime = 0; //滑动进度条最终的时间
			this.bufferShow = false; //显示loading加载进度的条件
			this.sliderDrag = false; //是否在拖动进度
			this.brightSlider = false; //是否显示光亮的进度条
			this.sliderEndTime = null; //滑动结束隐藏光亮进度条时间延迟
		},
		/* 静音设置 */
		muteVideo(val){
			this.muteSetup = val
		},
		/* 点击暂停、播放视频 */
		playSpot(index) {
			if (this.vodList[index].vodPaly) { //暂停
				this.videoPause(index)
				this.vodList[index].pauseShow = true; //显示暂停图标
				this.$nextTick(()=>{ //添加暂停动画
					this.addAnimation('pauseRef',this.pauseAddList,this.pauseNum)
				})
			} else { //播放
				// 检查VIP权限
				const currentVideoData = this.vodList[this.vodIndex];
				console.log('playSpot - 当前视频数据:', currentVideoData);
				console.log('playSpot - 视频is_vip:', currentVideoData?.is_vip);
				
				if (currentVideoData) {
					console.log('playSpot - 视频VIP状态:', currentVideoData.is_vip);
					
					// 如果视频不是VIP视频，直接播放
					if (!currentVideoData.is_vip) {
						console.log('playSpot - 非VIP视频，直接播放');
						this.clickPlay = true
						this.videoPlay(index)
						this.vodList[index].pauseShow = false; //关闭暂停图标
						return;
					}
					
					// 如果是VIP视频，检查用户权限
					console.log('playSpot - VIP视频，开始检查用户权限');
					this.$emit('checkVipPermission', {
						videoData: currentVideoData,
						actionType: 'play',
						callback: (hasPermission) => {
							console.log('playSpot - VIP权限检查结果:', hasPermission);
							if (!hasPermission) {
								console.log('playSpot - 权限检查失败（可能是需要购买或需要VIP），停止播放');
								// 没有权限或需要购买，不播放视频，等待用户操作（购买或开通VIP）
								return;
							} else {
								// 有权限，继续播放
								this.clickPlay = true
								this.videoPlay(index)
								this.vodList[index].pauseShow = false; //关闭暂停图标
							}
						}
					});
					return; // 等待回调结果
				} else {
					console.log('playSpot - 跳过VIP权限检查');
				}
			}
		},
		/* 播放视频 */
		videoPlay(index) {
			// 获取当前视频数据并检查VIP权限
			const currentVideoData = this.vodList[this.vodIndex];
			console.log('videoPlay - 当前视频数据:', currentVideoData);
			console.log('videoPlay - 视频is_vip:', currentVideoData?.is_vip);
			
			if (currentVideoData) {
				console.log('videoPlay - 视频VIP状态:', currentVideoData.is_vip);
				
				// 如果视频不是VIP视频，直接播放
				if (!currentVideoData.is_vip) {
					console.log('videoPlay - 非VIP视频，直接播放');
					// console.log('播放视频myVideo============>' + index)
					let vodInfo = Object.assign({},this.vodList[index])
					vodInfo.vodPaly = true;
					vodInfo.pauseShow = false; //关闭暂停图标
					this.$set(this.vodList, index, vodInfo)
					this.brightSlider = false; //隐藏光亮的进度条
					// 创建视频对象
					// uni.createVideoContext('myVideo' + index + this.swId, this).play();
					this.$refs[`myVideo${index}${this.swId}`][0].play();
					return;
				}
				
				// 如果是VIP视频，检查用户权限
				console.log('videoPlay - VIP视频，开始检查用户权限');
				this.$emit('checkVipPermission', {
					videoData: currentVideoData,
					actionType: 'play',
					callback: (hasPermission) => {
						console.log('videoPlay - VIP权限检查结果:', hasPermission);
						if (!hasPermission) {
							console.log('videoPlay - 权限检查失败（可能是需要购买或需要VIP），停止播放');
							// 没有权限或需要购买，不播放视频，等待用户操作（购买或开通VIP）
							return;
						} else {
							// 有权限，继续播放
							// console.log('播放视频myVideo============>' + index)
							let vodInfo = Object.assign({},this.vodList[index])
							vodInfo.vodPaly = true;
							vodInfo.pauseShow = false; //关闭暂停图标
							this.$set(this.vodList, index, vodInfo)
							this.brightSlider = false; //隐藏光亮的进度条
							// 创建视频对象
							// uni.createVideoContext('myVideo' + index + this.swId, this).play();
							this.$refs[`myVideo${index}${this.swId}`][0].play();
						}
					}
				});
				return; // 等待回调结果
			} else {
				console.log('videoPlay - 跳过VIP权限检查');
			}
			
			// console.log('播放视频myVideo============>' + index)
			let vodInfo = Object.assign({},this.vodList[index])
			vodInfo.vodPaly = true;
			vodInfo.pauseShow = false; //关闭暂停图标
			this.$set(this.vodList, index, vodInfo)
			this.brightSlider = false; //隐藏光亮的进度条
			// 创建视频对象
			// uni.createVideoContext('myVideo' + index + this.swId, this).play();
			this.$refs[`myVideo${index}${this.swId}`][0].play();
		},
		/* 暂停视频 */
		videoPause(index) {
			// console.log('暂停视频myVideo============>' + index)
			clearTimeout(this.sliderEndTime)
			this.vodList[index].vodPaly = false;
			if (this.vodIndex == index && this.vodList[index].sliderShow) {
				this.brightSlider = true; //显示光亮的进度条
			}
			// uni.createVideoContext('myVideo' + index + this.swId, this).pause();
			this.$refs[`myVideo${index}${this.swId}`][0].pause();
		},
		/* 播放视频 */
		swiperVod(newIndex) {
			clearInterval(this.failTime)
			setTimeout(() => {
				clearTimeout(this.checkTime)
			}, 100)
			this.clickPlay = false
			this.rotateAnti = false
			this.muteVideo(false)
			let newVideoInfo = this.$refs[`myVideo${newIndex}${this.swId}`][0];
			/* 播放新视频 */
			if (newVideoInfo) {
				this.shakePlay = false
				this.videoPlay(newIndex);
			}
			//提前播放下一个视频
			/* if (this.vodList[newIndex + 1] && Math.abs((newIndex + 1) - newIndex) <= 1) {
				// uni.createVideoContext('myVideo' + (newIndex + 1) + this.swId, this).play()
				this.$refs[`myVideo${newIndex + 1}${this.swId}`][0].pause();
			} */
		},
		/* 视频加载成功 */
		loadchange(index){
			// console.log('视频加载成功==========>',ev,index)
			if(index == this.vodIndex && this.autoplayVideo){ //视频未播放成功继续播放
				this.swiperVod(this.vodIndex); //播放视频
			}
		},
		/* 当开始/继续播放时 */
		startPlay(index) {
			if (this.vodIndex == index) {
				this.playOpen = false;
				clearInterval(this.failTime)
				if (this.vodList[this.vodIndex].rotateImgShow && !this.rotateAnti) {
					this.$refs['menuRef' + this.vodIndex + ''][0].rotateAvatar(); //开启旋转头像动画 menuRef
				}
			}
		},
		/* 视频出现缓冲 */
		bufferVod(index) {
			// console.log('缓冲视频================》'+index)
			if (this.vodList.length > 0 && index == this.vodIndex && !this.bufferShow && this.videoTime > 0 && this.vodList[this.vodIndex].vodPaly) {
				this.playOpen = true;
				this.scheduleLoad()
			}
		},
		/* 视频播放失败 */
		errVod(index) {
			// console.log('视频播放失败================》'+index)
			if (this.vodList.length > 0 && index == this.vodIndex && !this.bufferShow && this.vodList[this.vodIndex].vodPaly) {
				this.playOpen = true;
				this.scheduleLoad()
			}
		},
		/* 播放进度变化时触发 */
		timeupdateVod(ev, index) {
			if (this.vodIndex != index) return false
			// this.vodList[index].coverOpacity = false; //隐藏视频封面
			if (!this.sliderDrag) { //判断拖拽完成后才触发更新，避免播放是拖拽冲突失效
				this.videoTime = ev.detail.duration; //视频时间
				this.sliderTime = ev.detail.currentTime; //已播放时间
				this.sliderProgress = (ev.detail.currentTime / ev.detail.duration) * this.screenWidth; //播放进度
			}
			/* 关闭加载动画 */
			if (this.vodList.length > 0) {
				this.bufferShow = false;
				this.vodList[index].loadingShow = false;
				clearTimeout(this.bufferTime)
				clearInterval(this.failTime)
				this.playOpen = false;
			}
			this.rotateAnti = true
			/** 暂停重置提前播放的下一个视频 */
			/* if (this.vodList[index + 1] && Math.abs((index + 1) - index) <= 1) {
				// uni.createVideoContext('myVideo' + (index + 1) + this.swId, this).seek(0);
				uni.createVideoContext('myVideo' + (index + 1) + this.swId, this).pause()
			} */
		},
		/* 显示进度加载动画 */
		scheduleLoad(){
			if (!this.bufferShow) {
				this.bufferShow = true;
				this.bufferTime = setTimeout(() => { //显示进度加载动画
					this.vodList[this.vodIndex].loadingShow = true
					clearTimeout(this.repeatTime)
					this.repeatTime = setTimeout(() => {
						this.loadingSliderShow();
					}, 200)
					if (this.playOpen) {
						this.vodLoad();
					}
				}, 2500)
			}
		},
		/* 重新播放视频 */
		vodLoad() {
			if (this.playOpen) {
				this.playOpen = false;
				if(this.sliderTime == 0){
					// uni.createVideoContext('myVideo' + this.vodIndex + this.swId, this).stop()
					this.$refs[`myVideo${this.vodIndex}${this.swId}`][0].stop()
				}
				this.failTime = setTimeout(() => {
					this.playOpen = true;
					this.bufferShow = false;
					this.videoPlay(this.vodIndex)
					// console.log('视频播放失败，重新播放视频')
				}, 1000)
			}
		},
		/* 视频播放结束 */
		endedVod(index){
			// console.log('视频播放结束'+index)
			if (this.vodIndex == index && this.nextPlay && (this.vodIndex + 1) < this.vodList.length ) {
				this.vodIndex += 1
				let el = this.$refs['myVodEl' + this.vodIndex + this.swId][0]
				dom.scrollToElement(el, {
					offset: 0,
					animated: true
				})
			}else if(this.vodIndex == index && this.nextPlay && (this.vodIndex + 1) == this.vodList.length){
				//最后一个视频循环播放
				this.videoPlay(this.vodIndex)
			}
		},
		// 根据秒获取时间
		formatSeconds(a) {
			var hh = parseInt(a / 3600);
			var mm = parseInt((a - hh * 3600) / 60);
			if (mm < 10) mm = "0" + mm;
			var ss = parseInt((a - hh * 3600) % 60);
			if (ss < 10) ss = "0" + ss;
			if (hh < 10) hh = hh == 0 ? '' : `0${hh}:`;
			var length = hh + mm + ":" + ss;
			if (a >= 0) {
				return length;
			} else {
				return "00:00";
			}
		},
		/* 进度条滑动 */
		touchmoveSlider(event) {
			event.stopPropagation()
			// #ifndef APP-NVUE
			let objclientX = event.changedTouches[0].clientX
			// #endif

			// #ifdef APP-NVUE
			let objclientX = event.changedTouches[0].screenX
			// #endif
			if (objclientX >= 0 && objclientX <= (this.screenWidth - 2)) {
				clearTimeout(this.sliderEndTime)
				this.sliderDrag = true; //是否在拖动进度
				this.brightSlider = true; //显示光亮的进度条
				this.sliderProgress = objclientX
				let num = this.sliderProgress / (this.screenWidth - 2)
				this.sliderTime = num * this.videoTime; //滑动期间显示的时间
				this.endTime = num * this.videoTime; //最终滑动的时间
			}
		},
		/* 进度条滑动结束 */
		touchendSlider(event) {
			event.stopPropagation()
			this.sliderDrag = false;
			// let videoCtx = uni.createVideoContext('myVideo' + this.vodIndex + this.swId, this)
			let videoCtx = this.$refs[`myVideo${this.vodIndex}${this.swId}`][0]
			videoCtx.seek(this.endTime);
			videoCtx.play();
			this.vodList[this.vodIndex].vodPaly = true; //开启播放
			this.vodList[this.vodIndex].pauseShow = false; //关闭暂停图标

			this.sliderEndTime = setTimeout(() => {
				this.brightSlider = false; //隐藏光亮的进度条
			}, 2000)
		},
		/* 视频是否播放遗漏 */
		vodViewStart() {
			clearTimeout(this.checkTime)
			this.checkTime = setTimeout(() => {
				if (this.shakePlay) {
					this.moveOpacity = false; //是否透明进度条
					this.vodIndex = this.currentIndex
					this.changeVod = false
				}
			}, 500)
		},
		/* 上下滑动的坐标 */
		vodViewMove(ev) {
			// #ifndef APP-NVUE
			this.moveClientY = ev.changedTouches[0].clientY - this.touchClientY
			// #endif
			// #ifdef APP-NVUE
			this.moveClientY = ev.changedTouches[0].screenY - this.touchClientY
			// #endif
			this.startPlayVod = false;
		},
		/* 滑动结束的坐标 */
		vodViewEnd(ev) {
			this.startPlayVod = true
			this.moveOpacity = false
			this.vodViewStart()
			if(!this.changeTime){
				this.changeTime = setTimeout(()=>{
					this.changeVod = this.changeIndex != this.vodIndex ? true : false
					this.changeTime = null
				},300)
			}
		},
		/* loading进度加载动画 */
		loadingSliderShow() {
			let testEl = this.$refs.loadSlider;
			animation.transition(testEl, {
				styles: {
					transform: 'scale(0.4)',
					opacity: "0.9"
				},
				duration: 10, //ms
				timingFunction: 'linear',
				delay: 0 //ms
			}, () => {
				this.loadingSliderHide();
			})
		},
		loadingSliderHide() {
			let testEl = this.$refs.loadSlider;
			animation.transition(testEl, {
				styles: {
					transform: 'scale(1)',
					opacity: "0.1"
				},
				duration: 400, //ms
				timingFunction: 'linear',
				delay: 0 //ms
			}, () => {
				this.loadingSliderShow();
			})
		},
		// 单击或双击
		handClick(event,index) {
			// console.log(event)
			if(event.type == 'touchstart'){
				this.touchInfo = event
			}
			if(event.type != 'click') return
			if(!this.doubleOpen){ //没有开启双击
				this.playSpot(index)
				return false
			}
			const curTime = new Date().getTime();
			// 上次点击时间
			const lastTime = this.lastTapDiffTime;
			// 更新上次点击时间
			this.lastTapDiffTime = curTime;
			// 两次点击间隔小于300ms, 认为是双击
			const diff = curTime - lastTime;
			if (diff < 300) {
				// 执行方法
				// 成功触发双击事件时，取消单击事件的执行
				clearTimeout(this.lastTapTimeoutFunc);
				this.doubleLike(this.touchInfo,index)
			} else {
				// 单击事件延时300毫秒执行
				this.lastTapTimeoutFunc = setTimeout(()=> {
					// 执行方法
					this.playSpot(index)
				}, 300);
			}    
		},
		/* 双击点赞 */
		doubleLike(event,index){
			if(!this.vodList[this.vodIndex].fabulousShow){
				this.$refs['menuRef' + this.vodIndex + ''][0].fabulousBtn(index); //视频点赞
			}
			if(!this.doubleHeart) return //双击点赞屏幕是否显示桃心
			if(this.doubleOutTime) return
			this.doubleOutTime = setTimeout(()=>{
				// #ifndef APP-NVUE
				let topY = event.changedTouches[0].clientY 
				let leftX = event.changedTouches[0].clientX 
				// #endif
				// #ifdef APP-NVUE
				let topY = event.changedTouches[0].screenY 
				let leftX = event.changedTouches[0].screenX
				// #endif
				let rotateList = ['0deg','15deg','-15deg']
				let rNum = Math.floor(Math.random()*3)
				let likeObj = {
					id:this.likeId++,
					width:this.pxToRpx(95),
					height:this.pxToRpx(95),
					top:this.pxToRpx(topY) - this.pxToRpx(180)+'rpx',
					left:this.pxToRpx(leftX) - this.pxToRpx(95/2)+'rpx',
					rotate:rotateList[rNum],
					className:'',
					isShow:true,
					addNum:0,
					removeNum:0,
				}
				this.likeList.push(likeObj)
				this.doubleOutTime = null
				this.$nextTick(()=>{
					this.addAnimation('peachRef'+likeObj.id,this.peachAddList,likeObj.addNum)
					this.doubleAddClass(likeObj.id)
				})
				clearTimeout(this.clearDoubleTime)
				this.clearDoubleTime = setTimeout(()=>{
					this.likeList = []
				},1500)
				this.$emit('doubleClick',this.vodList[this.vodIndex])
			},50)
		},
		/* px转换rpx */
		pxToRpx(px){
			return (750 * Number.parseInt(px)) / this.screenWidth
		},
		/* 双击点赞添加移除动画 */
		doubleAddClass(id){
			setTimeout(()=>{
				this.likeList.filter((item,index)=>{
					if(item.id == id){
						this.addAnimation('peachRef'+item.id,this.peachRemoveList,item.removeNum)
					}
				})
				setTimeout(()=>{
					this.likeList.filter((item,index)=>{
						if(item.id == id){
							item.isShow = false
						}
					})
				},400)
			},500)
		},
		/* 动画方法 */
		addAnimation(name,dataList,num){
			let testEl = this.$refs[name][0]
			animation.transition(testEl, {
			  styles: dataList.list[num],
			  duration: num == 0 ? 0 : dataList.duration, //ms
			  timingFunction: 'linear',
			  delay: 0 //ms
			},()=>{
				num = num + 1
				if(num < dataList.list.length){
					this.addAnimation(name,dataList,num);
				}
			})
		},
		/* 添加视频 */
		addVodData(dataList,index){
			if(index >= 0){
				dataList.filter((item, i) => {
					item.vodPaly = false //是否播放、暂停视频
					item.pauseShow = false //是否显示暂停图标
					item.loadingShow = false //是否显示loading加载动画
					// item.coverOpacity = item.coverShow ? true : false //是否显示封面
					this.vodList.splice(index+1, 0, item);
				})
				this.vodList.filter((item,idx)=>{
					item.videoIndex = idx
				})
			}else{
				this.lodingData(dataList); //追加在数组后面
			}
		},
		/* 删除视频 */
		removeVodData(IdList){
			for(let i = this.vodList.length - 1; i >= 0; i--){
				for(let j = IdList.length - 1; j >= 0; j--){
					if(this.vodList[i] && this.vodList[i].tsId == IdList[j]){
						this.vodList.splice(i, 1);
					}
				}
			}
			if(!this.vodList.length){ //如果视频全部删除掉
				this.$emit('removeAllData',this.vodList)
				return false
			}
			if(this.vodIndex >= this.vodList.length - 1){ //数据少于当前播放的下标
				this.vodIndex = this.vodList.length - 1 < 0 ? 0 : this.vodList.length - 1
			}
			this.$nextTick(()=>{
				this.swiperVod(this.vodIndex); //播放视频
			})
		},
		/* 长按当前视频回调 */
		longpress(item){
			this.longDataInfo = {
				vodCurIndex: this.vodIndex,
				vodIndex: this.vodIndex,
				item: item
			}
			this.showVodMenu = true
			this.$emit('longpress', this.longDataInfo)
		},
		/* 设置倍数 */
		updateMultiplier(val){
			this.$refs[`myVideo${this.vodIndex}${this.swId}`][0].playbackRate(val);
			this.showVodMenu = false
			uni.showToast({
				title: '已切换至' + parseFloat(val) + '倍数播放',
				icon: 'none'
			})
		},
		/* 进入全屏 */
		openScreen(index){
			this.$refs[`myVideo${index}${this.swId}`][0].requestFullScreen();
		},
	/* 视频点赞、关注 */
	fabulousBtn(data) {
		this.$set(this.vodList, data.index, data.obj)
	},
	/* 处理VIP权限检查请求 */
	handleCheckVipPermission(data) {
		console.log("video-n.js 转发VIP权限检查请求:", data);
		this.$emit("checkVipPermission", data);
	},
	/* 更新视频评论数量 */
	updateVideoCommentCount(videoId, commentCount) {
		this.vodList.filter((item, index) => {
			if (item.id == videoId) {
				const updatedItem = Object.assign({}, item);
				updatedItem.commentCount = commentCount; // 使用接口返回的实际数量
				this.$set(this.vodList, index, updatedItem);
			}
		})
	}
}
}
