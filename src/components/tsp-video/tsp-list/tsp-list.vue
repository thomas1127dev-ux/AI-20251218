<template>
	<!-- #ifdef APP-NVUE -->
	<view :style="{height: height + 'px'}">
		<list ref="list" class="uni-list" loadmoreoffset="15" :scroll-y="scrollY" @loadmore="loadMore" :show-scrollbar="false">
			<slot />
		</list>
	</view>
	<!-- #endif -->
	<!-- #ifndef APP-NVUE -->
	<view :style="{height: height + 'px'}">
		<scroll-view class="uni-list" :scroll-y="scrollY" @scrolltolower="loadMore" :style="{height: height + 'px'}" :scroll-into-view="scrollViewId">
			<slot />
		</scroll-view>
	</view>
	<!-- #endif -->
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom')
	// #endif
	export default {
		name: 'UniList',
		props: {
			enableBackToTop: {
				type: [Boolean, String],
				default: false
			},
			scrollY: {
				type: [Boolean, String],
				default: true
			},
			height: {
				type: [Number, String]
			},
		},
		data() {
			return {
				scrollViewId: ''
			}
		},
		created() {
			
		},
		methods: {
			loadMore(e) {
				this.$emit("scrolltolower");
			},
			resetLoadmore() {
				this.$refs.list.resetLoadmore();
			},
			/* 滚动到指定位置节点 */
			scrollToView(uid,type){
				// #ifdef APP-NVUE
				dom.scrollToElement(uid, {
					offset: 0,
					animated: type == 'sqwb' ? true : false
				})
				// #endif
				
				// #ifndef APP-NVUE
				this.scrollViewId = ''
				this.$nextTick(()=>{
					this.scrollViewId = uid
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	.uni-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		position: relative;
		flex-direction: column;
	}
	/* #ifndef APP-NVUE */
	::v-deep ::-webkit-scrollbar {
	  display: none;
	}
	/* #endif */
</style>
