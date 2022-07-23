import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import elementUi from '@/plugins/element'
//导入字体图标
import '@/assets/font_2895448_xn2c9e5c8gr/iconfont.css'
//导入全局样式表
import '@/assets/css/global.css'
// 安装树形表格组件
import TreeTable from 'vue-table-with-tree-grid'

//导入axios
import axios from 'axios'
import VueRouter from 'vue-router'

//导入vue-quill-editor  富文本编辑器 
import VueQuillEditor  from 'vue-quill-editor'
//导入富文本编辑器 对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//导入 NProgress包对应的JS和css
import NProgress from 'nprogress'   
import 'nprogress/nprogress.css'   // 导入样式，否则看不到效果

//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//在 request 拦截器中，展示进度条 NProgress.start();
axios.interceptors.request.use(config => {
  // console.log(config);
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
//在 response 拦截器中，隐藏进度条 NProgress.done();
axios.interceptors.response.use(config => {
  NProgress.done()
  return config

})


Vue.prototype.$http = axios


Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 将富文本编辑器 注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormate', function(originVal){
  const db = new Date(originVal)

  const y = db.getFullYear()
  const m = (db.getMonth() + 1 +'').padStart(2, '0')
  const d = (db.getDate() + '').padStart(2, '0')

  const hh = (db.getHours() + '').padStart(2, '0')
  const mm = (db.getMinutes() + '').padStart(2, '0')
  const ss = (db.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  // elementUI,
  render: h => h(App),
  router,
}).$mount('#app')
