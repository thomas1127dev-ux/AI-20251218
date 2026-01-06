<template>
  <z-paging ref="paging" v-model="dataList" @query="queryList" style="bottom:0;">
    <view class="container">
      <!-- 签到 -->
      <view class="sign">
        <view class="tit">签到任务</view>
        <view class="task">
          <up-image radius="15rpx" :src="signlist.task_template_image_url" width="120rpx" height="120rpx"></up-image>
          <view class="name">{{ signlist.name }}</view>
        </view>
        <view class="steps">
          <up-steps activeColor="#6370f7" dot>
            <up-steps-item v-for="(item, index) in step" :key="index">
              <template #title>
                <view style="font-size: 11px">{{ index + 1 }}</view>
              </template>
              <template #desc>
                <view style="font-size: 11px">{{ item.status ? '已签到' : '待签到' }}</view>
              </template>
              <template #icon>
                <view style="width:20rpx;height:20rpx;border-radius:50%;"
                  :style="{ background: item.status ? '#6370f7' : '#969799' }" />
              </template>
            </up-steps-item>
          </up-steps>

          <!-- 签到 -->
          <up-button :text="signlist.status == 'pending' ? '待签到' : '已签到'" shape="circle" class="custom-style"
            @click="btn(signlist.id)" :class="signlist.status == 'pending' ? 'bg1' : 'bg2'"></up-button>
          <view class="sign-days">已连续签到{{ day }}天</view>
        </view>
      </view>

      <!-- 任务列表 -->
      <view class="task-list">
        <!-- 任务分类标签 -->
        <view class="task-tabs">
          <view class="tab-list">
            <view class="tab-item" :class="{ active: activeTab === 'daily' }" @click="switchTab('daily')">
              <text class="tab-text">每日任务</text>
            </view>
            <view class="tab-item" :class="{ active: activeTab === 'novice' }" @click="switchTab('novice')">
              <text class="tab-text">新手任务</text>
            </view>
          </view>
        </view>

        <!-- 任务 -->
        <view class="tasks">
          <view class="task-item" v-for="(item, index) in dataList" :key="index">
            <view class="task">
              <up-image :src="item.task_template_image_url" width="70rpx" height="70rpx" radius="50%"></up-image>
              <view class="des">
                <view class="title">{{ item.name }}</view>
                <view class="exp">{{ item.description }}</view>
              </view>
            </view>

            <up-button :text="statuslist[item.status]" class="custom-btn"
              :class="item.status == 'pending' ? 'bg1' : 'bg2'" shape="circle" @click="btn(item.id)"></up-button>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { taskList, addtask } from '@/api/common'
import { userinfoStore } from '@/store/userinfos';
const dataList = ref([]);
const signlist = ref([])
const currentStep = ref(1);
const paging = ref(null)
const cycleList = ref([])
const activeTab = ref('daily');
const switchTab = (tab) => {
  activeTab.value = tab;
  paging.value.reload();
};
const day = ref(0)
const step = ref([])
const statuslist = ({
  pending: '待领取',
  claimed: '已领取',
  completed: '已完成'
})
const queryList = (pageNo, pageSize) => {
  const params = {
    currentPage: pageNo,
    pageSize
  };
  taskList(params).then(res => {
    if (res.code === 200) {
      paging.value.complete(res.data.results.filter(item => item.task_template_type == activeTab.value));
      signlist.value = res.data.results.filter(item => item.task_template_type == 'checkin')[0]
      if(!signlist.value.data.claimed_times.length){
           generateDateList()
           return
      }
      getDate()

    } else {
      paging.value.complete(false);
    }
  })
}
const btn = (id) => {
  addtask(id)
    .then(res => {
      paging.value.reload();

    })
}

const getDate = () => {
  const set = new Set(signlist.value.data.claimed_times.map(d => d.slice(0, 10)))
  const start = new Date([...set].sort()[0]) // 最早那天
  const list = []
  let curStreak = 0
  let maxStreak = 0

  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const date = d.toISOString().slice(0, 10)
    const ok = set.has(date)
    list.push({ date, status: ok })

    if (ok) {
      curStreak++
      maxStreak = Math.max(maxStreak, curStreak)
    } else {
      curStreak = 0
    }
  }
  day.value = maxStreak
  step.value = list
}

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

const generateDateList = () => {
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const futureDate = new Date(now)
    futureDate.setDate(now.getDate() + i)
    step.value.push({
      date:formatDate(futureDate),
      status:false
    })
  }
}

// 页面显示时刷新用户信息
onShow(() => {
	userinfoStore().getUserinfo({ id: uni.getStorageSync('user_info').user_id })
});

</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;

  .sign {
    padding: 20rpx 30rpx;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 40rpx;

    .tit {
      font-size: 16px;
      margin-bottom: 20rpx;
    }

    .task {
      display: flex;
      flex-direction: column;
      align-items: center;

      .name {
        margin-top: 10rpx;
        font-size: 15px;
      }
    }

    .steps {
      margin-top: 20rpx;
    }

    .custom-style {
      // background: linear-gradient(180deg, #5662e1 0%, #614793 100%) !important;
      border: none !important;
      width: 340rpx !important;
      font-size: 17px !important;
      color: #fff !important;
      margin-top: 40rpx;
    }

    .sign-days {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      margin-top: 20rpx;
    }
  }
}

:deep(.u-steps-item__wrapper) {
  background-color: transparent !important;
}

.task-list {
  margin-top: 20rpx;
  padding: 20rpx 30rpx;
  border-radius: 40rpx;
  background: rgba(255, 255, 255, 0.03);

  .tab-list {
    margin-top: 20rpx;
    display: flex;
    background-color: #2d2d2d;
    border-radius: 40rpx;
    border: 2rpx solid #fff;
  }

  .tab-item {
    flex: 1;
    padding: 20rpx 0;
    text-align: center;
    border-radius: 40rpx;
    transition: all 0.3s linear;
    color: #fff;
  }

  .tab-item.active {
    background-color: #ffffff !important;

    .tab-text {
      color: #3a3939;
    }
  }

  .tab-text {
    font-size: 28rpx;
    color: #fff;
    font-size: 17px;
    font-weight: 500;
  }
}

.tasks {
  margin-top: 20rpx;

  .task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }

    .task {
      display: flex;
      align-items: center;
      flex: 1;

      .des {
        flex: 1;
        margin-left: 20rpx;

        .tit {
          font-size: 15px;
        }

        .exp {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }

    .custom-btn {
      width: 190rpx;
      border: none;
      color: #fff;
      font-size: 15px;
    }


  }
}

.bg1 {
  background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
}

.bg2 {
  background: #9b9b9b;
}
</style>

