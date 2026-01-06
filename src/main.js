import { createSSRApp } from "vue";
import uviewPlus from 'uview-plus'
import App from "./App.vue";

// 平台区分处理 - 在顶层导入
// #ifdef H5
// H5端：使用 Pinia
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// #endif

uni.$zp = {
	config: {
		'default-page-size': 20,
	}
}

export function createApp() {
	const app = createSSRApp(App);
	app.use(uviewPlus);
	
	// 平台区分处理
	// #ifdef H5
	// H5端：使用 Pinia
	const pinia = createPinia()
	pinia.use(piniaPluginPersistedstate)
	app.use(pinia)
	// #endif
	
	// #ifdef APP-PLUS
	// APP端：跳过 Pinia，使用原生状态管理
	console.log('APP端跳过 Pinia，使用原生状态管理');
	// #endif
	
	return {
		app,
	};
}