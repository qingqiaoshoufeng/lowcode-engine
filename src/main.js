import { createApp } from 'vue'
import Vant from 'vant'
import 'lib-flexible/flexible'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "@/plugins/axios/index.js";
import icons from '@/icons' // icon
import component from '@/component' // icon
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import '@/styles/common.scss';
import 'vant/lib/index.css' // 全局引入样式
import eventBus from './utils/eventBus'
import { registerPlugins } from './utils/util'
import directives from './directives/index';
import './styles/index.scss'
import '@/assets/fonts/iconfont.js'
import 'dayjs/locale/zh-cn'
import FormPreviewText from '@/component/FormPreviewText/index'

dayjs.locale('zh-cn')
dayjs.extend(duration)

// console.log(router);
const plugins = [Vant, store, axios, icons, component, eventBus, directives, FormPreviewText]
const app = createApp(App);
app.use(registerPlugins(plugins))
app.use(router)
app.mount("#app")
