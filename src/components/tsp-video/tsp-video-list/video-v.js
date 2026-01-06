/* 
 lodData 上拉加载回调
 refreshData 下拉加载回调
 */
export default {
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
		/* 自定义底部栏的高度 */
		tabBarHeight: {
			type: Number,
			default: 60
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
		/* 视频总数量，有值才能滑动加载到最后一个视频 */
		totalvod: {
			type: Number,
			default: 0
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
		/* 前后保留多少个视频数量节点 */
		keepVodNum: {
			type: Number,
			default: 1
		},
	},
	data() {
		return {
			videoStyle: {},
			screenWidth: 0, //屏幕的宽度
			screenHeight: 0, //屏幕的高度
			vodHeight: 0, //视频部分高度
			videoCtx: null,
			vodIndex: 0, // 当前视频下标
			currentIndex: 0, //定位播放的下标
			contentShow: false,
			loadShow: false,
			autoplayVideo: true, // 初始加载完成是否自动播放
			//当前播放的视频数组
			vodList: [
				/* {
					vodUrl:"https://outin-9cc4a7aedd2a11eaabb800163e1a65b6.oss-cn-shanghai.aliyuncs.com/customerTrans/43121ec9955a1ce95146d379f15ea9bd/566eafe2-17b52f0f17b-0007-0f29-cc2-eb217.mp4",
					coverImg:'/static/image/cover1.jpg', //视频封面
					vodPaly:true, //是否播放、暂停视频
					vodShow:true, //是否显示视频
					object_fit:'contain', //视频的显示类型
					pauseShow:false, //是否显示暂停图标
					loadingShow:false, //是否显示loading加载动画
					fabulousShow:false,//是否点赞
					followReally:false, //是否关注
					sliderShow:true, //是否显示进度条
					rotateImgShow:true, //是否显示旋转头像
				} */
			],
			totalPlayList: [],
			finalList: [],
			changeIndex: 0, //current 下标
			beforeVodInfo: {}, //当前播放视频对象
			vodCurIndex: 0, //当前播放视频对象下标
			circular: true,
			durationNum: 300,
			showShade: false, //显示遮罩swiper
			openSpot: false,
			shadeNum: 0,
			bufferTime: null, //缓冲视频显示加载动画防抖
			sliderProgress: 0, //进度条滑动层宽度
			sliderTime: 0, //显示滑动进度条时变化的时间
			videoTime: 0, //视频时长 时间
			endTime: 0, //滑动进度条最终的时间
			sliderDrag: false, //是否在拖动进度
			brightSlider: false, //是否显示光亮的进度条
			sliderEndTime: null, //滑动结束隐藏光亮进度条时间延迟
			bufferNum: null, //显示loading加载进度的时间条件
			bufferShow: false, //显示loading加载进度的条件
			playOpen: false, //视频播放失败，是否重播视频的条件
			failTime: null, //视频播放失败，重播视频的时间
			repeatTime: null,
			palyCartoon: false, //是否播放旋转头像
			shakePlay: false, //是否有防抖视频播放
			touchClientY: 0, //触碰的坐标
			moveClientY: 0, //移动的坐标
			moveOpacity: false, //是否透明
			refreshShow: false, //是否显示下拉刷新
			refreshOpacity: 0, //下拉刷新的透明度
			refreshclientY: 0, //下拉刷新的坐标
			refreshOpen: false, //下拉刷新的触发条件
			playErrTime: null,
			interceptIndex: [],
			loadTime: null,
			beginLoad: 0,
			loadStart: false,
			clickPlay: false, //是否是点击播放
			muteSetup: false, //是否设置为静音
			/* 双击点赞部分 */
			lastTapDiffTime: 0, //上次点击时间
			lastTapTimeoutFunc: null, //单击事件事件函数
			likeList:[], //双击点赞显示的桃心数据
			likeId:1,
			doubleOutTime:null,
			clearDoubleTime:null,
			
			tailPlay:false,
			autoplayNum:0,
			vodPageNum:3, //页面视频节点数量
			starLoad:true,
			loopVod:false ,//是否循环播放
			showVodMenu: false, //是否显示视频倍数操作弹窗
			longDataInfo: {}
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
		//页面视频节点数量
		this.vodPageNum = (this.keepVodNum * 2) + 1
		this.loopVod = this.loopPlay
	},
	watch: {
		vodCurIndex(newIndex, oldIndex) {
			/* 上一个视频处理 */
			if (oldIndex >= 0) {
				let oldObj = null
				this.vodList.filter((item, index) => {
					if (oldIndex == item.videoIndex) {
						item.vodPaly = false;
						item.pauseShow = false;
						item.loadingShow = false;
						// uni.createVideoContext('myVideo' + index + this.swId, this).pause();
						this.$refs[`myVideo${index}${this.swId}`][0].pause();
						this.$refs[`myVideo${index}${this.swId}`][0].playbackRate('1.0'); //重置倍数为1.0
						if(this.$refs[`bsczRef`]){
							this.$refs[`bsczRef`].multipleVod = '1.0' //重置倍数为1.0
						}
					}
				})
			}
		},
		loopPlay(newVal, oldVal){
			this.loopVod = this.loopPlay
		}
	},
	methods: {
		/* 初始加载视频 */
		initVod(dataList, index) {
			this.autoplayVideo = this.autoplay
			if (index) {
				this.durationNum = 0
			}
			let playIndex = index ? index : 0
			/* 拼接参数数据 */
			dataList.filter((item, i) => {
				item.videoIndex = i
				item.vodPaly = (i == playIndex ? true : false); //是否播放、暂停视频
				item.pauseShow = false //是否显示暂停图标
				item.loadingShow = false //是否显示loading加载动画
			})
			dataList.sort((a, b) => {
				return a.videoIndex - b.videoIndex
			})
			this.totalPlayList = dataList;
			this.contentShow = dataList.length > 0 ? true : false
			this.loadShow = dataList.length > 0 ? true : false
			if(this.totalPlayList.length >= this.vodPageNum){
				//视频节点数量
				for(let i=0; i < this.vodPageNum; i++){
					this.vodList.push({})
				}
			}else{
				this.vodList = dataList
			}
			this.getPlayVod(playIndex,'initialLoad')
		},
		/* 选择指定视频下标播放 */
		scrollToVod(playIndex){
			this.durationNum = 0
			this.getPlayVod(playIndex,null)
		},
		/* 根据指定下标播放 */
		getPlayVod(playIndex,uType){
			let currentNum = 0
			this.vodCurIndex = playIndex
			setTimeout(() => {
				if(this.totalPlayList.length >= this.vodPageNum){
					let amount = this.totalPlayList.length; //总视频数量
					let showVod = amount % this.vodPageNum
					let starIdx = playIndex - this.keepVodNum < 0 ? 0 : playIndex - this.keepVodNum
					let endIdx = playIndex + this.keepVodNum + 1
					let endNum = amount - showVod
					
					if (playIndex == 0 || (playIndex + 1) >= endNum) {
						this.circular = false //第一个视频和最后视频禁止循环滑动
						let resultList = []
						if (playIndex == 0) {
							resultList = JSON.parse(JSON.stringify(this.totalPlayList.slice(starIdx, playIndex + this.vodPageNum)))
						} else {
							resultList = JSON.parse(JSON.stringify(this.totalPlayList.slice(endNum - this.vodPageNum, endNum)))
						}
						this.setSliceList(resultList) /* 截取的视频数据对3求余数赋值 */
						/* 如果总视频数量对3求余数不为0，则追加剩余视频数据 */
						if (playIndex != 0) {
							let arrList = JSON.parse(JSON.stringify(this.totalPlayList.slice(endNum, amount)))
							arrList.filter(item => {
								this.vodList.push(item)
							})
							if(this.totalPlayList.length >= this.totalvod){
								this.loadShow = false
							}
						}
					} else {
						this.circular = true
						let resultList = JSON.parse(JSON.stringify(this.totalPlayList.slice(starIdx, endIdx)))
						this.setSliceList(resultList) /* 截取的视频数据对3求余数赋值 */
					}
				}else{
					this.circular = false //第一个视频和最后视频禁止循环滑动
				}
				this.getVodInfo();
				this.vodList.filter((item, index) => {
					if (this.vodCurIndex == item.videoIndex) {
						currentNum = index
					}
				})
				/* 到底加载数据 */
				if ((this.vodCurIndex + 1) >= this.totalPlayList.length - (this.totalPlayList.length % this.vodPageNum) && this.totalPlayList.length >= this.vodPageNum) {
					this.loadStart = true
					clearTimeout(this.loadTime)
					this.loadTime = setTimeout(() => {
						this.beginLoad = this.totalPlayList.length
						if((this.vodCurIndex + 1) == this.beginLoad){
							this.vodList[0].videoIndex = this.beginLoad
							this.tailPlay = true
						}
						console.log('this.tailPlay====>',this.tailPlay)
						this.$emit('lodData')
					}, 300)
				}
				if (playIndex > 0) { //开启定位播放
					this.currentIndex = currentNum
				}
				this.changeIndex = currentNum
				this.vodIndex = currentNum
			}, 100)
			setTimeout(() => {
				this.durationNum = 300
				if(uType == 'initialLoad'){
					if (this.autoplayVideo) {
						this.swiperPlay(currentNum);
					} else {
						this.beforeVodInfo.vodPaly = false;
						this.beforeVodInfo.pauseShow = true;
					}
				}else{
					this.swiperPlay(currentNum);
				}
			}, 200)
		},
		/* 赋值截取的数据 */
		setSliceList(resData){
			for(let i=0; i < this.vodPageNum; i++){
				resData.filter((item,index) => {
					if (item.videoIndex % this.vodPageNum == i) {
						this.vodList[i] = item
					}
				})
			}
		},
		/* 到底加载方法 */
		lodingData(dataList) {
			let num = this.totalPlayList.length; //获取视频数据的长度
			if(dataList && dataList.length == 0) return
			dataList.filter((item, i) => {
				item.videoIndex = num + i
				item.vodPaly = false //是否播放、暂停视频
				item.pauseShow = false //是否显示暂停图标
				item.loadingShow = false //是否显示loading加载动画
			})
			this.totalPlayList = this.totalPlayList.concat(dataList); //拼接数据
			this.$nextTick(() => {
				/* 截取要播放的视频列表 */
				this.getVodSliceList()
				setTimeout(()=>{
					/* 截取的视频数据对3求余数赋值 */
					for(let i=0; i < this.vodPageNum; i++){
						this.finalList.filter((item,index) => {
							if(item.videoIndex != this.vodCurIndex){
								if (item.videoIndex % this.vodPageNum == i) {
									this.vodList[i] = item
								}
							}
						})
					}
					let appendNum = this.totalvod - (this.totalvod % this.vodPageNum)
					/* 如果总视频数量对3求余数不为0，则追加剩余视频数据 */
					if (this.vodCurIndex != 0 && this.vodList.length == this.vodPageNum && (this.vodCurIndex + 1) >= appendNum && this.totalvod > 0) {
						let arrList = this.totalPlayList.slice(this.vodCurIndex + 1, this.totalPlayList.length)
						arrList.filter(item => {
							this.vodList.push(item)
						})
					}
					this.$nextTick(()=>{
						this.circular = true
					})
					if((this.vodCurIndex + 1) == this.beginLoad){
						this.vodList[0].videoIndex = this.beginLoad
						this.tailPlay = true
					}
				},100)
			})
		},
		/* 重新加载 */
		refreshSquare(dataList, index) {
			let playIndex = index ? index : 0
			this.resetData(); /* 重置状态数据 */
			this.refreshShow = false; //隐藏下拉刷新
			this.refreshOpen = false; //下拉刷新的触发条件
			this.vodCurIndex = 0
			this.currentIndex = 0
			this.vodList = []
			this.totalPlayList = []
			setTimeout(() => {
				this.initVod(dataList, playIndex); //初始加载视频
			}, 100)
		},
		/* 静音设置 */
		muteVideo(val){
			this.muteSetup = val
		},
		/* onShow播放视频 */
		showPlay() {
			if (this.vodIndex != null && this.contentShow && !this.beforeVodInfo.vodPaly) {
				this.videoPlay(this.vodIndex);
			}
		},
		/* onHide暂停视频 */
		hidePause() {
			if (this.vodIndex != null && this.contentShow && this.beforeVodInfo.vodPaly) {
				this.videoPause(this.vodIndex);
			}
			this.brightSlider = false; //隐藏光亮的进度条
		},
		/* 点击暂停、播放视频 */
		playSpot(index) {
			if (this.beforeVodInfo.vodPaly) { //暂停
				this.videoPause(index)
				this.beforeVodInfo.pauseShow = true; //显示暂停图标
			} else { //播放
				// 检查VIP权限
				const currentVideoData = this.totalPlayList.find(item => item.videoIndex === this.vodCurIndex);
				console.log('playSpot - 当前视频数据:', currentVideoData);
				console.log('playSpot - 视频is_vip:', currentVideoData?.is_vip);
				
				if (currentVideoData) {
					console.log('playSpot - 视频VIP状态:', currentVideoData.is_vip);
					
					// 如果视频不是VIP视频，直接播放
					if (!currentVideoData.is_vip) {
						console.log('playSpot - 非VIP视频，直接播放');
						this.clickPlay = true
						this.videoPlay(index)
						this.beforeVodInfo.pauseShow = false; //关闭暂停图标
						
						/* 解决手机浏览器h5前三个滑动不能自动播放的问题 */
						// #ifdef H5
						if(!this.autoplay && this.autoplayNum == 0){
							this.autoplayNum = 1
							this.vodList.filter((item,idx)=>{
								if(idx != index){
									// uni.createVideoContext('myVideo' + idx + this.swId, this).pause();
									this.$refs[`myVideo${idx}${this.swId}`][0].pause();
								}
							})
						}
						// #endif
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
								console.log('playSpot - 没有VIP权限，停止播放');
								// 没有VIP权限，不播放视频
								return;
							} else {
								// 有权限，继续播放
								this.clickPlay = true
								this.videoPlay(index)
								this.beforeVodInfo.pauseShow = false; //关闭暂停图标
								
								/* 解决手机浏览器h5前三个滑动不能自动播放的问题 */
								// #ifdef H5
								if(!this.autoplay && this.autoplayNum == 0){
									this.autoplayNum = 1
									this.vodList.filter((item,idx)=>{
										if(idx != index){
											// uni.createVideoContext('myVideo' + idx + this.swId, this).pause();
											this.$refs[`myVideo${idx}${this.swId}`][0].pause();
										}
									})
								}
								// #endif
							}
						}
					});
					return; // 等待回调结果
				} else {
					console.log('playSpot - 跳过VIP权限检查');
					console.log('playSpot - currentVideoData:', currentVideoData);
				}
			}
		},
		/* 播放视频 */
		videoPlay(index) {
			// 获取当前视频数据并检查VIP权限
			const currentVideoData = this.totalPlayList.find(item => item.videoIndex === this.vodCurIndex);
			console.log('videoPlay - 当前视频数据:', currentVideoData);
			console.log('videoPlay - 视频is_vip:', currentVideoData?.is_vip);
			
			if (currentVideoData) {
				console.log('videoPlay - 视频VIP状态:', currentVideoData.is_vip);
				
				// 如果视频不是VIP视频，直接播放
				if (!currentVideoData.is_vip) {
					console.log('videoPlay - 非VIP视频，直接播放');
					this.openSpot = true
					this.getVodInfo() //获取当前视频播放对象
					this.showShade = false //是否显示遮罩swiper
					this.beforeVodInfo.vodPaly = true;
					this.beforeVodInfo.pauseShow = false; //关闭暂停图标
					this.brightSlider = false; //隐藏光亮的进度条
					this.loadStart = false
					this.$nextTick(() => {
						this.moveOpacity = false
						// uni.createVideoContext('myVideo' + index + this.swId, this).play();
						this.$refs[`myVideo${index}${this.swId}`][0].play();
					})
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
							console.log('videoPlay - 没有VIP权限，停止播放');
							// 没有VIP权限，不播放视频
							return;
						} else {
							// 有权限，继续播放
							this.openSpot = true
							this.getVodInfo() //获取当前视频播放对象
							this.showShade = false //是否显示遮罩swiper
							this.beforeVodInfo.vodPaly = true;
							this.beforeVodInfo.pauseShow = false; //关闭暂停图标
							this.brightSlider = false; //隐藏光亮的进度条
							this.loadStart = false
							this.$nextTick(() => {
								this.moveOpacity = false
								// uni.createVideoContext('myVideo' + index + this.swId, this).play();
								this.$refs[`myVideo${index}${this.swId}`][0].play();
							})
						}
					}
				});
				return; // 等待回调结果
			} else {
				console.log('videoPlay - 跳过VIP权限检查');
			}
			
			this.openSpot = true
			this.getVodInfo() //获取当前视频播放对象
			this.showShade = false //是否显示遮罩swiper
			this.beforeVodInfo.vodPaly = true;
			this.beforeVodInfo.pauseShow = false; //关闭暂停图标
			this.brightSlider = false; //隐藏光亮的进度条
			this.loadStart = false
			this.$nextTick(() => {
				this.moveOpacity = false
				// uni.createVideoContext('myVideo' + index + this.swId, this).play();
				this.$refs[`myVideo${index}${this.swId}`][0].play();
			})
		},
		/* 暂停视频 */
		videoPause(index) {
			this.getVodInfo() //获取当前视频播放对象
			clearTimeout(this.sliderEndTime)
			this.beforeVodInfo.vodPaly = false;
			if (this.vodIndex == index && this.beforeVodInfo.sliderShow) {
				this.brightSlider = true; //显示光亮的进度条
			}
			this.$nextTick(() => {
				// uni.createVideoContext('myVideo' + index + this.swId, this).pause();
				this.$refs[`myVideo${index}${this.swId}`][0].pause();
			})
		},
		changeSwiper(ev) {
			let curIndex = ev.detail.current
			let videoIndex = this.vodList[curIndex].videoIndex
			this.moveOpacity = true
			this.shadeNum++
			this.openSpot = false
			this.autoplayVideo = true
			this.clickPlay = false
			this.loopVod = this.loopPlay
			let vodTotal = this.totalPlayList.length % this.vodPageNum
			if ((videoIndex == 0 || (videoIndex + 1) == this.totalPlayList.length - vodTotal) && this.shadeNum > 1) {
				this.showShade = true //是否显示遮罩swiper
			}
			this.changeIndex = curIndex
			this.currentIndex = curIndex
			/* 截取要播放的视频列表 */
			this.vodCurIndex = videoIndex //当前视频下标
			this.getVodSliceList()
			this.getVodInfo() //获取当前视频播放对象
		},
		/* 要播放视频的下标 */
		swiperVod(ev) {
			let curIndex = ev.detail.current
			if (this.openSpot) return
			this.resetData(); /* 重置状态数据 */
			this.moveOpacity = false
			this.showShade = false //是否显示遮罩swiper
			this.setSliceList(this.finalList) /* 截取的视频数据对3求余数赋值 */
			let endNum = this.totalPlayList.length - (this.totalPlayList.length % this.vodPageNum)
			let endPlay = false
			if (this.vodCurIndex == 0 || (this.vodCurIndex + 1) >= endNum) {
				this.circular = false
				let appendNum = this.totalvod - (this.totalvod % this.vodPageNum)
				/* 如果总视频数量对3求余数不为0，则追加剩余视频数据 */
				if (this.vodCurIndex != 0 && this.vodList.length == this.vodPageNum && (this.vodCurIndex + 1) >= appendNum && this.totalvod > 0) {
					let oldIndex = this.vodCurIndex
					let arrList = this.totalPlayList.slice(this.vodCurIndex + 1, this.totalPlayList.length)
					arrList.filter(item => {
						this.vodList.push(item)
					})
					/* endPlay = true
					this.againLocatePlay() // 重新定位播放 */
				}

			} else {
				let loadNum = this.beginLoad - (this.beginLoad % this.vodPageNum)
				/* 由于从外面指定的播放下标为当前数据的末端，比如10条数据，进来播放下标为8，然后又追加了余数剩下的视频，
				因为是末端所以又触发了分页加载数据，所以不删除多余的视频 */
				if(this.beginLoad > 0 && (this.vodCurIndex + 1) >= loadNum && (this.vodCurIndex + 1) <= this.beginLoad){
					// console.log('不删除多余的视频')
					if((this.vodCurIndex + 1) == this.beginLoad){
						this.vodList[0].videoIndex = this.beginLoad
						this.tailPlay = true
					}
				}else{
					if (this.vodList.length > this.vodPageNum) {
						this.vodList.length = this.vodPageNum
						// this.againLocatePlay() // 重新定位播放
					}
				}
				this.$nextTick(()=>{
					this.circular = true
				})
			}
			if(this.totalvod > 0){
				this.loadShow = this.totalPlayList.length >= this.totalvod ? false : true
			}
			/* 如果总视频数量对3求余数不为0，则追加剩余视频数据，有分页加载后重新定位要播放的视频下标 */
			if((this.vodCurIndex + 1) > this.beginLoad && this.beginLoad > 0 && this.tailPlay && !endPlay && this.beginLoad != this.totalPlayList.length){
				this.tailPlay = false
				this.durationNum = 0
				let currentNum = 0
				this.$nextTick(()=>{
					this.vodList.filter((item, index) => {
						if (item.videoIndex == this.beginLoad) {
							currentNum = index
						}
					})
					this.currentIndex = currentNum //定位播放
					this.changeIndex = currentNum
					setTimeout(()=>{
						this.durationNum = 300
						this.beginLoad = 0
					},100)
				})
			}
			if(!endPlay){
				this.vodIndex = this.changeIndex
				this.swiperPlay(this.vodIndex);
				this.$emit('swiperChange',this.vodList[this.vodIndex])
			}
			/* 到底加载数据 */
			if ((this.vodCurIndex + 1) >= this.totalPlayList.length - this.totalPlayList.length % this.vodPageNum && !this.loadStart && this.totalPlayList.length >= this.vodPageNum) {
				clearTimeout(this.loadTime)
				this.loadTime = setTimeout(() => {
					this.$emit('lodData')
				}, 300)
			}
			setTimeout(()=>{
				this.shadeNum = 0
			},1000)
		},
		/* 重新定位播放 */
		againLocatePlay(){
			this.durationNum = 0
			let currentNum = 0
			this.vodList.filter((item, index) => {
				if (this.vodCurIndex == item.videoIndex) {
					currentNum = index
				}
			})
			this.currentIndex = currentNum
			this.vodIndex = currentNum
			setTimeout(()=>{
				this.swiperPlay(this.vodIndex);
				this.durationNum = 300
			},100)
		},
		/* 获取当前视频播放对象 */
		getVodInfo() {
			this.vodList.filter(item => {
				if (this.vodCurIndex == item.videoIndex) {
					this.beforeVodInfo = item
				}
			})
		},
		/* 截取要播放的视频列表 */
		getVodSliceList() {
			let videoIndex = this.vodList[this.changeIndex].videoIndex
			let starIdx = videoIndex - this.keepVodNum < 0 ? 0 : videoIndex - this.keepVodNum
			let endIdx = videoIndex == 0 ? this.vodPageNum : videoIndex + this.keepVodNum + 1
			let resultList = JSON.parse(JSON.stringify(this.totalPlayList.slice(starIdx, endIdx)))
			for(let i=0; i < this.vodPageNum; i++){
				resultList.filter(item => {
					if (item.videoIndex % this.vodPageNum == i) {
						this.vodList[i].videoIndex = item.videoIndex
					}
				})
			}
			this.finalList = resultList
		},
		/* swiper播放视频 */
		swiperPlay(newIndex) {
			this.playOpen = false;
			clearInterval(this.failTime)
			clearInterval(this.repeatTime)
			this.muteVideo(false)
			/* 播放新视频 */
			let newVideoInfo = null
			// newVideoInfo = uni.createVideoContext('myVideo' + newIndex + this.swId, this)
			newVideoInfo = this.$refs[`myVideo${newIndex}${this.swId}`][0];
			if (newVideoInfo) {
				this.shakePlay = false
				this.videoPlay(newIndex);
			}
			this.$refs['menuRef' + newIndex + ''][0].likeeffect = null; //重置点赞的显示动画条件
		},
		/* 视频加载成功 */
		loadchange(ev,index){
			// console.log('视频加载成功==========>',ev,index)
			if(index == this.vodIndex && this.autoplayVideo){ //app.vue视频未播放成功继续播放
				this.againLocatePlay()
			}
		},
		/* 当开始/继续播放时 */
		startPlay(index) {
			if (this.vodIndex == index) {
				this.playOpen = false;
				if (this.beforeVodInfo.rotateImgShow) {
					this.palyCartoon = true; //开启旋转头像动画 
				}
				clearInterval(this.failTime)
				clearInterval(this.repeatTime)
			}
		},
		/* 视频出现缓冲 */
		bufferVod(index) {
			if (this.vodList.length > 0 && this.changeIndex == this.vodIndex && !this.bufferShow && this.beforeVodInfo.vodPaly) {
				this.playOpen = true;
				this.scheduleLoad()
			}
		},
		/* 视频播放失败 */
		errVod(index) {
			clearTimeout(this.playErrTime)
			this.playErrTime = setTimeout(() => {
				if (this.vodList.length > 0 && this.changeIndex == this.vodIndex && !this.bufferShow && this.beforeVodInfo.vodPaly) {
					this.playOpen = true;
					this.palyCartoon = false
					this.scheduleLoad()
				}
			}, 300)
		},
		/* 播放进度变化时触发 */
		timeupdateVod(ev, index) {
			if (this.vodIndex != index) return false
			if(ev.detail.currentTime > 0){
				this.shadeNum = 0
			}
			if (!this.sliderDrag) { //判断拖拽完成后才触发更新，避免播放是拖拽冲突失效
				this.videoTime = ev.detail.duration; //视频时间
				this.sliderTime = ev.detail.currentTime; //已播放时间
				this.sliderProgress = (ev.detail.currentTime / ev.detail.duration) * this.screenWidth; //播放进度
			}
			/* 关闭加载动画 */
			if (this.vodList.length > 0) {
				this.bufferNum = ev.detail.currentTime
				this.bufferShow = false;
				this.beforeVodInfo.loadingShow = false;
				clearTimeout(this.bufferTime)
				clearInterval(this.failTime)
				clearInterval(this.repeatTime)
			}
		},
		/* 显示进度加载动画 */
		scheduleLoad() {
			if (!this.bufferShow) {
				this.bufferShow = true;
				this.bufferTime = setTimeout(() => {
					this.beforeVodInfo.loadingShow = true
					if (this.playOpen) {
						this.vodLoad();
					}
				}, 2500)
			}
		},
		/* 重新播放视频 */
		vodLoad() {
			/* 视频播放失败，重新播放视频 */
			if (this.playOpen) {
				this.playOpen = false;
				if (this.sliderTime == 0) {
					// #ifndef APP-VUE
					uni.createVideoContext('myVideo' + this.vodIndex + this.swId, this).stop()
					// #endif
				}
				this.failTime = setTimeout(() => {
					this.playOpen = true;
					this.bufferShow = false;
					this.videoPlay(this.vodIndex)
				}, 1000)
			}
		},
		/* 视频播放结束 */
		endedVod(index){
			let endNum = this.totalPlayList.length - (this.totalPlayList.length % this.vodPageNum)
			let residueNum = this.totalPlayList.length % this.vodPageNum
			// console.log('视频播放结束',endNum,residueNum)
			if((this.vodCurIndex + 1) >= endNum && this.vodIndex == index && this.nextPlay && (this.vodCurIndex + 1) < this.totalPlayList.length){
				//总数据对this.vodPageNum求余不等于0
				if(this.vodIndex < (this.vodPageNum + residueNum) - 1){
					this.vodIndex += 1
				}
			}else if (this.vodIndex == index && this.nextPlay && (this.vodCurIndex + 1) < endNum) {
				if(this.vodIndex < this.vodPageNum - 1){
					this.vodIndex += 1
				}else{
					this.vodIndex = 0
				}
			}else{ //最后一个视频循环播放
				this.loopVod = true
				setTimeout(()=>{
					this.videoPlay(this.vodIndex)
				})
			}
			this.$nextTick(()=>{
				this.currentIndex = this.vodIndex
				this.$forceUpdate();
			})
		},
		// 根据秒获取时间
		formatSeconds(a) {
			let hh = parseInt(a / 3600);
			let mm = parseInt((a - hh * 3600) / 60);
			if (mm < 10) mm = "0" + mm;
			let ss = parseInt((a - hh * 3600) % 60);
			if (ss < 10) ss = "0" + ss;
			if (hh < 10) hh = hh == 0 ? '' : `0${hh}:`;
			let length = hh + mm + ":" + ss;
			if (a >= 0) {
				return length;
			} else {
				return "00:00";
			}
		},
		/* 进度条滑动 */
		touchmoveSlider(event) {
			// #ifndef APP-NVUE
			let objclientX = event.changedTouches[0].clientX
			// #endif

			// #ifdef APP-NVUE
			let objclientX = event.changedTouches[0].screenX
			// #endif
			this.sliderDrag = true; //是否在拖动进度
			if (objclientX >= 0 && objclientX <= (this.screenWidth - 2)) {
				clearTimeout(this.sliderEndTime)
				this.brightSlider = true; //显示光亮的进度条
				this.sliderProgress = objclientX
				let num = this.sliderProgress / (this.screenWidth - 2)
				this.sliderTime = num * this.videoTime; //滑动期间显示的时间
				this.endTime = num * this.videoTime; //最终滑动的时间
			}
		},
		/* 进度条滑动结束 */
		touchendSlider() {
			this.sliderDrag = false;
			let videoCtx = null
			// videoCtx = uni.createVideoContext('myVideo' + this.vodIndex + this.swId, this)
			videoCtx = this.$refs[`myVideo${this.vodIndex}${this.swId}`][0]
			
			// 保存拖动前的进度条位置
			const originalProgress = this.sliderProgress;
			const originalTime = this.sliderTime;
			
			// 检查VIP权限
			const currentVideoData = this.totalPlayList.find(item => item.videoIndex === this.vodCurIndex);
			if (currentVideoData) {
				console.log('touchendSlider - 视频VIP状态:', currentVideoData.is_vip);
				
				// 如果视频不是VIP视频，直接播放
				if (!currentVideoData.is_vip) {
					console.log('touchendSlider - 非VIP视频，直接播放');
					videoCtx.seek(this.endTime);
					videoCtx.play();
					this.beforeVodInfo.vodPaly = true; //开启播放
					this.beforeVodInfo.pauseShow = false; //关闭暂停图标
					this.sliderEndTime = setTimeout(() => {
						this.brightSlider = false; //隐藏光亮的进度条
					}, 2000)
					return;
				}
				
				// 如果是VIP视频，检查用户权限
				console.log('touchendSlider - VIP视频，开始检查用户权限');
				this.$emit('checkVipPermission', {
					videoData: currentVideoData,
					actionType: 'play',
					callback: (hasPermission) => {
						console.log('touchendSlider - VIP权限检查结果:', hasPermission);
						if (!hasPermission) {
							console.log('touchendSlider - 没有VIP权限，停止播放');
							// 没有VIP权限，恢复进度条到拖动前的位置
							this.sliderProgress = originalProgress;
							this.sliderTime = originalTime;
							this.endTime = originalTime;
							this.sliderEndTime = setTimeout(() => {
								this.brightSlider = false; //隐藏光亮的进度条
							}, 2000)
							return;
						} else {
							// 有权限，继续播放
							videoCtx.seek(this.endTime);
							videoCtx.play();
							this.beforeVodInfo.vodPaly = true; //开启播放
							this.beforeVodInfo.pauseShow = false; //关闭暂停图标
							this.sliderEndTime = setTimeout(() => {
								this.brightSlider = false; //隐藏光亮的进度条
							}, 2000)
						}
					}
				});
				return; // 等待回调结果
			} else {
				console.log('touchendSlider - 跳过VIP权限检查');
				videoCtx.seek(this.endTime);
				videoCtx.play();
				this.beforeVodInfo.vodPaly = true; //开启播放
				this.beforeVodInfo.pauseShow = false; //关闭暂停图标
				this.sliderEndTime = setTimeout(() => {
					this.brightSlider = false; //隐藏光亮的进度条
				}, 2000)
			}
		},
		/* 触碰的坐标 */
		vodViewStart(e) {
			// #ifndef APP-NVUE
			this.touchClientY = e.changedTouches[0].clientY
			// #endif
			// #ifdef APP-NVUE
			this.touchClientY = e.changedTouches[0].screenY
			// #endif
		},
		/* 上下滑动的坐标 */
		vodViewMove(e) {
			// #ifndef APP-NVUE
			this.moveClientY = e.changedTouches[0].clientY - this.touchClientY
			// #endif
			// #ifdef APP-NVUE
			this.moveClientY = e.changedTouches[0].screenY - this.touchClientY
			// #endif
			/* 是否透明进度条 */
			if (this.moveClientY > 0 || this.moveClientY < 0) {
				this.moveOpacity = true
			} else {
				this.moveOpacity = false
			}
			/* 显示下拉刷新 */
			if (this.loadOpen && this.vodCurIndex == 0 && !this.refreshOpen) {
				if (this.moveClientY > 10) {
					this.refreshShow = true; //显示下拉刷新
					if (this.moveClientY > 10 && this.moveClientY <= 60 && this.refreshShow) {
						this.refreshOpacity = (this.moveClientY / 60)
						this.refreshclientY = (this.moveClientY / 2)
					}
				} else {
					this.refreshShow = false
				}
			}
		},
		/* 滑动结束的坐标 */
		vodViewEnd(e) {
			// #ifndef APP-NVUE
			this.moveClientY = e.changedTouches[0].clientY - this.touchClientY
			// #endif
			// #ifdef APP-NVUE
			this.moveClientY = e.changedTouches[0].screenY - this.touchClientY
			// #endif
			/* 是否透明进度条 */
			this.moveOpacity = false
			/* 隐藏下拉刷新 */
			if (this.loadOpen && this.vodCurIndex == 0 && this.refreshShow) {
				/* 未达到刷新条件回弹隐藏 */
				if (this.moveClientY > 1 && this.moveClientY < 60 && !this.refreshOpen) {
					this.refreshOpacity = 0
					this.refreshclientY = 0
					setTimeout(() => {
						this.refreshShow = false
					}, 300)
				} else {
					/* 达到刷新条件 */
					if (this.refreshOpen) return
					this.refreshOpen = true;
					this.$emit('refreshData')
				}
			}
		},
		/* 重置状态数据 */
		resetData() {
			this.sliderProgress = 0; //进度条滑动层宽度
			this.sliderTime = 0; //显示滑动进度条时变化的时间
			this.videoTime = 0; //视频时长 时间
			this.endTime = 0; //滑动进度条最终的时间
			this.bufferNum = null; //显示loading加载进度的时间条件
			this.bufferShow = false; //显示loading加载进度的条件
			this.sliderDrag = false; //是否在拖动进度
			this.brightSlider = false; //是否显示光亮的进度条
			this.sliderEndTime = null; //滑动结束隐藏光亮进度条时间延迟
		},
		// 单击或双击
		handClick(event,index) {
			if(!this.doubleOpen){ //没有开启双击
				this.playSpot(index)
				return false
			}
			// 当前时间
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
						width:this.pxToRpx(95)+'rpx',
						height:this.pxToRpx(95)+'rpx',
						top:this.pxToRpx(topY) - this.pxToRpx(140)+'rpx',
						left:this.pxToRpx(leftX) - this.pxToRpx(95/2)+'rpx',
						rotate:rotateList[rNum],
						className:'',
						isShow:true
					}
					this.likeList.push(likeObj)
					this.doubleAddClass(likeObj.id)
					this.doubleOutTime = null
					clearTimeout(this.clearDoubleTime)
					this.clearDoubleTime = setTimeout(()=>{
						this.likeList = []
					},1500)
					this.$emit('doubleClick',this.vodList[this.vodIndex])
				},50)
			} else {
				// 单击事件延时300毫秒执行
				this.lastTapTimeoutFunc = setTimeout(()=> {
					// 执行方法
					this.playSpot(index)
				}, 300);
			}    
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
						this.likeList[index].className = 'doubleImageRemove'
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
		/* 添加视频 */
		addVodData(dataList,index){
			if(index >= 0){
				let sId = this.vodList[this.changeIndex].tsId //获取当前播放视频的id
				dataList.filter((item, i) => {
					item.vodPaly = false //是否播放、暂停视频
					item.pauseShow = false //是否显示暂停图标
					item.loadingShow = false //是否显示loading加载动画
					this.totalPlayList.splice(index+1, 0, item);
				})
				this.totalPlayList.filter((item,idx)=>{
					item.videoIndex = idx
				})
				/*  获取当前播放视频的下标 */
				let currNum = 0
				this.totalPlayList.filter((item,idx)=>{
					if(sId == item.tsId){
						currNum = idx
					}
				})
				this.vodCurIndex = currNum
				this.vodList[this.changeIndex].videoIndex = currNum
				this.getFilterData(sId); //截取、筛选数据
			}else{
				this.lodingData(dataList); //追加在数组后面
			}
		},
		/* 删除视频 */
		removeVodData(IdList){
			let sId = this.vodList[this.changeIndex].tsId //获取当前播放视频的id
			let newList = this.totalPlayList.filter(item=>!IdList.some(ele=>ele === item.tsId))
			newList.filter((item,idx)=>{
				item.videoIndex = idx
			})
			this.totalPlayList = newList
			if(!newList.length){ //如果视频全部删除掉
				this.vodList = []
				this.loadShow = false
				this.$emit('removeAllData',this.vodList)
				return false
			}
			this.beginLoad = this.totalPlayList.length
			setTimeout(()=>{
				if(this.totalPlayList.length <= this.vodPageNum){ //数据少于等于3条的时候
					this.vodList = []
					this.contentShow = false
					setTimeout(()=>{
						this.currentIndex = 0
						this.circular = false //禁止循环滑动
						this.changeIndex = 0
						this.vodIndex = 0
						this.vodCurIndex = 0
						this.vodList = newList
						this.$nextTick(()=>{
							this.contentShow = true
							setTimeout(()=>{
								this.swiperPlay(this.vodIndex);
							},50)
						})
					},50)
					return false;
				}
				if(this.vodCurIndex >= newList.length - 1){ //数据少于当前播放的下标
					let endNum = this.totalPlayList.length - (this.totalPlayList.length % this.vodPageNum)
					this.vodCurIndex = endNum - 1 < 0 ? 0 : endNum - 1
					this.vodList[this.changeIndex].videoIndex = this.vodCurIndex
					this.getFilterData(sId,1); //截取、筛选数据
					return false;
				}
				/* 正常数据删除 */
				/*  获取当前播放视频的下标 */
				let currNum = 0
				let currExist = false
				this.totalPlayList.filter((item,idx)=>{
					if(sId == item.tsId){
						currNum = idx
						currExist = true
					}
				})
				if(currExist){ //没有删除当前播放的视频
					this.vodCurIndex = currNum
					this.vodList[this.changeIndex].videoIndex = currNum
					this.getFilterData(sId,1); //截取、筛选数据
				}else{ //有删除当前播放的视频
					if(this.vodCurIndex >= newList.length - 1){
						this.vodCurIndex = newList.length - 1
					}
					this.vodList[this.changeIndex].videoIndex = this.vodCurIndex
					let cId = this.totalPlayList[this.vodCurIndex].tsId //获取当前播放下标视频的id
					this.getFilterData(cId,1); //截取、筛选数据
				}
			},30)
		},
		/* 截取、筛选数据 */
		getFilterData(sId,play){
			/* 截取要播放的视频列表 */
			this.getVodSliceList()
			if(play){
				this.contentShow = false
			}
			setTimeout(()=>{
				/* 截取的视频数据对3求余数赋值 */
				if(play){
					for(let i=0; i < this.vodPageNum; i++){
						this.finalList.filter(item => {
							if (item.videoIndex % this.vodPageNum == i) {
								this.$set(this.vodList, i, item)
							}
						})
					}
				}else{
					for(let i=0; i < this.vodPageNum; i++){
						this.finalList.filter(item => {
							if (item.videoIndex % this.vodPageNum == i && item.sId != sId) {
								this.$set(this.vodList, i, item)
							}
						})
					}
				}
				let appendNum = this.totalPlayList.length - (this.totalPlayList.length % this.vodPageNum)
				/* 如果总视频数量对3求余数不为0，则追加剩余视频数据 */
				if (this.vodCurIndex != 0 && this.vodList.length == this.vodPageNum && (this.vodCurIndex + 1) >= appendNum) {
					let arrList = this.totalPlayList.slice(this.vodCurIndex + 1, this.totalPlayList.length)
					arrList.filter(item => {
						this.vodList.push(item)
					})
				}
				if(play){
					this.durationNum = 0
					this.contentShow = true
				}
				this.$nextTick(()=>{
					let endNum = this.totalPlayList.length - (this.totalPlayList.length % this.vodPageNum)
					if (this.vodCurIndex == 0 || (this.vodCurIndex + 1) >= endNum) {
						this.circular = false
					}else{
						this.circular = true
					}
					if(play){
						let currentNum = 0
						this.vodList.filter((item, index) => {
							if (item.tsId == sId) {
								currentNum = index
							}
						})
						this.currentIndex = currentNum
						this.vodIndex = currentNum
						setTimeout(()=>{
							this.swiperPlay(this.vodIndex);
							this.durationNum = 300
							/* 到底加载数据 */
							if ((this.vodCurIndex + 1) >= this.totalPlayList.length - this.totalPlayList.length % this.vodPageNum && !this.loadStart) {
								clearTimeout(this.loadTime)
								this.loadTime = setTimeout(() => {
									this.$emit('lodData')
								}, 300)
							}
						},100)
					}
				})
			},50)
		},
		/* 长按当前视频回调 */
		longpress(item){
			this.longDataInfo = {
				vodCurIndex: this.vodCurIndex,
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
	/* 点赞关注操作 */
	handleInfo(obj) {
		this.totalPlayList.filter((item, index) => {
			if (item.videoIndex == obj.videoIndex) {
				this.$set(this.totalPlayList, index, obj)
			}
		})
		this.vodList.filter((item, index) => {
			if (item.videoIndex == obj.videoIndex) {
				this.$set(this.vodList, index, obj)
			}
		})
		/* 更新获取当前视频播放对象 */
		this.getVodInfo()
	},
	/* 处理VIP权限弹窗请求 */
	handleShowVipDialog(data) {
		console.log("video-v.js 转发VIP弹窗请求:", data);
		this.$emit("showVipDialog", data);
	},
	/* 处理金币购买弹窗请求 */
	handleShowCoinDialog(data) {
		console.log("video-v.js 转发金币购买弹窗请求:", data);
		this.$emit("showCoinDialog", data);
	},
	/* 处理金币不足弹窗请求 */
	handleShowInsufficientCoinDialog(data) {
		console.log("video-v.js 转发金币不足弹窗请求:", data);
		this.$emit("showInsufficientCoinDialog", data);
	},
	/* 处理VIP权限检查请求 */
	handleCheckVipPermission(data) {
		console.log("video-v.js 转发VIP权限检查请求:", data);
		this.$emit("checkVipPermission", data);
	},
	/* 更新视频评论数量 */
	updateVideoCommentCount(videoId, commentCount) {
		this.totalPlayList.filter((item, index) => {
			if (item.id == videoId) {
				const updatedItem = Object.assign({}, item);
				updatedItem.commentCount = commentCount; // 使用接口返回的实际数量
				this.$set(this.totalPlayList, index, updatedItem);
			}
		})
		this.vodList.filter((item, index) => {
			if (item.id == videoId) {
				const updatedItem = Object.assign({}, item);
				updatedItem.commentCount = commentCount; // 使用接口返回的实际数量
				this.$set(this.vodList, index, updatedItem);
			}
		})
		/* 更新获取当前视频播放对象 */
		this.getVodInfo()
	},
}
}