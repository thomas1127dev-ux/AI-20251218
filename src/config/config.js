// 环境判断：自动识别开发/生产环境
let develop = false;

// #ifdef H5
// H5环境：通过 Vite 的环境变量判断
develop = import.meta.env?.DEV || false
// #endif

// #ifdef APP-PLUS
// APP环境：打包时 NODE_ENV 会自动设置
develop = process.env.NODE_ENV === 'development'
// #endif

// 根据环境自动切换接口地址
let host = 'https://collide.mnvjdhsl.com/api';  // 生产环境
if (develop) {
	host = '/api';  // 开发环境使用代理路径
}

console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

// AI聊天接口基础URL
// 直接使用完整域名，不走代理
const aiChatBaseUrl = 'https://rozanne-unbiddable-doria.ngrok-free.dev'

// AI聊天接口测试token
const aiChatTestToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxMjgzMTA2LCJpYXQiOjE3Njc2ODMxMDYsImp0aSI6IjMyYzE4MTI4YzcwZTQ1MzZiNDJmMGM2NjY4Y2IzOTUwIiwidXNlcl9pZCI6IjEifQ.pM045oe5vPWx5GTBftiQY1Oc3xZCNk9kurIuyt_QgBw'

export {
    host,
    aiChatBaseUrl,
    aiChatTestToken,
    develop  // 导出环境标识，方便调试
}