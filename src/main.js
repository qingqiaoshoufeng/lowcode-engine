import { createApp } from 'vue'
import Vant from 'vant'
import 'lib-flexible/flexible'
import App from './App.vue'
import router from './router'

import store from './store'
import axios from "@/plugins/axios/index.js";
import icons from '@/icons' // icon
import component from '@/component' // icon
import '@/styles/common.scss';
import 'vant/lib/index.css' // 全局引入样式
import './mock/mock'
import eventBus from './utils/eventBus'
import { registerPlugins } from './utils/util'
import directives from './directives/index';
import '@/assets/fonts/iconfont.js'
console.log(router);
const plugins = [Vant, store, axios, icons, component, eventBus, directives]
const app = createApp(App);
app.use(registerPlugins(plugins))
app.use(router)
app.mount("#app")
