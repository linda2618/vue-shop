// src/router/index.js 就是当前项目的·路由模块
//导包
import Vue from 'vue'
import VueRouter from 'vue-router'
//导入登录组件
import Login from '@/components/login.vue'
//
import Home from '@/components/home.vue'
import Welcome from '@/components/welcome.vue'
import Users from '@/components/user/users.vue'
import Rights from '@/components/power/Rights.vue'
import Roles from '@/components/power/Roles.vue'
import Cate from '@/components/goods/Cate.vue'
import Params from '@/components/goods/Params.vue'
import List from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'
import Order from '@/components/order/Order.vue'
import Report from '@/components/report/Report.vue'



//调用Vue.use()函数，把 VueRouter 安装 Vue 的插件
Vue.use(VueRouter)

//创建路由的实例对象
const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component:Roles },
                {path:'/categories',component: Cate},
                {path:'/params',component: Params},
                {path:'/goods',component: List},
                {path:'/goods/add',component: Add},
                {path:'/orders',component: Order},
                {path:'/reports',component: Report},

            ]
        },

    ]
})
//路由导航守卫控制访问权限
//to 将要访问的路径， from 代表那个路径跳转而来， 
// next 是一个函数，表示放行， next() 放行; next('/login') 强制跳转
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()

})

//向外共享路由的实例对象
export default router