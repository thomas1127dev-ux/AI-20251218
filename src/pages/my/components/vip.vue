<template>
	<view class="page" @click="uni.navigateTo({url:'/pages/my/recharge'})">
		<view class="">
			<view class="">
				<text>VIP状态</text>
				<BadgeIcon/>
			</view>
			<view class="date">VIP剩余：{{ personInfo.vip_days }}天</view>
		</view>
		<view class="btn">续费</view>
	</view>
</template>

<script setup>
import {
	storeToRefs
} from 'pinia'
import {
	userinfoStore
} from '@/store/userinfos.js'
const store = userinfoStore()
const {
	personInfo
} = storeToRefs(store)


	import BadgeIcon from '../icon/badgeIcon.vue'
	const formatDate = (timestamp) =>{
         const d = new Date(timestamp)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
	}
	
</script>

<style lang="scss" scoped>
.page{
	background: linear-gradient(180deg, #F2E7CC 0%, #EFDDB3 100%);
	margin-top: 30rpx;
	height: 140rpx;
	border-radius: 20rpx;
	display: flex;
	padding: 20rpx 35rpx;
	box-sizing: border-box;
	align-items: center;
	justify-content: space-between;
	color: #3A3939;
	.date{
		font-size: 18rpx;
		margin-top: 20rpx;
	}
  .btn{
	  background: linear-gradient(270deg, #1B1922 0%, #322745 100%);
     color: #ffffff;
	 width: 170rpx;
	 height: 70rpx;
	 text-align: center;
	 line-height: 70rpx;
	 border-radius: 80rpx;
  }
  text{
	  font-weight: bold;
	  margin-right: 20rpx;
  }
}       
</style>
