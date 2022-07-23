//手动配置element-ui
import Vue from 'vue'
//全局引入
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//导入弹框提示组件
import { Message } from 'element-ui'


Vue.prototype.$message = Message
Vue.prototype.$confirm = confirm


Vue.use(elementUI)








//手动配置element-ui
// import Vue from 'vue'
//按需导入
// import { Button, Form, FormItem, Input, Message } from 'element-ui'
// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
// Vue.prototype.$message = Message
