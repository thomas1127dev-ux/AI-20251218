<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				账单明细
			</template>
			<template #right>
					<view class=""@click.stop="oparea">
						<up-icon name="more-dot-fill" color="#ffffff" size="28" v-if="more" ></up-icon>
					</view>
			</template>
		</up-navbar>
		<view class="list" v-for="(item,index) in dataList" :key="index">
			<view class="">  <text class="name"> {{ item.pay_method == 'gold' ?'金币充值':'vip充值'}} ({{ item.trade_no }}) </text> <text>{{ item.create_time.split(' ')[0] }}</text> </view>
			<view class="">  <text class="money">+{{ item.cash_amount }} 金额</text> <text>{{ item.create_time.split(' ')[1] }}</text> </view>
		</view>
	</z-paging>
</template>

<script setup>
	import {
		ref , reactive
	} from 'vue';
	import {
	bill
} from '@/api/public.js'
	const paging = ref(null)
	const show = ref(false)
	 	const oparea = () => {
		 show.value = true
	}
	  const dataList = ref([])
	  const queryList = (pageNo, pageSize) => {
             bill({
				currentPage:pageNo,
				 pageSize
			 }).then(res =>{
				paging.value.complete(res.data.results)
				
			 })


		return
				paging.value.complete([{title:'123'},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"},{title:"2243"}]);
			// })
	  }
	 
</script>

<style lang="scss" scoped>
	.list{
		padding: 20rpx 0;
		margin: 0 30rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, .1);
		color: rgba(255, 255, 255, .4);
		.name{
			color: #fff;
		}
		.money{
			font-size: 22rpx;
		}
		view{
			display: flex;
			justify-content: space-between;
			line-height: 50rpx;
		}
	}
</style>