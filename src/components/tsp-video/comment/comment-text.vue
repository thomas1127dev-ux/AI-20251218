<template>
	<view v-if="conText">
		<text class="comment-list-item-contText" :id="'textClass'+ item.wbId" :class="[{textOmit: item.isOmit}]">
			{{conText}}
		</text>
		<text class="comment-list-item-contText-zk" v-if="item.isOmit && item.isShow" @click="expandText">... 展开</text>
		<text class="comment-list-item-contText-zk" v-if="!item.isOmit && item.isShow" @click="packUpText"> 收起</text>
	</view>
</template>

<script>
	export default {
		props: {
			//显示的文本类型：pl-评论列表的文本、hf-回复列表的文本
			//当前对象
			item:{
				type:Object,
				default:()=>{return {}}
			},
			showType:{
				type: [String],
				default: 'pl'
			},
			index: {
				type: [Number, String],
				default: ''
			},
			i: {
				type: [Number, String],
				default: ''
			},
			idx: {
				type: [Number, String],
				default: ''
			},
			conText: {
				type: String,
				default: ''
			}
		},
		data(){
			return {
				objInfo:{},
				isOmit: false, //是否收起
				isShow: false, //是否显示展开、收起
			}
		},
		created() {
			this.$nextTick(()=>{
				this.objInfo = Object.assign({},this.item)
				if(this.conText){
					setTimeout(()=>{
						this.getContClass('textClass' + this.item.wbId)
					},50)
				}
			})
		},
		methods: {
			/* 计算文本是否超过5行 */
			getContClass(val){
				this.$nextTick(()=>{
					uni.createSelectorQuery().in(this).select('#'+val).boundingClientRect().exec(rect => {
						let wbHeight = rect[0].height
						let wbRow = Math.ceil(wbHeight / 23) //文本的高度 / 文本行高 23 = 文本显示有多少行， 5*23 = 115(所以字体省略的高度为115px)
						if(wbRow > 5){
							this.objInfo.isShow = true
							this.objInfo.isOmit = true
							this.objInfo.isLoadText = true
							this.textCallbacks()
						}
					});
				})
			},
			/* 展开文本 */
			expandText(){
				this.objInfo.isOmit = false
				this.objInfo.isShow = true
				this.textCallbacks()
			},
			/* 收起文本 */
			packUpText(){
				this.objInfo.isOmit = true
				this.objInfo.isShow = true
				this.objInfo.isLoadText = false
				this.textCallbacks()
			},
			textCallbacks(){
				if(parseInt(this.i) >= 0 && parseInt(this.idx) >= 0){
					this.$emit('packUpText', 'sqwb', this.objInfo, this.index, this.i, this.idx)
				}else{
					this.$emit('packUpText', 'sqwb', this.objInfo, this.index)
				}
			}
		}
	}
</script>

<style scoped>
	.comment-list-item-contText {
		flex: 1;
		font-size: 15px;
		color: #333;
		line-height: 23px;
	}
	
	.comment-list-item-contText-zk{
		margin-top: 3px;
		color: #999;
		font-size: 14px;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}
	
	/*字体省略*/
	.textOmit{
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		height: 115px;
		overflow: hidden;
	}
</style>