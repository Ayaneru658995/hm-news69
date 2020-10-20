import Vue from 'vue'
import App from './App.vue'
// 引入公共样式
import './styles/base.less'
// 引入自动适配屏幕
import 'lib-flexible'
// 导入路由对象
import router from './router/index.js'
// 引入子组件
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmButton from './components/HmButton.vue'
import HmPost from './components/HmPost.vue'
import HmComment from './components/HmComment.vue'
import HmFloor from './components/HmFloor.vue'
// 引入字体图标
import './styles/iconfont.css'

// 注册全局组件
Vue.component('hm-floor', HmFloor)
Vue.component('hm-comment', HmComment)
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-post', HmPost)

// 按需引入组件
import { Field, Toast, Cell, CellGroup, Dialog, Radio, RadioGroup, Uploader, List, Tab, Tabs, PullRefresh, Sticky, Icon } from 'vant'


Vue.use(Icon)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
Vue.use(Sticky)

// 注册一个全局过滤器
import moment from 'moment'
Vue.filter('date', (val, format = 'YYYY-MM-DD') => {
  return moment(val).format(format)
})

// 把axios挂载到vue原型上面
import axios from 'axios'

// 添加axios基准地址
axios.defaults.baseURL = 'http://localhost:3000'

Vue.prototype.$axios = axios

// 设置请求拦截器
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// 设置响应拦截器
axios.interceptors.response.use(res => {
  const { statusCode, message } = res.data

  if (statusCode === 401 && message === '用户信息验证失败') {
    // 1. 删除失效的token
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    // 2. 跳转到login
    router.push('/login')
  }
  return res
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
