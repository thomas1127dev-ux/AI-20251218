<template>
	<view class="con">
		<view class="list" v-for="(item, index) in list" :key="index" @click="clicks(index)">
			<view :class="current == index ? 'title current-title' : 'title'">会员{{ item.days_num }}天</view>
			<view :class="current == index ? 'prices current-prices' : 'prices'"> {{ item.pay_price }} 元</view>
			<view :class="current == index ? 'ori-prices current-ori-prices' : 'ori-prices'">{{item.amount}}元</view>
			<view :class="current == index ? 'current-promotion promotion' : 'promotion'">{{ item.promotion_text || '暂无' }} </view>
		</view>
	</view>
</template>

<script setup>
import {
	ref,
	onMounted
} from 'vue'
import {
	paylist
} from '@/api/public.js'
const emits = defineEmits(['getmoney'])
const current = ref(0)
const list = ref([])
onMounted(() => {
	paylist({ pay_channel: 'vip' }).then(res => {
		list.value = res.data.results
		if (list.value.length > 0) {
			emits('getmoney', list.value[0].id, list.value[0].benefits)
		}
		console.log(list.value,'vlist.valulist.valu');
		
	})
})
const clicks = (index) => {
	current.value = index
	emits('getmoney', list.value[index].id, list.value[index].benefits)
}
</script>

<style lang="scss" scoped>
.con {
	display: flex;
	// justify-content: space-between;
	margin-bottom: 30rpx;
	flex-wrap: wrap;
}

.list {
	width: 30%;
	border: 4rpx solid rgba(255, 255, 255, .3);
	height: 300rpx;
	border-radius: 15rpx;
	overflow: hidden;
	display: flex;
	align-items: center;
	flex-direction: column;
	color: rgba(255, 255, 255, .3);
	margin-bottom: 20rpx;
    margin-right: 10rpx;
	.title {
		width: 100%;
		height: 60rpx;
		background: rgba(255, 255, 255, .4);
		text-align: center;
		color: #000;
		line-height: 60rpx;
		font-size: 24rpx;
		font-weight: bold;
	}

	.prices {
		margin: 30rpx 0 10rpx 0;
		font-size: 34rpx;
		font-weight: bold;
	}

	.ori-prices {
		font-size: 24rpx;
		text-decoration: line-through;
	}

	.promotion {
		margin-top: 60rpx;
		font-size: 22rpx;
	}

	.current-title {
		background: #F3D4AB;
	}

	.current-prices,
	.current-ori-prices {
		color: #F3D4AB;
	}

	.current-promotion {
		color: #FFF;
	}
}
.con .list:nth-of-type(3){
	 margin-right: 0 !important;
}
</style>